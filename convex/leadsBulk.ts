// convex/leadsBulk.ts
import { mutation } from "convex/server";
import { v } from "convex/values";

const VALID_STAGES = new Set([
  "lead","contacted","inspected","estimated","booked","inProgress","completed","reviewed","member_referrer",
]);

export const bulkSetStage = mutation({
  args: { leadIds: v.array(v.id("leads")), to: v.string(), by: v.optional(v.string()) },
  handler: async (ctx, { leadIds, to, by }) => {
    if (!VALID_STAGES.has(to)) throw new Error(`Invalid stage: ${to}`);
    const now = Date.now();

    for (const id of leadIds) {
      const lead = await ctx.db.get(id);
      if (!lead) continue;
      await ctx.db.patch(id, { stage: to, updatedAt: now });
      await ctx.db.insert("events", {
        ts: now,
        leadId: id,
        type: "stage_change",
        direction: by ?? "human",
        payload: { from: lead.stage, to, bulk: true },
      });
    }
    return { ok: true, count: leadIds.length };
  },
});

export const bulkAssign = mutation({
  args: { leadIds: v.array(v.id("leads")), assignedTo: v.optional(v.string()) },
  handler: async (ctx, { leadIds, assignedTo }) => {
    const now = Date.now();
    for (const id of leadIds) {
      const lead = await ctx.db.get(id);
      if (!lead) continue;
      await ctx.db.patch(id, { assignedTo, updatedAt: now });
      await ctx.db.insert("events", {
        ts: now,
        leadId: id,
        type: "note",
        direction: "system",
        payload: { message: assignedTo ? `Bulk assigned to ${assignedTo}` : "Bulk unassigned" },
      });
    }
    return { ok: true, count: leadIds.length };
  },
});