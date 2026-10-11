// convex/depositInvoice.ts
import { action, mutation } from "convex/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { DEFAULT_POLICY_KEY } from "./lib/secEnforce"; // we can't use loadPolicy in mutation easily if it uses query logic
// actually we can query within mutation.

export const createForLead = mutation({
  args: { leadId: v.id("leads"), total: v.optional(v.number()) },
  handler: async (ctx, { leadId, total }) => {
    const lead = await ctx.db.get(leadId);
    if (!lead) throw new Error("Lead not found");

    const placeholderTotal = total ?? 1000;
    
    // We need deposit rules to make a good note, but if not we just use default
    // Fetch policy
    const polRow = await ctx.db.query("policies").withIndex("by_key", q => q.eq("key", DEFAULT_POLICY_KEY)).unique();
    const policy: any = polRow?.value;
    const pct = policy?.depositRules?.defaultPercent ?? 30;
    const depAmt = placeholderTotal * (pct/100);

    const invoiceId = await ctx.db.insert("invoices", {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      leadId,
      workOrderId: undefined,
      status: "draft",
      subtotal: placeholderTotal,
      tax: 0,
      total: placeholderTotal,
      notes: `Deposit required before scheduling. Recommended deposit: $${depAmt.toFixed(2)}.`,
      stripeCustomerId: undefined,
      customerEmail: lead.email,
      stripeSessionId: undefined,
      stripePaymentIntentId: undefined,
      paidAt: undefined,
      amountPaid: 0,
      balanceDue: placeholderTotal,
      pdfStorageId: undefined,
      pdfUrl: undefined,
    } as any);

    await ctx.db.insert("events", {
      ts: Date.now(),
      leadId,
      type: "deposit_invoice_created",
      direction: "system",
      payload: { invoiceId, placeholderTotal, recommendedDeposit: depAmt },
    });

    return { invoiceId };
  }
});

export const ensureDepositInvoice = action({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    // This is the action version if needed, but we implemented createForLead as mutation
    // keeping for compatibility if requested
    const res: any = await ctx.runMutation(api.depositInvoice.createForLead, { leadId });
    return { ok: true, invoiceId: res.invoiceId, existed: false };
  },
});