// convex/events.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";
import { requireRoleQuery } from "./lib/authMiddleware";

export const logEvent = mutation({
  args: {
    leadId: v.id("leads"),
    type: v.string(),
    direction: v.optional(v.string()),
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    const ts = Date.now();
    return await ctx.db.insert("events", {
      ts,
      leadId: args.leadId,
      type: args.type,
      direction: args.direction,
      payload: args.payload,
    });
  },
});

export const listForLead = query({
  args: { leadId: v.id("leads"), limit: v.optional(v.number()) },
  handler: async (ctx, { leadId, limit }) => {
    const rows = await ctx.db
      .query("events")
      .withIndex("by_lead", q => q.eq("leadId", leadId))
      .order("desc")
      .take(limit ?? 50);
    return rows;
  },
});

export const listRecent = query({
  args: { token: v.string(), limit: v.optional(v.number()) },
  handler: requireRoleQuery(["admin", "manager", "foreman"], async (ctx, { limit }) => {
    return await ctx.db.query("events").withIndex("by_ts").order("desc").take(limit ?? 200);
  }),
});
