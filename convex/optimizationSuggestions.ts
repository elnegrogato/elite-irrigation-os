// convex/optimizationSuggestions.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get suggestions for a specific crew and date
 */
export const getSuggestionsForCrew = query({
  args: {
    crewId: v.string(),
    date: v.optional(v.number()),
  },
  handler: async (ctx, { crewId, date }) => {
    const targetDate = date ?? Date.now();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const suggestions = await ctx.db
      .query("optimizationSuggestions")
      .withIndex("by_crew")
      .filter((q) =>
        q.and(
          q.eq(q.field("crewId"), crewId),
          q.gte(q.field("date"), startOfDay.getTime()),
          q.lte(q.field("date"), endOfDay.getTime())
        )
      )
      .collect();

    return suggestions;
  },
});

/**
 * Get all pending suggestions
 */
export const getPendingSuggestions = query({
  args: {},
  handler: async (ctx) => {
    const suggestions = await ctx.db
      .query("optimizationSuggestions")
      .withIndex("by_status")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    return suggestions;
  },
});

/**
 * Generate daily optimization suggestions
 * Should be run nightly (via cron)
 */
export const generateDailySuggestions = mutation({
  args: { date: v.optional(v.number()) },
  handler: async (ctx, { date }) => {
    const targetDate = date ?? Date.now();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all active crews
    const crews = await ctx.db
      .query("crews")
      .withIndex("by_active")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    const generatedSuggestions = [];

    for (const crew of crews) {
      const crewId = crew._id.toString();

      // Get existing routes for this crew
      const existingRoutes = await ctx.db
        .query("routes")
        .withIndex("by_crew")
        .filter((q) =>
          q.and(
            q.eq(q.field("crewId"), crewId),
            q.gte(q.field("date"), startOfDay.getTime()),
            q.lte(q.field("date"), endOfDay.getTime())
          )
        )
        .collect();

      // If no existing route, skip
      if (existingRoutes.length === 0) continue;

      for (const route of existingRoutes) {
        // Skip if already optimized
        if (route.isOptimized && !route.manualOverride) continue;

        // Get unassigned stops for this date
        const { getUnassignedStops } = await import("./routeOptimization");
        const unassigned = await getUnassignedStops(ctx, { date: targetDate });

        // If there are unassigned stops, suggest adding them
        if (unassigned.length > 0) {
          // Calculate improvement potential
          const improvementPercent = calculateImprovementPotential(route, unassigned);

          // Only create suggestion if there's meaningful improvement
          if (improvementPercent > 5) {
            const suggestionId = await ctx.db.insert("optimizationSuggestions", {
              createdAt: Date.now(),
              updatedAt: Date.now(),
              crewId: crewId,
              date: targetDate,
              status: "pending",
              originalRouteId: route._id,
              originalStops: route.stops.map((s) => s.leadId!).filter(Boolean) as any,
              suggestedRoute: [],
              originalDistance: route.totalDistance,
              originalTime: route.totalTravelTime,
              suggestedDistance: route.totalDistance * 0.85, // Estimate
              suggestedTime: route.totalTravelTime * 0.9, // Estimate
              improvementPercent,
            });

            generatedSuggestions.push({
              id: suggestionId,
              crewId,
              improvement: improvementPercent,
            });
          }
        }
      }
    }

    return {
      success: true,
      count: generatedSuggestions.length,
      suggestions: generatedSuggestions,
    };
  },
});

/**
 * Accept a suggestion
 */
export const acceptSuggestion = mutation({
  args: { suggestionId: v.id("optimizationSuggestions") },
  handler: async (ctx, { suggestionId }) => {
    const suggestion = await ctx.db.get(suggestionId);
    if (!suggestion) {
      return { success: false, message: "Suggestion not found" };
    }

    if (suggestion.status !== "pending") {
      return { success: false, message: "Suggestion already processed" };
    }

    // Update suggestion status
    await ctx.db.patch(suggestionId, {
      status: "accepted",
      reviewedAt: Date.now(),
    });

    // If there's an original route, update it
    if (suggestion.originalRouteId) {
      await ctx.db.patch(suggestion.originalRouteId, {
        isOptimized: true,
        manualOverride: false,
        updatedAt: Date.now(),
      });
    }

    return { success: true, message: "Suggestion accepted" };
  },
});

/**
 * Reject a suggestion
 */
