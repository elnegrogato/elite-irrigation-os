// convex/appointments.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";
import { ensureNoBlockingApprovals, ensureDepositForScheduling } from "./lib/secEnforce";

export const create = mutation({
  args: {
    leadId: v.id("leads"),
    scheduledFor: v.number(),
    windowMins: v.number(),
    status: v.string(),
    crewId: v.optional(v.string()),
    notes: v.optional(v.string()),
    locationSlug: v.optional(v.string()),
    addressText: v.optional(v.string()),
    serviceSlug: v.optional(v.string()),
  },
  handler: async (ctx, a) => {
    await ensureNoBlockingApprovals(ctx, a.leadId, "schedule_work");
    
    const lead = await ctx.db.get(a.leadId);
    await ensureDepositForScheduling(ctx, a.leadId, lead?.urgency, lead?.stage);

    const now = Date.now();
    const apptId = await ctx.db.insert("appointments", { ...a, createdAt: now });
    await ctx.db.insert("events", {
      ts: now,
      leadId: a.leadId,
      type: "appointment",
      direction: "system",
      payload: { appointmentId: apptId, scheduledFor: a.scheduledFor, windowMins: a.windowMins, status: a.status },
    });
    return apptId;
  },
});

export const listRange = query({
  args: { start: v.number(), end: v.number(), limit: v.optional(v.number()) },
  handler: async (ctx, { start, end, limit }) => {
    // Convex doesn't have range query indexes on two bounds directly; simple approach:
    const rows = await ctx.db.query("appointments").withIndex("by_time").order("asc").take(limit ?? 500);
    return rows.filter(r => r.scheduledFor >= start && r.scheduledFor <= end);
  },
});

// Get single appointment by ID
export const get = query({
  args: { id: v.id("appointments") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});