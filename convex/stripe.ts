// convex/stripe.ts
import { action } from "convex/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { getStripe, siteUrl } from "./lib/stripe";

export const createCheckoutSessionForToken = action({
  args: {
    token: v.string(),
    paymentType: v.optional(v.union(v.literal("full"), v.literal("deposit"), v.literal("balance"))),
    depositPercent: v.optional(v.number()), // e.g. 30
  },
  handler: async (ctx, { token, paymentType, depositPercent }) => {
    const resolved = await ctx.runQuery(api.invoiceLinks.resolveToken, { token });
    if (!resolved) throw new Error("Invalid or expired invoice link");

    const invoice = resolved.invoice as any;
    const lead = resolved.lead as any;

    if (invoice.status === "paid" || (invoice.balanceDue !== undefined && invoice.balanceDue <= 0)) {
      return { alreadyPaid: true, url: `${siteUrl()}/invoice/${token}?paid=1` };
    }

    const stripe = getStripe();

    const type = paymentType ?? "full";
    const currentBalance = invoice.balanceDue ?? invoice.total;

    let chargeAmount = currentBalance;
    
    if (type === "deposit") {
      const pct = Math.max(5, Math.min(95, depositPercent ?? 30));
      // Calculate deposit based on TOTAL amount, not remaining balance
      const depositAmount = Math.max(1, Math.round((invoice.total * (pct / 100)) * 100) / 100);
      // But never exceed what is currently due
      chargeAmount = Math.min(depositAmount, currentBalance);
    }
    
    // Balance payment just takes whatever is left
    if (type === "balance") {
      chargeAmount = currentBalance;
    }

    const success = `${siteUrl()}/invoice/${token}?success=1`;
    const cancel = `${siteUrl()}/invoice/${token}?canceled=1`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: success,
      cancel_url: cancel,
      customer_creation: "if_required",
      customer_email: lead?.email ?? undefined,
      metadata: {
        invoiceId: String(invoice._id),
        token,
        paymentType: type,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: { name: type === "deposit" ? "Elite Invoice Deposit" : "Elite Invoice Payment" },
            unit_amount: Math.round(chargeAmount * 100),
          },
        },
      ],
    });

    await ctx.runMutation(api.stripeMutations.attachSessionMut, {
      invoiceId: invoice._id,
      sessionId: session.id,
    });

    await ctx.runMutation(api.invoices.setStatus, { invoiceId: invoice._id, status: "sent" });

    return { url: session.url, sessionId: session.id, paymentType: type, amount: chargeAmount };
  },
});