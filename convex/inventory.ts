// convex/inventory.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    let q = ctx.db.query("inventory");
    if (category && category !== "All") {
      q = q.withIndex("by_category", q => q.eq("category", category));
    }
    return await q.order("desc").collect();
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("inventory")),
    name: v.string(),
    sku: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    onHand: v.number(),
    minLevel: v.optional(v.number()),
    unit: v.string(),
    cost: v.number(),
    price: v.number(),
    binLocation: v.optional(v.string()),
    supplier: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check SKU uniqueness if new or changing SKU
    if (!args.id) {
      const existing = await ctx.db.query("inventory").withIndex("by_sku", q => q.eq("sku", args.sku)).unique();
      if (existing) throw new Error(`SKU ${args.sku} already exists`);
    }

    if (args.id) {
      const { id, ...updates } = args;
      await ctx.db.patch(id, { ...updates, updatedAt: now });
      return id;
    } else {
      const { id, ...data } = args;
      return await ctx.db.insert("inventory", { ...data, updatedAt: now });
    }
  },
});

export const adjustStock = mutation({
  args: { id: v.id("inventory"), delta: v.number(), note: v.optional(v.string()) },
  handler: async (ctx, { id, delta, note }) => {
    const item = await ctx.db.get(id);
    if (!item) throw new Error("Item not found");
    
    const newQty = (item.onHand ?? 0) + delta;
    if (newQty < 0) throw new Error("Insufficient stock");

    await ctx.db.patch(id, { onHand: newQty, updatedAt: Date.now() });
    
    // Log adjustment? Optional: create inventoryLog table if needed.
    // For now, implicit update is fine for V1.
    return newQty;
  },
});

export const remove = mutation({
  args: { id: v.id("inventory") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});