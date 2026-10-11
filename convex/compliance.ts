// convex/compliance.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";

function calculateStatus(expiryDate: number) {
  const now = Date.now();
  const daysUntil = (expiryDate - now) / (1000 * 60 * 60 * 24);
  
  if (daysUntil < 0) return "expired";
  if (daysUntil <= 30) return "expiring";
  return "valid";
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("complianceDocs").order("asc").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    identifier: v.optional(v.string()),
    expiryDate: v.number(),
    storageId: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const status = calculateStatus(args.expiryDate);
    
    let fileUrl = undefined;
    if (args.storageId) {
      fileUrl = await ctx.storage.getUrl(args.storageId) ?? undefined;
    }

    return await ctx.db.insert("complianceDocs", {
      createdAt: now,
      updatedAt: now,
      name: args.name,
      type: args.type,
      identifier: args.identifier,
      expiryDate: args.expiryDate,
      status,
      storageId: args.storageId,
      fileUrl,
      notes: args.notes,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("complianceDocs"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    identifier: v.optional(v.string()),
    expiryDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (!doc) throw new Error("Document not found");

    const updates: any = { updatedAt: Date.now(), ...args };
    delete updates.id;

    if (args.expiryDate) {
      updates.status = calculateStatus(args.expiryDate);
    }

    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("complianceDocs") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// Run daily to update statuses
export const checkExpiry = mutation({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("complianceDocs").collect();
    let updated = 0;

    for (const doc of docs) {
      const newStatus = calculateStatus(doc.expiryDate);
      if (doc.status !== newStatus) {
        await ctx.db.patch(doc._id, { status: newStatus, updatedAt: Date.now() });
        updated++;
      }
    }
    return { updated };
  },
});