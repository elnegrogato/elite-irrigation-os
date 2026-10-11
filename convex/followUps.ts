// convex/followUps.ts
import { action } from "convex/server";
import { api, internal } from "./_generated/api";
import { defaultSecPolicy, DEFAULT_POLICY_KEY, canAgentUseTool, isAgentEnabled } from "./lib/sec";
import { v } from "convex/values";

export const runEstimateFollowUps = action({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }: any) => {
    const agentName = "FollowUpAgent";
    const pol = await ctx.runQuery(api.policies.get, { key: DEFAULT_POLICY_KEY });
    const policy = (pol?.value ?? defaultSecPolicy()) as any;

    if (!isAgentEnabled(policy, agentName)) {
      return { skipped: true, reason: "disabled" };
    }

    const leads = await ctx.runQuery(internal.leads.listRecentInternal, { limit: limit ?? 200 });

    let queued = 0;

    for (const l of leads as any[]) {
      // follow up only on estimated stage, with phone
      if (l.stage !== "estimated") continue;
      if (!l.phone) continue;

      // simplistic cadence: once per day (you can add lastOutboundAt guard in real app)
      const ok = canAgentUseTool(policy, agentName, "queue_sms");
      await ctx.runMutation(api.agentRuns.log, {
        agentName,
        action: "queue_estimate_followup_sms",
        status: ok ? "ok" : "blocked",
        policyKey: DEFAULT_POLICY_KEY,
        leadId: l._id,
        payload: { phone: l.phone, serviceSlug: l.serviceSlug },
      });

      if (!ok) continue;

      await ctx.runMutation(api.messages.queueSms, {
        leadId: l._id,
        to: l.phone,
        body: `Elite here — just checking in on your ${l.serviceSlug ?? "service"} estimate. Want to schedule, or do you have questions? Reply YES to book.`,
        scheduledFor: Date.now() + 2 * 60 * 1000,
        meta: { kind: "estimate_followup" },
      });

      queued++;
    }

    return { queued };
  },
});

export const runReviewRequests = action({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }: any) => {
    const agentName = "ReviewAgent";
    const pol = await ctx.runQuery(api.policies.get, { key: DEFAULT_POLICY_KEY });
    const policy = (pol?.value ?? defaultSecPolicy()) as any;

    if (!isAgentEnabled(policy, agentName)) {
      return { skipped: true, reason: "disabled" };
    }

    const leads = await ctx.runQuery(internal.leads.listRecentInternal, { limit: limit ?? 200 });

    let queued = 0;

    for (const l of leads as any[]) {
      // Only queue review if work order is closed OR invoice is paid.
      // This prevents asking for a review before money changes hands.
      if (!l.phone) continue;

      // Check for closed work orders for this lead
      const wos = await ctx.runQuery(internal.workOrders.listByStatusInternal, { status: "closed", limit: 5 });
      const hasClosedWo = wos.some((w: any) => w.leadId === l._id);

      const invs = await ctx.runQuery(internal.invoices.listByStatusInternal, { status: "paid", limit: 50 });
      const hasPaidInv = invs.some((i: any) => i.leadId === l._id);

      if (!hasClosedWo && !hasPaidInv) continue;

      const ok = canAgentUseTool(policy, agentName, "queue_sms");
      await ctx.runMutation(api.agentRuns.log, {
        agentName,
        action: "queue_review_request_sms",
        status: ok ? "ok" : "blocked",
        policyKey: DEFAULT_POLICY_KEY,
        leadId: l._id,
        payload: { phone: l.phone },
      });

      if (!ok) continue;

      // Check if we already sent one recently to avoid spam (omitted for brevity)

      await ctx.runMutation(api.messages.queueSms, {
        leadId: l._id,
        to: l.phone,
        body: `Thanks for choosing Elite. Mind leaving a quick review? (link) — it helps a ton. Reply if anything needs adjustment.`,
        scheduledFor: Date.now() + 5 * 60 * 1000,
        meta: { kind: "review_request" },
      });

      queued++;
    }

    return { queued };
  },
});
