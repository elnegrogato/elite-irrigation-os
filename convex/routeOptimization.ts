// convex/routeOptimization.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  optimizeRoute,
  calculateDistance,
  estimateServiceTime,
  type Stop,
  type OptimizationConstraints,
} from "./lib/routeOptimizer";

/**
 * Get all unassigned stops for a specific date
 */
export const getUnassignedStops = query({
  args: { date: v.optional(v.number()) },
  handler: async (ctx, { date }) => {
    const targetDate = date ?? Date.now();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get appointments without crew assignment
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_time")
      .filter((q) =>
        q.and(
          q.gte(q.field("scheduledFor"), startOfDay.getTime()),
          q.lte(q.field("scheduledFor"), endOfDay.getTime()),
          q.eq(q.field("crewId"), undefined)
        )
      )
      .collect();

    // Get work orders without crew assignment
    const workOrders = await ctx.db
      .query("workOrders")
      .withIndex("by_scheduled")
      .filter((q) =>
        q.and(
          q.gte(q.field("scheduledFor"), startOfDay.getTime()),
          q.lte(q.field("scheduledFor"), endOfDay.getTime()),
          q.eq(q.field("assignedTo"), undefined)
        )
      )
      .collect();

    const stops: any[] = [];

    // Process appointments
    for (const appt of appointments) {
      const lead = await ctx.db.get(appt.leadId);
      if (!lead) continue;

      // Get location coordinates (simplified - you'd use a real geocoding service)
      const coords = await getLocationCoordinates(ctx, lead.locationSlug);
      if (!coords) continue;

      stops.push({
        id: appt._id.toString(),
        name: lead.name || "Customer",
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: lead.addressText,
        priority: getPriorityFromLead(lead),
        timeWindow: {
          start: appt.scheduledFor - appt.windowMins * 60000,
          end: appt.scheduledFor + appt.windowMins * 60000,
        },
        serviceTime: estimateServiceTime("consultation"),
        type: "appointment",
        leadId: appt.leadId,
        appointmentId: appt._id.toString(),
      });
    }

    // Process work orders
    for (const wo of workOrders) {
      const coords = await getLocationCoordinates(ctx, wo.locationSlug);
      if (!coords) continue;

      stops.push({
        id: wo._id.toString(),
        name: wo.serviceSlug,
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: wo.addressText,
        priority: getPriorityFromWorkOrder(wo),
        serviceTime: estimateServiceTime(wo.category),
        type: "workOrder",
        workOrderId: wo._id,
      });
    }

    return stops;
  },
});

/**
 * Get crew's last known location
 */
export const getCrewLocation = query({
  args: { crewId: v.string() },
  handler: async (ctx, { crewId }) => {
    // Get the crew
    const crews = await ctx.db
      .query("crews")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    const crew = crews.find((c) => c.name === crewId || c._id.toString() === crewId);
    if (!crew) return null;

    // For now, return home base as default location
    // In production, you'd track GPS from mobile app
    return {
      latitude: 35.323, // Harrisburg, NC
      longitude: -80.655,
      name: "Home Base",
    };
  },
});

/**
 * Optimize route for a specific crew and date
 */
