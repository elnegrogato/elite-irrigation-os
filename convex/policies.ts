// convex/policies.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    return await ctx.db.query("policies").withIndex("by_key", q => q.eq("key", key)).unique();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    // small table, just return all
    return await ctx.db.query("policies").collect();
  },
});

export const upsert = mutation({
  args: { key: v.string(), value: v.any(), updatedBy: v.optional(v.string()) },
  handler: async (ctx, { key, value, updatedBy }) => {
    const now = Date.now();
    const existing = await ctx.db.query("policies").withIndex("by_key", q => q.eq("key", key)).unique();
    if (existing) {
      await ctx.db.patch(existing._id, { value, updatedAt: now, updatedBy });
      return existing._id;
    }
    return await ctx.db.insert("policies", { key, value, updatedAt: now, updatedBy });
  },
});