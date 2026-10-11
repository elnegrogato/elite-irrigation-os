// convex/staff.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";

// --- Staff ---

export const listStaff = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, { status }) => {
    let q = ctx.db.query("staff");
    if (status) {
      q = q.withIndex("by_status", q => q.eq("status", status));
    }
    return await q.order("desc").collect();
  },
});

export const createStaff = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("staff", {
      ...args,
      status: "active",
      joinedAt: Date.now(),
    });
  },
});

export const updateStaff = mutation({
  args: {
    id: v.id("staff"),
    role: v.optional(v.string()),
    status: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// --- Crews ---

export const listCrews = query({
  args: {},
  handler: async (ctx) => {
    const crews = await ctx.db.query("crews").collect();
    
    // Enrich with names for display
    const enriched = await Promise.all(crews.map(async (crew) => {
      const foreman = crew.foremanId ? await ctx.db.get(crew.foremanId) : null;
      const vehicle = crew.fleetId ? await ctx.db.get(crew.fleetId) : null;
      const members = await Promise.all(crew.memberIds.map(id => ctx.db.get(id)));
      
      return {
        ...crew,
        foremanName: foreman?.name,
        vehicleName: vehicle?.name,
        memberNames: members.map(m => m?.name).filter(Boolean),
      };
    }));

    return enriched;
  },
});

export const createCrew = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    foremanId: v.optional(v.id("staff")),
    memberIds: v.array(v.id("staff")),
    fleetId: v.optional(v.id("fleet")),
  },
  handler: async (ctx, args) => {
    // If a vehicle is assigned, update the fleet record too
    if (args.fleetId) {
      await ctx.db.patch(args.fleetId, { assignedTo: args.name });
    }

    return await ctx.db.insert("crews", {
      ...args,
      active: true,
    });
  },
});

export const updateCrew = mutation({
  args: {
    id: v.id("crews"),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
    foremanId: v.optional(v.id("staff")),
    memberIds: v.optional(v.array(v.id("staff"))),
    fleetId: v.optional(v.id("fleet")),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const crew = await ctx.db.get(id);
    
    if (updates.fleetId !== undefined && updates.fleetId !== crew?.fleetId) {
      // Unassign old vehicle if it exists
      if (crew?.fleetId) {
        await ctx.db.patch(crew.fleetId, { assignedTo: undefined });
      }
      // Assign new vehicle
      if (updates.fleetId) {
        const name = updates.name ?? crew?.name ?? "Crew";
        await ctx.db.patch(updates.fleetId, { assignedTo: name });
      }
    }

    await ctx.db.patch(id, updates);
  },
});

export const deleteCrew = mutation({
  args: { id: v.id("crews") },
  handler: async (ctx, { id }) => {
    const crew = await ctx.db.get(id);
    if (crew?.fleetId) {
      await ctx.db.patch(crew.fleetId, { assignedTo: undefined });
    }
    await ctx.db.delete(id);
  },
});