export const optimizeRouteForCrew = mutation({
  args: {
    crewId: v.string(),
    date: v.optional(v.number()),
    options: v.optional(
      v.object({
        maxStops: v.optional(v.number()),
        maxTravelTime: v.optional(v.number()),
        prioritizeTimeWindows: v.optional(v.boolean()),
        prioritizePriority: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx, { crewId, date, options }) => {
    const targetDate = date ?? Date.now();

    // Get unassigned stops
    const stops = await getUnassignedStops(ctx, { date: targetDate });

    if (stops.length === 0) {
      return { success: false, message: "No unassigned stops found" };
    }

    // Get crew location
    const crewLocation = await getCrewLocation(ctx, { crewId });

    // Build optimization constraints
    const constraints: OptimizationConstraints = {
      startLocation: crewLocation ?? undefined,
      maxStops: options?.maxStops ?? 10,
      maxTravelTime: options?.maxTravelTime ?? 480, // 8 hours
      prioritizeTimeWindows: options?.prioritizeTimeWindows ?? true,
      prioritizePriority: options?.prioritizePriority ?? true,
      trafficFactor: 1.2,
    };

    // Optimize route
    const optimizedRoute = optimizeRoute(stops as Stop[], constraints);

    // Create route record
    const routeId = await ctx.db.insert("routes", {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      crewId,
      date: targetDate,
      name: `Route for ${crewId} - ${new Date(targetDate).toLocaleDateString()}`,
      status: "draft",
      stops: optimizedRoute.stops.map((stop, idx) => ({
        id: stop.id,
        name: stop.name,
        latitude: stop.latitude,
        longitude: stop.longitude,
        address: stop.address,
        order: idx,
        estimatedArrival: stop.arrivalTime ?? 0,
        estimatedDeparture: stop.departureTime ?? 0,
        serviceTime: stop.serviceTime,
        priority: stop.priority,
        timeWindowStart: stop.timeWindow?.start,
        timeWindowEnd: stop.timeWindow?.end,
        leadId: (stop as any).leadId,
        workOrderId: (stop as any).workOrderId,
        appointmentId: (stop as any).appointmentId,
      })),
      isOptimized: true,
      optimizationScore: optimizedRoute.efficiencyScore,
      manualOverride: false,
      totalDistance: optimizedRoute.totalDistance,
      totalTravelTime: optimizedRoute.totalTravelTime,
      totalServiceTime: optimizedRoute.totalServiceTime,
      startLatitude: crewLocation?.latitude,
      startLongitude: crewLocation?.longitude,
    });

    return {
      success: true,
      routeId,
      route: optimizedRoute,
      message: "Route optimized successfully",
    };
  },
});

/**
 * Suggest routes for all crews for a specific date
 */
export const suggestRouteForDay = mutation({
  args: { date: v.optional(v.number()) },
  handler: async (ctx, { date }) => {
    const targetDate = date ?? Date.now();

    // Get all active crews
    const crews = await ctx.db
      .query("crews")
      .withIndex("by_active")
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    const suggestions = [];

    for (const crew of crews) {
      const crewId = crew._id.toString();
      const result = await optimizeRouteForCrew(ctx, {
        crewId,
        date: targetDate,
      });

      if (result.success) {
        suggestions.push({
          crewId: crew.name || crewId,
          routeId: result.routeId,
          efficiencyScore: result.route?.efficiencyScore ?? 0,
          totalDistance: result.route?.totalDistance ?? 0,
          totalStops: result.route?.stops.length ?? 0,
        });
      }
    }

    return {
      success: true,
      suggestions,
      date: targetDate,
    };
  },
});

/**
 * Accept a suggested route and activate it
 */
export const acceptSuggestedRoute = mutation({
  args: { routeId: v.id("routes") },
  handler: async (ctx, { routeId }) => {
    const route = await ctx.db.get(routeId);
    if (!route) {
      return { success: false, message: "Route not found" };
    }

    // Update route status to active
    await ctx.db.patch(routeId, {
      status: "active",
      updatedAt: Date.now(),
    });

    // Assign stops to crew
    for (const stop of route.stops) {
      if (stop.appointmentId) {
        // Find and update appointment
        const appointments = await ctx.db
          .query("appointments")
          .filter((q) => q.eq(q.field("_id"), stop.appointmentId))
          .collect();

        if (appointments.length > 0) {
          await ctx.db.patch(appointments[0]._id, {
            crewId: route.crewId,
          });
        }
      }

      if (stop.workOrderId) {
        await ctx.db.patch(stop.workOrderId, {
          assignedTo: route.crewId,
        });
      }
    }

    // Update any pending suggestions
    const pendingSuggestions = await ctx.db
      .query("optimizationSuggestions")
      .withIndex("by_status")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("crewId"), route.crewId)
        )
      )
      .collect();

    for (const suggestion of pendingSuggestions) {
      await ctx.db.patch(suggestion._id, {
        status: "accepted",
        reviewedAt: Date.now(),
      });
    }

    return { success: true, message: "Route activated successfully" };
  },
});

/**
 * Get all routes for a specific date
 */
export const getRoutesForDate = query({
  args: { date: v.optional(v.number()) },
  handler: async (ctx, { date }) => {
    const targetDate = date ?? Date.now();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const routes = await ctx.db
      .query("routes")
      .withIndex("by_date")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), startOfDay.getTime()),
          q.lte(q.field("date"), endOfDay.getTime())
        )
      )
      .collect();

    return routes;
  },
});

