// convex/depositStatus.ts
import { query } from "convex/server";
import { v } from "convex/values";
import { loadPolicy } from "./lib/secEnforce";
import { requiredDeposit } from "./lib/deposit";

export const forLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead: any = await ctx.db.get(leadId);
    if (!lead) return { ok: false, reason: "Lead not found" };

    const policy: any = await loadPolicy(ctx);
    const dr = policy.depositRules;

    // If deposit rule is disabled, scheduling is allowed (deposit-wise)
    if (!dr?.enabled || !dr.requireBeforeScheduling) {
      return {
        ok: true,
        depositRuleEnabled: false,
        requiredDeposit: 0,
        amountPaid: 0,
        balanceDue: 0,
        invoiceId: null,
        reason: "Deposit rule disabled",
      };
    }

    // Exemptions
    if (dr.exemptions?.priorityEmergency && (lead.urgency === "emergency" || lead.urgency === "high")) {
      return {
        ok: true,
        depositRuleEnabled: true,
        requiredDeposit: 0,
        amountPaid: 0,
        balanceDue: 0,
        invoiceId: null,
        reason: "Emergency/high priority exempt",
      };
    }

    if (dr.exemptions?.stages?.includes(lead.stage)) {
      return {
        ok: true,
        depositRuleEnabled: true,
        requiredDeposit: 0,
        amountPaid: 0,
        balanceDue: 0,
        invoiceId: null,
        reason: `Stage exempt: ${lead.stage}`,
      };
    }

    // Find latest invoice for this lead (simple scan; optimize later with index)
    const invs = await ctx.db.query("invoices").order("desc").take(300);
    const inv: any = invs.find((i: any) => i.leadId && i.leadId.equals(leadId)) ?? null;

    if (!inv) {
      return {
        ok: false,
        depositRuleEnabled: true,
        requiredDeposit: null,
        amountPaid: 0,
        balanceDue: null,
        invoiceId: null,
        reason: "No invoice exists yet (deposit cannot be collected)",
      };
    }

    const req = requiredDeposit(policy, inv.total ?? 0);
    const paid = inv.amountPaid ?? 0;
    const balance = inv.balanceDue ?? Math.max(0, (inv.total ?? 0) - paid);

    if (paid >= req) {
      return {
        ok: true,
        depositRuleEnabled: true,
        requiredDeposit: req,
        amountPaid: paid,
        balanceDue: balance,
        invoiceId: inv._id,
        reason: "Deposit satisfied",
      };
    }

    return {
      ok: false,
      depositRuleEnabled: true,
      requiredDeposit: req,
      amountPaid: paid,
      balanceDue: balance,
      invoiceId: inv._id,
      reason: `Deposit required: $${req.toFixed(2)} (paid $${paid.toFixed(2)})`,
    };
  },
});