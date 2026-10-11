// convex/workOrders.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import { ensureNoBlockingApprovals, ensureDepositForScheduling } from "./lib/secEnforce";
import { requireRoleQuery } from "./lib/authMiddleware";

const VALID_STATUS = new Set([
  "new","triage","assigned","scheduled","inProgress","awaitingApproval","completed","invoiced","closed",
]);

export const createFromLead = mutation({
  args: {
    leadId: v.id("leads"),
    serviceSlug: v.string(),
    locationSlug: v.optional(v.string()),
    addressText: v.optional(v.string()),
    priority: v.optional(v.string()),
    category: v.optional(v.string()),
    scope: v.optional(v.array(v.string())),
    notToExceed: v.optional(v.number()),
  },
  handler: async (ctx, a) => {
    await ensureNoBlockingApprovals(ctx, a.leadId, "create_work_order");

    const now = Date.now();
    const id = await ctx.db.insert("workOrders", {
      createdAt: now,
      updatedAt: now,
      leadId: a.leadId,
      estimateId: undefined,
      serviceSlug: a.serviceSlug,
      locationSlug: a.locationSlug,
      addressText: a.addressText,
      priority: a.priority ?? "medium",
      category: a.category ?? "general",
      status: "new",
      assignedTo: undefined,
      scheduledFor: undefined,
      windowMins: undefined,
      scope: a.scope,
      notes: undefined,
      proofRequired: true,
      proofComplete: false,
      notToExceed: a.notToExceed,
      approvedBudget: undefined,
    });

    await ctx.db.insert("events", {
      ts: now,
      leadId: a.leadId,
      type: "work_order_created",
      direction: "system",
      payload: { workOrderId: id, serviceSlug: a.serviceSlug },
    });

    return id;
  },
});

export const createFromEstimate = mutation({
  args: { estimateId: v.id("estimates") },
  handler: async (ctx, { estimateId }) => {
    const est = await ctx.db.get(estimateId);
    if (!est) throw new Error("Estimate not found");
    if (!est.leadId) throw new Error("Estimate has no lead");

    // SEC: block if approvals pending
    await ensureNoBlockingApprovals(ctx, est.leadId, "create_work_order");

    const lead = await ctx.db.get(est.leadId);
    const now = Date.now();

    const id = await ctx.db.insert("workOrders", {
      createdAt: now,
      updatedAt: now,
      leadId: est.leadId,
      estimateId,
      serviceSlug: lead?.serviceSlug ?? "unknown",
      locationSlug: lead?.locationSlug,
      addressText: lead?.addressText,
      priority: lead?.urgency ?? "medium",
      category: "estimate",
      status: "triage",
      assignedTo: undefined,
      scheduledFor: undefined,
      windowMins: undefined,
      scope: est.items.map(i => `${i.name} (${i.qty} ${i.unit})`),
      notes: est.notes,
      proofRequired: true,
      proofComplete: false,
      notToExceed: est.total,
      approvedBudget: undefined,
    });

    await ctx.db.insert("events", {
      ts: now,
      leadId: est.leadId,
      type: "work_order_created",
      direction: "system",
      payload: { workOrderId: id, estimateId, total: est.total },
    });

    return id;
  },
});

export const setStatus = mutation({
  args: { workOrderId: v.id("workOrders"), status: v.string() },
  handler: async (ctx, { workOrderId, status }) => {
    if (!VALID_STATUS.has(status)) throw new Error("Invalid status");

    const wo = await ctx.db.get(workOrderId);
    if (!wo) throw new Error("Work order not found");

    // Proof enforcement: can't complete without proofComplete=true
    if (status === "completed" && wo.proofRequired && !wo.proofComplete) {
      throw new Error("Cannot mark completed: proof is incomplete");
    }

    await ctx.db.patch(workOrderId, { status, updatedAt: Date.now() });

    if (wo.leadId) {
      await ctx.db.insert("events", {
        ts: Date.now(),
        leadId: wo.leadId,
        type: "work_order_status",
        direction: "system",
        payload: { workOrderId, to: status },
      });
    }

    return true;
  },
});

