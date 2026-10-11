// convex/workOrdersClose.ts
import { mutation } from "convex/server";
import { v } from "convex/values";

export const setManagerOverride = mutation({
  args: { workOrderId: v.id("workOrders"), override: v.boolean() },
  handler: async (ctx, { workOrderId, override }) => {
    await ctx.db.patch(workOrderId, { managerOverrideClose: override, updatedAt: Date.now() });
    return true;
  },
});

export const tryClose = mutation({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, { workOrderId }) => {
    const wo = await ctx.db.get(workOrderId);
    if (!wo) throw new Error("Work order not found");

    // must be completed or invoiced at least
    if (!["completed","invoiced"].includes(wo.status)) {
      throw new Error(`Cannot close from status ${wo.status}`);
    }

    // find invoice if any
    const invoices = await ctx.db.query("invoices").withIndex("by_workorder", q => q.eq("workOrderId", workOrderId)).order("desc").take(1);
    const inv = invoices[0];

    const paid = inv?.status === "paid";
    const override = wo.managerOverrideClose === true;

    if (!paid && !override) throw new Error("Cannot close: invoice not paid and no manager override");

    const now = Date.now();
    await ctx.db.patch(workOrderId, { status: "closed", closedAt: now, updatedAt: now });
    return true;
  },
});