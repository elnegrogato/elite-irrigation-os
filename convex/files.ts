// convex/files.ts
import { mutation } from "convex/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const attachWorkOrderMedia = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    storageId: v.string(),
    kind: v.string(), // before/after/during/video/signature/other
    caption: v.optional(v.string()),
  },
  handler: async (ctx, { workOrderId, storageId, kind, caption }) => {
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw new Error("Failed to resolve file URL");

    const now = Date.now();
    await ctx.db.insert("workOrderMedia", {
      createdAt: now,
      workOrderId,
      kind,
      url,
      storageId,
      caption,
    });

    // recompute proof completeness: require at least one before + one after
    const media = await ctx.db
      .query("workOrderMedia")
      .withIndex("by_workorder", (q) => q.eq("workOrderId", workOrderId))
      .collect();

    const hasBefore = media.some((m) => m.kind === "before");
    const hasAfter = media.some((m) => m.kind === "after");
    const proofComplete = hasBefore && hasAfter;

    await ctx.db.patch(workOrderId, { proofComplete, updatedAt: now });

    return { ok: true, url };
  },
});