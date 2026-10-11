// convex/fleet.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("fleet").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    status: v.string(),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    year: v.optional(v.number()),
    vin: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    currentReading: v.optional(v.number()),
    readingType: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("fleet", {
      createdAt: now,
      updatedAt: now,
      ...args,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("fleet"),
    status: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    currentReading: v.optional(v.number()),
    nextServiceDue: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});

export const logMaintenance = mutation({
  args: {
    fleetId: v.id("fleet"),
    date: v.number(),
    serviceType: v.string(),
    description: v.string(),
    cost: v.number(),
    vendor: v.optional(v.string()),
    readingAtService: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.insert("maintenanceLogs", {
      createdAt: now,
      ...args,
    });

    // Update fleet reading if newer
    if (args.readingAtService) {
      const fleet = await ctx.db.get(args.fleetId);
      if (fleet && (!fleet.currentReading || args.readingAtService > fleet.currentReading)) {
        await ctx.db.patch(args.fleetId, {
          currentReading: args.readingAtService,
          updatedAt: now,
        });
      }
    }
  },
});

export const getLogs = query({
  args: { fleetId: v.id("fleet"), limit: v.optional(v.number()) },
  handler: async (ctx, { fleetId, limit }) => {
    return await ctx.db
      .query("maintenanceLogs")
      .withIndex("by_fleet", q => q.eq("fleetId", fleetId))
      .order("desc")
      .take(limit ?? 50);
  },
});

export const remove = mutation({
  args: { id: v.id("fleet") },
  handler: async (ctx, { id }) => {
    // Optional: delete logs too, or keep them for history. Keeping logs for now.
    await ctx.db.delete(id);
  },
});