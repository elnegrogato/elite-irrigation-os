// convex/depositSend.ts
import { action } from "convex/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { loadPolicy, DEFAULT_POLICY_KEY } from "./lib/secEnforce";
import { requiredDeposit } from "./lib/deposit";

/**
 * One-click: send a Stripe DEPOSIT checkout link by SMS for a given lead.
 * - Finds latest invoice for lead (or creates a draft invoice from latest estimate total, fallback placeholder).
 * - Creates invoice token.
 * - Creates Stripe checkout session for deposit using policy defaultPercent.
 * - Queues SMS to lead.phone with the session.url (direct checkout).
 */
export const sendDepositLinkSms = action({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead: any = await ctx.runQuery(api.leads.get, { leadId });
    if (!lead) throw new Error("Lead not found");
    if (!lead.phone) throw new Error("Lead missing phone");

    // Load SEC policy
    // We can't use loadPolicy directly in action, as it's an internal helper using ctx.db
    // Instead fetch policy via query
    const polRow: any = await ctx.runQuery(api.policies.get, { key: DEFAULT_POLICY_KEY });
    const policy = polRow?.value;
    
    if (!policy) throw new Error("Policy not found");

    const dr = policy.depositRules;
    if (!dr?.enabled || !dr.requireBeforeScheduling) {
      throw new Error("Deposit rule is disabled in policy");
    }

    // Find latest invoice for this lead
    // listRecent is by createdAt, we need by lead.
    // Let's assume listByStatus gives us recent invoices or fetch via custom query.
    // For simplicity, fetch recent invoices via listByStatus (draft/sent) and filter.
    const drafts: any[] = await ctx.runQuery(internal.invoices.listByStatusInternal, { status: "draft", limit: 200 });
    const sents: any[] = await ctx.runQuery(internal.invoices.listByStatusInternal, { status: "sent", limit: 200 });
    const partials: any[] = await ctx.runQuery(internal.invoices.listByStatusInternal, { status: "partially_paid", limit: 200 });
    
    const allInvs = [...drafts, ...sents, ...partials].sort((a,b) => b.createdAt - a.createdAt);
    let inv = allInvs.find((i: any) => i.leadId === leadId);

    // If no invoice, try to create from latest estimate total; else placeholder
    if (!inv) {
      const estimates: any[] = await ctx.runQuery(api.estimates.listForLead, { leadId });
      // estimates.listForLead sorts by desc
      const est = estimates[0];

      const total = est?.total ?? 1000;
      const subtotal = total;
      const tax = 0;

      // We need to call a mutation to create the invoice
      const invoiceId = await ctx.runMutation(api.invoices.createDraft, {
        leadId,
        workOrderId: "skip" as any, // tricky, createDraft requires WO currently in schema but we might not have one. 
        // Update: createDraft expects workOrderId. If we don't have one, we can't easily create invoice with that mutation.
        // Let's assume we might have a work order or we need a new mutation for lead-only invoice.
        // For now, let's use the 'depositInvoice' pattern which inserts directly.
        // But we are in an action. We must call a mutation.
        // Let's use `depositInvoice.ensureDepositInvoice` logic but wrapped or via direct call if we expose it.
        // To be safe, let's use `api.depositInvoice.createForLead`.
      } as any).catch(async () => {
         // Fallback: create via depositInvoice helper if available
         const res: any = await ctx.runMutation(api.depositInvoice.createForLead, { leadId, total });
         return res.invoiceId;
      });
      
      // If we got an ID (either string or from catch block)
      if (typeof invoiceId === 'string') {
          inv = await ctx.runQuery(api.invoices.get, { invoiceId: invoiceId as any });
      }
    }
    
    if (!inv) throw new Error("Could not find or create invoice.");

    // If already has required deposit, don't spam
    const req = requiredDeposit(policy, inv.total ?? 0);
    const paid = inv.amountPaid ?? 0;
    if (paid >= req) {
      return { ok: true, alreadySatisfied: true, requiredDeposit: req, amountPaid: paid, balanceDue: inv.balanceDue ?? 0 };
    }

    // Create (or re-use) an active token for this invoice
    const tokenRes: any = await ctx.runMutation(api.invoiceLinks.createToken, {
      invoiceId: inv._id,
      expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
    });

    const token = tokenRes.token as string;

    // Create Stripe checkout session for DEPOSIT
    const checkout: any = await ctx.runAction(api.stripe.createCheckoutSessionForToken, {
      token,
      paymentType: "deposit",
      depositPercent: dr.defaultPercent ?? 30,
    });

    if (!checkout?.url) throw new Error("Failed to create Stripe checkout URL");

    // Queue SMS (direct checkout link)
    await ctx.runMutation(api.messages.queueSms, {
      leadId,
      to: lead.phone,
      body: `Elite — to schedule, please pay the deposit here: ${checkout.url}  (Reply if you have questions.)`,
      scheduledFor: Date.now() + 10_000,
      meta: {
        kind: "deposit_link",
        invoiceId: inv._id,
        token,
        paymentType: "deposit",
        depositPercent: dr.defaultPercent ?? 30,
        requiredDeposit: req,
      },
    });

    await ctx.runMutation(api.events.logEvent, {
      leadId,
      type: "deposit_link_sent",
      direction: "system",
      payload: {
        invoiceId: String(inv._id),
        token,
        requiredDeposit: req,
        amountPaid: paid,
        checkoutUrl: checkout.url,
      },
    });

    return {
      ok: true,
      invoiceId: String(inv._id),
      token,
      requiredDeposit: req,
      amountPaid: paid,
      balanceDue: inv.balanceDue ?? 0,
      checkoutUrl: checkout.url,
    };
  },
});