export const rejectSuggestion = mutation({
  args: {
    suggestionId: v.id("optimizationSuggestions"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { suggestionId, reason }) => {
    const suggestion = await ctx.db.get(suggestionId);
    if (!suggestion) {
      return { success: false, message: "Suggestion not found" };
    }

    await ctx.db.patch(suggestionId, {
      status: "rejected",
      reviewedAt: Date.now(),
      rejectionReason: reason,
    });

    return { success: true, message: "Suggestion rejected" };
  },
});

/**
 * Get suggestion analytics
 */
export const getSuggestionAnalytics = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, { startDate, endDate }) => {
    const start = startDate ?? Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    const end = endDate ?? Date.now();

    const suggestions = await ctx.db
      .query("optimizationSuggestions")
      .filter((q) =>
        q.and(
          q.gte(q.field("createdAt"), start),
          q.lte(q.field("createdAt"), end)
        )
      )
      .collect();

    const total = suggestions.length;
    const accepted = suggestions.filter((s) => s.status === "accepted").length;
    const rejected = suggestions.filter((s) => s.status === "rejected").length;
    const pending = suggestions.filter((s) => s.status === "pending").length;

    const avgImprovement =
      suggestions.reduce((sum, s) => sum + s.improvementPercent, 0) / total;

    const totalSavedDistance = suggestions
      .filter((s) => s.status === "accepted")
      .reduce((sum, s) => sum + (s.originalDistance - s.suggestedDistance), 0);

    const totalSavedTime = suggestions
      .filter((s) => s.status === "accepted")
      .reduce((sum, s) => sum + (s.originalTime - s.suggestedTime), 0);

    return {
      total,
      accepted,
      rejected,
      pending,
      acceptanceRate: total > 0 ? (accepted / total) * 100 : 0,
      avgImprovement: avgImprovement || 0,
      totalSavedDistance,
      totalSavedTime,
    };
  },
});

/**
 * Auto-expire old pending suggestions
 */
export const expireOldSuggestions = mutation({
  args: { maxAge: v.optional(v.number()) },
  handler: async (ctx, { maxAge }) => {
    const expireAge = maxAge ?? 7 * 24 * 60 * 60 * 1000; // 7 days default
    const cutoff = Date.now() - expireAge;

    const oldSuggestions = await ctx.db
      .query("optimizationSuggestions")
      .withIndex("by_status")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "pending"),
          q.lt(q.field("createdAt"), cutoff)
        )
      )
      .collect();

    for (const suggestion of oldSuggestions) {
      await ctx.db.patch(suggestion._id, {
        status: "expired",
      });
    }

    return {
      success: true,
      expired: oldSuggestions.length,
    };
  },
});

// Helper functions

function calculateImprovementPotential(route: any, unassignedStops: any[]): number {
  // Simplified improvement calculation
  const baseImprovement = 15; // Base 15% improvement from optimization
  const stopBonus = unassignedStops.length * 2; // 2% per unassigned stop
  const distancePenalty = route.totalDistance > 100 ? -5 : 0; // Penalty for long routes

  return Math.max(5, Math.min(50, baseImprovement + stopBonus + distancePenalty));
}

/**
 * Batch create suggestions from optimized routes
 */
export const createSuggestionsFromOptimizations = mutation({
  args: { optimizations: v.array(v.object({
    crewId: v.string(),
    routeId: v.id("routes"),
    originalDistance: v.number(),
    originalTime: v.number(),
    suggestedDistance: v.number(),
    suggestedTime: v.number(),
    date: v.number(),
  }))},
  handler: async (ctx, { optimizations }) => {
    const createdSuggestions = [];

    for (const opt of optimizations) {
      const improvementPercent =
        ((opt.originalDistance - opt.suggestedDistance) / opt.originalDistance) * 100;

      const suggestionId = await ctx.db.insert("optimizationSuggestions", {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        crewId: opt.crewId,
        date: opt.date,
        status: "pending",
        originalRouteId: opt.routeId,
        originalStops: [],
        suggestedRoute: [],
        originalDistance: opt.originalDistance,
        originalTime: opt.originalTime,
        suggestedDistance: opt.suggestedDistance,
        suggestedTime: opt.suggestedTime,
        improvementPercent,
      });

      createdSuggestions.push({
        id: suggestionId,
        crewId: opt.crewId,
        improvement: improvementPercent,
      });
    }

    return {
      success: true,
      count: createdSuggestions.length,
      suggestions: createdSuggestions,
    };
  },
});