export const schedule = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    scheduledFor: v.number(),
    windowMins: v.number(),
  },
  handler: async (ctx, a) => {
    const wo = await ctx.db.get(a.workOrderId);
    if (!wo) throw new Error("Work order not found");

    if (wo.leadId) {
      await ensureNoBlockingApprovals(ctx, wo.leadId, "schedule_work");
      
      if (wo.managerOverrideSchedule) {
        // override bypasses deposit gate
      } else {
        const lead = await ctx.db.get(wo.leadId);
        await ensureDepositForScheduling(ctx, wo.leadId, wo.priority, lead?.stage);
      }
    }

    await ctx.db.patch(a.workOrderId, {
      scheduledFor: a.scheduledFor,
      windowMins: a.windowMins,
      status: "scheduled",
      updatedAt: Date.now(),
    });

    return true;
  },
});

export const assign = mutation({
  args: { workOrderId: v.id("workOrders"), assignedTo: v.string() },
  handler: async (ctx, { workOrderId, assignedTo }) => {
    await ctx.db.patch(workOrderId, { assignedTo, status: "assigned", updatedAt: Date.now() });
    return true;
  },
});

export const addMedia = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    kind: v.string(),
    url: v.string(),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, a) => {
    const now = Date.now();
    await ctx.db.insert("workOrderMedia", { createdAt: now, ...a });

    // update proofComplete based on required kinds
    const media = await ctx.db
      .query("workOrderMedia")
      .withIndex("by_workorder", (q) => q.eq("workOrderId", a.workOrderId))
      .collect();

    const hasBefore = media.some(m => m.kind === "before");
    const hasAfter = media.some(m => m.kind === "after");
    const proofComplete = hasBefore && hasAfter;

    await ctx.db.patch(a.workOrderId, { proofComplete, updatedAt: now });

    return true;
  },
});

export const listByStatus = query({
  args: { token: v.string(), status: v.string(), limit: v.optional(v.number()) },
  handler: requireRoleQuery(["admin", "manager", "foreman"], async (ctx, { status, limit }) => {
    return await ctx.db.query("workOrders").withIndex("by_status", q => q.eq("status", status)).order("desc").take(limit ?? 200);
  }),
});

export const listByStatusInternal = internalQuery({
  args: { status: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { status, limit }) => {
    return await ctx.db.query("workOrders").withIndex("by_status", q => q.eq("status", status)).order("desc").take(limit ?? 200);
  },
});

export const get = query({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, { workOrderId }) => {
    const wo = await ctx.db.get(workOrderId);
    if (!wo) return null;
    const media = await ctx.db.query("workOrderMedia").withIndex("by_workorder", q => q.eq("workOrderId", workOrderId)).order("asc").collect();
    return { wo, media };
  },
});

export const listForAssignee = query({
  args: { assignedTo: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { assignedTo, limit }) => {
    return await ctx.db
      .query("workOrders")
      .withIndex("by_assigned", (q) => q.eq("assignedTo", assignedTo))
      .order("desc")
      .take(limit ?? 200);
  },
});

export const setNotes = mutation({
  args: { workOrderId: v.id("workOrders"), notes: v.string() },
  handler: async (ctx, { workOrderId, notes }) => {
    await ctx.db.patch(workOrderId, { notes, updatedAt: Date.now() });
    return true;
  },
});

export const tryComplete = mutation({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, { workOrderId }) => {
    const wo = await ctx.db.get(workOrderId);
    if (!wo) throw new Error("Work order not found");
    if (wo.proofRequired && !wo.proofComplete) throw new Error("Proof incomplete (need before + after)");

    await ctx.db.patch(workOrderId, { status: "completed", updatedAt: Date.now() });

    if (wo.leadId) {
      await ctx.db.insert("events", {
        ts: Date.now(),
        leadId: wo.leadId,
        type: "work_order_status",
        direction: "system",
        payload: { workOrderId, to: "completed" },
      });
    }
    return true;
  },
});
