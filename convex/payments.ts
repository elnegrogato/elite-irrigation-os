// convex/payments.ts
import { mutation } from "convex/server";
import { v } from "convex/values";

export const recordStripePayment = mutation({
  args: {
    invoiceId: v.id("invoices"),
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    payerEmail: v.optional(v.string()),
    amount: v.number(),
  },
  handler: async (ctx, a) => {
    const inv = await ctx.db.get(a.invoiceId);
    if (!inv) throw new Error("Invoice not found");

    const now = Date.now();

    // Record payment row
    await ctx.db.insert("payments", {
      createdAt: now,
      invoiceId: a.invoiceId,
      leadId: inv.leadId,
      workOrderId: inv.workOrderId,
      amount: a.amount,
      currency: "USD",
      method: "stripe",
      status: "succeeded",
      stripeSessionId: a.stripeSessionId,
      stripePaymentIntentId: a.stripePaymentIntentId,
      payerEmail: a.payerEmail,
    });

    const amountPaid = (inv.amountPaid ?? 0) + a.amount;
    const balanceDue = Math.max(0, (inv.total ?? 0) - amountPaid);

    const newStatus =
      balanceDue <= 0.01 ? "paid" : "partially_paid";

    await ctx.db.patch(a.invoiceId, {
      updatedAt: now,
      status: newStatus,
      amountPaid,
      balanceDue,
      // If we capture an email for the first time, save it to the invoice customer record
      customerEmail: inv.customerEmail ?? a.payerEmail,
      stripeSessionId: a.stripeSessionId ?? inv.stripeSessionId,
      stripePaymentIntentId: a.stripePaymentIntentId ?? inv.stripePaymentIntentId,
      paidAt: balanceDue <= 0.01 ? now : inv.paidAt,
    } as any);

    // Close work order only when fully paid
    if (inv.workOrderId && balanceDue <= 0.01) {
      await ctx.db.patch(inv.workOrderId, { status: "closed", closedAt: now, updatedAt: now });
    }

    if (inv.leadId) {
      await ctx.db.insert("events", {
        ts: now,
        leadId: inv.leadId,
        type: "payment_received",
        direction: "system",
        payload: { invoiceId: a.invoiceId, amount: a.amount, amountPaid, balanceDue, status: newStatus },
      });
    }

    return { ok: true, amountPaid, balanceDue, status: newStatus };
  },
});