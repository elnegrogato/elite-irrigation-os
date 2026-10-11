// convex/stripeMutations.ts
import { mutation } from "convex/server";
import { v } from "convex/values";

export const attachSessionMut = mutation({
  args: { invoiceId: v.id("invoices"), sessionId: v.string() },
  handler: async (ctx, { invoiceId, sessionId }) => {
    await ctx.db.patch(invoiceId, { stripeSessionId: sessionId, updatedAt: Date.now() });
    return true;
  },
});