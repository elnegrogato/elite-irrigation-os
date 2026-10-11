// convex/caseStudyDrafts.ts
import { action, mutation, query } from "convex/server";
import { v } from "convex/values";

export const createDraftFromWorkOrder = mutation({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, { workOrderId }) => {
    const wo = await ctx.db.get(workOrderId);
    if (!wo) throw new Error("Work order not found");
    if (!wo.proofComplete) throw new Error("Proof incomplete; cannot draft case study");

    const lead = wo.leadId ? await ctx.db.get(wo.leadId) : null;
    const media = await ctx.db.query("workOrderMedia").withIndex("by_workorder", q => q.eq("workOrderId", workOrderId)).collect();

    const before = media.filter(m => m.kind === "before").slice(0, 2);
    const after = media.filter(m => m.kind === "after").slice(0, 2);
    const during = media.filter(m => m.kind === "during").slice(0, 2);

    const title = `${wo.serviceSlug.replaceAll("-", " ")} — proof documented`;
    const summary = wo.notes
      ? wo.notes.slice(0, 240)
      : "Completed scope with documentation, before/after photos, and functional test evidence.";

    const scopeBullets = (wo.scope ?? []).slice(0, 6);
    const outcomeBullets = [
      "Work completed and documented with photo proof",
      "Functional test recorded where applicable",
      "Next-step recommendations captured (if any)",
    ];

    const csId = await ctx.db.insert("caseStudies", {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      serviceSlug: wo.serviceSlug,
      locationSlug: wo.locationSlug ?? lead?.locationSlug ?? "charlotte",
      neighborSlugs: [],
      title,
      summary,
      scopeBullets: scopeBullets.length ? scopeBullets : ["Assessment → execute → test → closeout proof"],
      outcomeBullets,
      media: [...before, ...during, ...after].map(m => ({ url: m.url, kind: m.kind, caption: m.caption })),
      jobDate: wo.scheduledFor,
      tags: ["auto_draft", wo.category],
      publish: false,
      verifiedBy: undefined,
      verifiedAt: undefined,
    });

    if (wo.leadId) {
      await ctx.db.insert("events", {
        ts: Date.now(),
        leadId: wo.leadId,
        type: "case_study_draft_created",
        direction: "system",
        payload: { caseStudyId: csId, workOrderId },
      });
    }

    return csId;
  },
});

export const listDrafts = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const rows = await ctx.db.query("caseStudies").withIndex("by_publish", q => q.eq("publish", false)).order("desc").take(limit ?? 200);
    return rows;
  },
});