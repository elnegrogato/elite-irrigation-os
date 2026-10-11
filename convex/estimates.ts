// convex/estimates.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";
import { defaultSecPolicy, DEFAULT_POLICY_KEY } from "./lib/sec";

export const createDraft = mutation({
  args: {
    leadId: v.id("leads"),
    items: v.array(v.object({
      sku: v.string(),
      name: v.string(),
      qty: v.number(),
      unit: v.string(),
      unitPrice: v.number(),
    })),
    tierOptions: v.optional(v.array(v.object({
      tier: v.string(),
      total: v.number(),
      summary: v.string(),
    }))),
    notes: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, a) => {
    const now = Date.now();
    const total = a.items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);

    const id = await ctx.db.insert("estimates", {
      leadId: a.leadId,
      createdAt: now,
      updatedAt: now,
      status: "draft",
      items: a.items,
      total,
      tierOptions: a.tierOptions,
      notes: a.notes,
      expiresAt: a.expiresAt,
    });

    await ctx.db.insert("events", {
      ts: now,
      leadId: a.leadId,
      type: "estimate",
      direction: "system",
      payload: { estimateId: id, status: "draft", total },
    });

    // Check policy for approval
    const polRow = await ctx.db
      .query("policies")
      .withIndex("by_key", q => q.eq("key", DEFAULT_POLICY_KEY))
      .unique();

    const policy = (polRow?.value ?? defaultSecPolicy()) as any;
    const requireApprovalOver = policy?.approvalThresholds?.requireApprovalOver ?? 1000;

    if (total >= requireApprovalOver) {
      await ctx.db.insert("approvalRequests", {
        createdAt: now,
        updatedAt: now,
        kind: "estimate",
        entityId: String(id),
        leadId: a.leadId,
        amount: total,
        currency: "USD",
        reason: `Estimate total exceeds threshold (${requireApprovalOver})`,
        details: { estimateId: id, tierOptions: a.tierOptions ?? null },
        policyKey: DEFAULT_POLICY_KEY,
        threshold: requireApprovalOver,
        status: "pending",
        requestedBy: "system",
        decidedBy: undefined,
        decidedAt: undefined,
        decisionNote: undefined,
      });

      await ctx.db.insert("events", {
        ts: now,
        leadId: a.leadId,
        type: "approval_requested",
        direction: "system",
        payload: { kind: "estimate", amount: total, threshold: requireApprovalOver },
      });
    }

    return id;
  },
});

export const setStatus = mutation({
  args: { estimateId: v.id("estimates"), status: v.string() },
  handler: async (ctx, { estimateId, status }) => {
    const est = await ctx.db.get(estimateId);
    if (!est) throw new Error("Estimate not found");
    const now = Date.now();
    await ctx.db.patch(estimateId, { status, updatedAt: now });
    await ctx.db.insert("events", {
      ts: now,
      leadId: est.leadId,
      type: "estimate_status",
      direction: "system",
      payload: { estimateId, status },
    });
    return true;
  },
});

export const listForLead = query({
  args: { leadId: v.id("leads"), limit: v.optional(v.number()) },
  handler: async (ctx, { leadId, limit }) => {
    return await ctx.db.query("estimates").withIndex("by_lead", q => q.eq("leadId", leadId)).order("desc").take(limit ?? 25);
  },
});

// New: List all recent estimates for the Admin dashboard
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    // using by_status as a proxy for "all" or simply standard query if small
    // A better pattern for "recent all" is creating a by_createdAt index
    // Assuming schema defines by_status or just scan if small.
    // Schema has .index("by_status", ["status"]).
    // Schema defines "by_lead", ["leadId", "createdAt"].
    // Let's grab pending first, then others.
    const sent = await ctx.db.query("estimates").withIndex("by_status", q => q.eq("status", "sent")).order("desc").take(limit ?? 50);
    const draft = await ctx.db.query("estimates").withIndex("by_status", q => q.eq("status", "draft")).order("desc").take(limit ?? 50);
    
    // Merge and sort
    const all = [...sent, ...draft].sort((a,b) => b.createdAt - a.createdAt);
    return all.slice(0, limit ?? 50);
  },
});

// Get single estimate by ID
export const get = query({
  args: { id: v.id("estimates") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});