/**
 * Get route details with stop information
 */
export const getRouteDetails = query({
  args: { routeId: v.id("routes") },
  handler: async (ctx, { routeId }) => {
    const route = await ctx.db.get(routeId);
    if (!route) return null;

    // Enrich stop data with lead/work order details
    const enrichedStops = await Promise.all(
      route.stops.map(async (stop) => {
        const enriched: any = { ...stop };

        if (stop.leadId) {
          const lead = await ctx.db.get(stop.leadId);
          if (lead) {
            enriched.lead = lead;
          }
        }

        if (stop.workOrderId) {
          const workOrder = await ctx.db.get(stop.workOrderId);
          if (workOrder) {
            enriched.workOrder = workOrder;
          }
        }

        return enriched;
      })
    );

    return {
      ...route,
      stops: enrichedStops,
    };
  },
});

/**
 * Update route (manual override)
 */
export const updateRoute = mutation({
  args: {
    routeId: v.id("routes"),
    stops: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          latitude: v.number(),
          longitude: v.number(),
          address: v.optional(v.string()),
          order: v.number(),
          estimatedArrival: v.number(),
          estimatedDeparture: v.number(),
          serviceTime: v.number(),
          priority: v.number(),
        })
      )
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { routeId, stops, notes }) => {
    const route = await ctx.db.get(routeId);
    if (!route) {
      return { success: false, message: "Route not found" };
    }

    const updateData: any = {
      updatedAt: Date.now(),
      manualOverride: true,
    };

    if (stops) {
      updateData.stops = stops;

      // Recalculate metrics
      let totalDistance = 0;
      let totalServiceTime = 0;

      for (let i = 0; i < stops.length; i++) {
        totalServiceTime += stops[i].serviceTime;
        if (i > 0) {
          const dist = calculateDistance(
            { latitude: stops[i - 1].latitude, longitude: stops[i - 1].longitude, id: "", name: "" },
            { latitude: stops[i].latitude, longitude: stops[i].longitude, id: "", name: "" }
          );
          totalDistance += dist;
        }
      }

      const totalTravelTime = totalDistance * 2; // Rough estimate

      updateData.totalDistance = totalDistance;
      updateData.totalTravelTime = totalTravelTime;
      updateData.totalServiceTime = totalServiceTime;
      updateData.optimizationScore = Math.max(0, 100 - totalDistance * 0.1);
    }

    if (notes) {
      updateData.notes = notes;
    }

    await ctx.db.patch(routeId, updateData);

    return { success: true, message: "Route updated successfully" };
  },
});

/**
 * Delete a route
 */
export const deleteRoute = mutation({
  args: { routeId: v.id("routes") },
  handler: async (ctx, { routeId }) => {
    await ctx.db.delete(routeId);
    return { success: true, message: "Route deleted successfully" };
  },
});

// Helper functions

async function getLocationCoordinates(
  ctx: any,
  locationSlug: string | undefined
): Promise<{ latitude: number; longitude: number } | null> {
  if (!locationSlug) return null;

  // Simplified - you'd use a real geocoding service here
  // For now, return coordinates for Charlotte area
  const coords: Record<string, { latitude: number; longitude: number }> = {
    charlotte: { latitude: 35.227, longitude: -80.843 },
    harrisburg: { latitude: 35.323, longitude: -80.655 },
    concord: { latitude: 35.408, longitude: -80.579 },
    matthews: { latitude: 35.116, longitude: -80.716 },
    mint_hill: { latitude: 35.181, longitude: -80.662 },
    pineville: { latitude: 34.97, longitude: -80.889 },
  };

  return coords[locationSlug] ?? null;
}

function getPriorityFromLead(lead: any): number {
  if (lead.urgency === "emergency") return 5;
  if (lead.urgency === "urgent") return 4;
  if (lead.urgency === "soon") return 3;
  return 2;
}

function getPriorityFromWorkOrder(wo: any): number {
  if (wo.priority === "emergency") return 5;
  if (wo.priority === "high") return 4;
  if (wo.priority === "medium") return 3;
  return 2;
}
