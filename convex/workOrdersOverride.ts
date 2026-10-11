// convex/workOrdersOverride.ts
import { mutation } from "convex/server";
import { v } from "convex/values";

export const setScheduleOverride = mutation({
  args: { workOrderId: v.id("workOrders"), override: v.boolean(), note: v.optional(v.string()) },
  handler: async (ctx, { workOrderId, override, note }) => {
    const wo = await ctx.db.get(workOrderId);
    if (!wo) throw new Error("Work order not found");

    const now = Date.now();
    await ctx.db.patch(workOrderId, { managerOverrideSchedule: override, updatedAt: now });

    if (wo.leadId) {
      await ctx.db.insert("events", {
        ts: now,
        leadId: wo.leadId,
        type: "schedule_override",
        direction: "system",
        payload: { workOrderId, override, note: note ?? "" },
      });
    }
    return true;
  },
});