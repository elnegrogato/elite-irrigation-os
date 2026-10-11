// convex/approvals.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";
import { requireRoleQuery } from "./lib/authMiddleware";

export const listPending = query({
  args: { token: v.string(), limit: v.optional(v.number()) },
  handler: requireRoleQuery(["admin", "manager", "foreman"], async (ctx, { limit }) => {
    return await ctx.db
      .query("approvalRequests")
      .withIndex("by_status", q => q.eq("status", "pending"))
      .order("desc")
      .take(limit ?? 200);
  }),
});

export const create = mutation({
  args: {
    kind: v.string(),
    entityId: v.optional(v.string()),
    leadId: v.optional(v.id("leads")),
    amount: v.number(),
    currency: v.optional(v.string()),
    reason: v.string(),
    details: v.optional(v.any()),
    policyKey: v.optional(v.string()),
    threshold: v.optional(v.number()),
    requestedBy: v.optional(v.string()),
  },
  handler: async (ctx, a) => {
    const now = Date.now();
    const id = await ctx.db.insert("approvalRequests", {
      createdAt: now,
      updatedAt: now,
      kind: a.kind,
      entityId: a.entityId,
      leadId: a.leadId,
      amount: a.amount,
      currency: a.currency ?? "USD",
      reason: a.reason,
      details: a.details,
      policyKey: a.policyKey,
      threshold: a.threshold,
      status: "pending",
      requestedBy: a.requestedBy,
      decidedBy: undefined,
      decidedAt: undefined,
      decisionNote: undefined,
    });

    if (a.leadId) {
      await ctx.db.insert("events", {
        ts: now,
        leadId: a.leadId,
        type: "approval_requested",
        direction: "system",
        payload: { approvalId: id, kind: a.kind, amount: a.amount, reason: a.reason },
      });
    }

    return id;
  },
});

export const decide = mutation({
  args: {
    approvalId: v.id("approvalRequests"),
    decision: v.union(v.literal("approved"), v.literal("rejected")),
    decidedBy: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { approvalId, decision, decidedBy, note }) => {
    const row = await ctx.db.get(approvalId);
    if (!row) throw new Error("Approval not found");
    if (row.status !== "pending") throw new Error("Approval not pending");

    const now = Date.now();
    await ctx.db.patch(approvalId, {
      status: decision,
      decidedBy,
      decidedAt: now,
      decisionNote: note,
      updatedAt: now,
    });

    if (row.leadId) {
      await ctx.db.insert("events", {
        ts: now,
        leadId: row.leadId,
        type: "approval_decision",
        direction: "system",
        payload: { approvalId, decision, note },
      });
    }

    return { ok: true };
  },
});
