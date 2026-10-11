// convex/emailPreferences.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";

/**
 * Get email preferences for a lead
 * Creates default preferences if they don't exist
 */
export const getPreferences = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const preferences = await ctx.db
      .query("emailPreferences")
      .withIndex("by_lead", (q) => q.eq("leadId", leadId))
      .first();

    // Return defaults if not set
    if (!preferences) {
      return {
        estimates: true,
        invoices: true,
        reminders: true,
        promotions: false, // Default to false for promotional
        reviews: true,
        unsubscribed: false,
      };
    }

    return {
      estimates: preferences.estimates,
      invoices: preferences.invoices,
      reminders: preferences.reminders,
      promotions: preferences.promotions,
      reviews: preferences.reviews,
      unsubscribed: preferences.unsubscribed,
    };
  },
});

/**
 * Update email preferences for a lead
 */
export const updatePreferences = mutation({
  args: {
    leadId: v.id("leads"),
    preferences: v.object({
      estimates: v.optional(v.boolean()),
      invoices: v.optional(v.boolean()),
      reminders: v.optional(v.boolean()),
      promotions: v.optional(v.boolean()),
      reviews: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, { leadId, preferences }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("emailPreferences")
      .withIndex("by_lead", (q) => q.eq("leadId", leadId))
      .first();

    if (existing) {
      // Update existing preferences
      await ctx.db.patch(existing._id, {
        ...preferences,
        updatedAt: now,
      });
      return existing._id;
    } else {
      // Create new preferences with defaults for unspecified values
      await ctx.db.insert("emailPreferences", {
        leadId,
        createdAt: now,
        updatedAt: now,
        estimates: preferences.estimates ?? true,
        invoices: preferences.invoices ?? true,
        reminders: preferences.reminders ?? true,
        promotions: preferences.promotions ?? false,
        reviews: preferences.reviews ?? true,
        unsubscribed: false,
        totalEmailsSent: 0,
        totalEmailsOpened: 0,
      });
      return null;
    }
  },
});

/**
 * Unsubscribe from a specific email category
 */
export const unsubscribe = mutation({
  args: {
    leadId: v.id("leads"),
    category: v.string(), // "estimates", "invoices", "reminders", "promotions", "reviews", or "all"
  },
  handler: async (ctx, { leadId, category }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("emailPreferences")
      .withIndex("by_lead", (q) => q.eq("leadId", leadId))
      .first();

    if (category === "all") {
      // Global unsubscribe
      if (existing) {
        await ctx.db.patch(existing._id, {
          unsubscribed: true,
          unsubscribedAt: now,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("emailPreferences", {
          leadId,
          createdAt: now,
          updatedAt: now,
          estimates: false,
          invoices: false,
          reminders: false,
          promotions: false,
          reviews: false,
          unsubscribed: true,
          unsubscribedAt: now,
          totalEmailsSent: 0,
          totalEmailsOpened: 0,
        });
      }
    } else {
      // Category-specific unsubscribe
      if (existing) {
        await ctx.db.patch(existing._id, {
          [category]: false,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("emailPreferences", {
          leadId,
          createdAt: now,
          updatedAt: now,
          estimates: category === "estimates" ? false : true,
          invoices: category === "invoices" ? false : true,
          reminders: category === "reminders" ? false : true,
          promotions: category === "promotions" ? false : false,
          reviews: category === "reviews" ? false : true,
          unsubscribed: false,
          totalEmailsSent: 0,
          totalEmailsOpened: 0,
        });
      }
    }
  },
});

/**
 * Re-subscribe to a category or all emails
 */
export const resubscribe = mutation({
  args: {
    leadId: v.id("leads"),
    category: v.string(), // "estimates", "invoices", "reminders", "promotions", "reviews", or "all"
  },
  handler: async (ctx, { leadId, category }) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("emailPreferences")
      .withIndex("by_lead", (q) => q.eq("leadId", leadId))
      .first();

    if (category === "all") {
      // Global resubscribe
      if (existing) {
        await ctx.db.patch(existing._id, {
          unsubscribed: false,
          unsubscribedAt: undefined,
          estimates: true,
          invoices: true,
          reminders: true,
          reviews: true,
          updatedAt: now,
        });
      }
    } else {
      // Category-specific resubscribe
      if (existing) {
        await ctx.db.patch(existing._id, {
          [category]: true,
          updatedAt: now,
        });
      }
    }
  },
});

/**
 * Check if a lead can receive emails of a specific type
 */
export const canSendEmail = query({
  args: {
    leadId: v.id("leads"),
    category: v.string(), // "estimates", "invoices", "reminders", "promotions", "reviews"
  },
  handler: async (ctx, { leadId, category }) => {
    const preferences = await ctx.db
      .query("emailPreferences")
      .withIndex("by_lead", (q) => q.eq("leadId", leadId))
      .first();

    // If no preferences set, allow all except promotions
    if (!preferences) {
      return category !== "promotions";
    }

    // Check global unsubscribe
    if (preferences.unsubscribed) {
      return false;
    }

    // Check category-specific preference
    const categoryPreference = preferences[category as keyof typeof preferences] as boolean | undefined;
    return categoryPreference ?? true;
  },
});

/**
 * Track email engagement (opens, clicks)
 */
export const trackEmailEngagement = mutation({
  args: {
    leadId: v.id("leads"),
    messageId: v.id("outboundMessages"),
    type: v.string(), // "open" or "click"
  },
  handler: async (ctx, { leadId, messageId, type }) => {
    const now = Date.now();

    // Update outbound message tracking
    const message = await ctx.db.get(messageId);
    if (message) {
      if (type === "open") {
        await ctx.db.patch(messageId, { openedAt: now });
      } else if (type === "click") {
        await ctx.db.patch(messageId, { clickedAt: now });
      }
    }

    // Update email preferences
    const preferences = await ctx.db
      .query("emailPreferences")
      .withIndex("by_lead", (q) => q.eq("leadId", leadId))
      .first();

    if (preferences) {
      const updates: any = {
        updatedAt: now,
      };

      if (type === "open") {
        updates.lastOpenedAt = now;
        updates.totalEmailsOpened = (preferences.totalEmailsOpened || 0) + 1;
      } else if (type === "click") {
        updates.lastClickedAt = now;
      }

      await ctx.db.patch(preferences._id, updates);
    }
  },
});

/**
 * Increment email sent counter
 */
export const incrementEmailSent = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const preferences = await ctx.db
      .query("emailPreferences")
      .withIndex("by_lead", (q) => q.eq("leadId", leadId))
      .first();

    if (preferences) {
      await ctx.db.patch(preferences._id, {
        totalEmailsSent: (preferences.totalEmailsSent || 0) + 1,
        updatedAt: Date.now(),
      });
    }
  },
});
