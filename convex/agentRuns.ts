// convex/agentRuns.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const log = mutation({
  args: {
    agentName: v.string(),
    action: v.string(),
    status: v.string(),
    policyKey: v.optional(v.string()),
    leadId: v.optional(v.id("leads")),
    payload: v.any(),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agentRuns", { ts: Date.now(), ...args });
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db.query("agentRuns").withIndex("by_ts").order("desc").take(limit ?? 200);
  },
});

export const listByAgent = query({
  args: { agentName: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { agentName, limit }) => {
    return await ctx.db.query("agentRuns").withIndex("by_agent", q => q.eq("agentName", agentName)).order("desc").take(limit ?? 200);
  },
});