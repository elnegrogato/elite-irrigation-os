// convex/invoicePdfMutations.ts
import { mutation } from "convex/server";
import { v } from "convex/values";

export const attachPdfMut2 = mutation({
  args: { invoiceId: v.id("invoices"), storageId: v.string(), url: v.string() },
  handler: async (ctx, { invoiceId, storageId, url }) => {
    await ctx.db.patch(invoiceId, { pdfStorageId: storageId, pdfUrl: url, updatedAt: Date.now() } as any);
    return true;
  },
});