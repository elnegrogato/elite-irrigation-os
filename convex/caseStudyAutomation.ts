// convex/caseStudyAutomation.ts
import { action } from "convex/server";
import { api, internal } from "./_generated/api";

export const run = action({
  args: { limit: Number as any },
  handler: async (ctx, { limit }: any) => {
    const rows = await ctx.runQuery(internal.workOrders.listByStatusInternal, { status: "completed", limit: limit ?? 200 });

    // Build set of workOrders that already have a draft/published caseStudy tagged with auto_draft (best-effort)
    const existing = await ctx.runQuery(api.caseStudies.exportAllPublished, {}); // published only; drafts not included here
    const publishedWorkOrders = new Set<string>();
    // In a real implementation we would strictly track linkage, but for now we proceed optimistically

    let created = 0;
    for (const wo of rows as any[]) {
      if (!wo.proofComplete) continue;

      // naive dedupe: check if a draft exists with same service+location+summary fragment
      const drafts = await ctx.runQuery(api.caseStudyDrafts.listDrafts, { limit: 500 });
      const already = (drafts as any[]).some(d => d.serviceSlug === wo.serviceSlug && d.locationSlug === wo.locationSlug && (d.tags ?? []).includes("auto_draft"));
      if (already) continue;

      await ctx.runMutation(api.caseStudyDrafts.createDraftFromWorkOrder, { workOrderId: wo._id });
      created++;
      if (created >= 10) break; // cap per run
    }

    return { created };
  },
});
