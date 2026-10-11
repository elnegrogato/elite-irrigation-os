// convex/invoiceSend.ts
import { action } from "convex/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { siteUrl } from "./lib/stripe";

export const sendInvoiceSms = action({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, { invoiceId }) => {
    const inv: any = await ctx.runQuery(api.invoices.get, { invoiceId });
    if (!inv) throw new Error("Invoice not found");

    if (!inv.leadId) throw new Error("Invoice missing leadId");
    const lead: any = await ctx.runQuery(api.leads.get, { leadId: inv.leadId });
    if (!lead?.phone) throw new Error("Lead missing phone");

    const { token } = await ctx.runMutation(api.invoiceLinks.createToken, { invoiceId, expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000 });
    const link = `${siteUrl()}/invoice/${token}`;

    await ctx.runMutation(api.messages.queueSms, {
      leadId: inv.leadId,
      to: lead.phone,
      body: `Elite — your invoice is ready: ${link}  Reply if you have any questions.`,
      scheduledFor: Date.now() + 30_000,
      meta: { kind: "invoice_link", invoiceId, token },
    });

    await ctx.runMutation(api.invoices.setStatus, { invoiceId, status: "sent" });

    return { ok: true, link };
  },
});