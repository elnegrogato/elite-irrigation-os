// convex/slaWatcher.ts
import { action } from "convex/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { defaultSecPolicy, DEFAULT_POLICY_KEY, canAgentUseTool, isAgentEnabled } from "./lib/sec";

export const run = action({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }: any) => {
    const agentName = "SLAWatcher";
    const now = Date.now();

    // load policy
    const pol = await ctx.runQuery(api.policies.get, { key: DEFAULT_POLICY_KEY });
    const policy = (pol?.value ?? defaultSecPolicy()) as any;

    if (!isAgentEnabled(policy, agentName)) {
      console.log(`${agentName} is disabled in policy.`);
      return { skipped: true, reason: "disabled" };
    }

    // recent leads; you can optimize with indexes later
    const leads = await ctx.runQuery(internal.leads.listRecentInternal, { limit: limit ?? 200 });

    let breached = 0;

    for (const l of leads as any[]) {
      if (l.stage !== "lead") continue;
      if (l.respondBy && now > l.respondBy) {
        breached++;

        // agent run log
        await ctx.runMutation(api.agentRuns.log, {
          agentName,
          action: "escalate_sla_breach",
          status: canAgentUseTool(policy, agentName, "queue_sms") ? "ok" : "blocked",
          policyKey: DEFAULT_POLICY_KEY,
          leadId: l._id,
          payload: { respondBy: l.respondBy, now, surface: l.surface, phone: l.phone },
        });

        // queue an internal alert SMS to admin number (set in env later) OR just create an event
        await ctx.runMutation(api.events.logEvent, {
          leadId: l._id,
          type: "sla_breach",
          direction: "system",
          payload: { stage: l.stage, respondBy: l.respondBy, now },
        });

        // OPTIONAL: auto-advance stage to "contacted" only if you actually contacted them — keep disabled by default
      }
    }

    return { breached };
  },
});
