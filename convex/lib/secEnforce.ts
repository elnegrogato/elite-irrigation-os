// convex/lib/secEnforce.ts
import { DEFAULT_POLICY_KEY, defaultSecPolicy, canAgentUseTool } from "./sec";
import { hasRequiredDeposit } from "./deposit";

export async function loadPolicy(ctx: any) {
  const row = await ctx.db.query("policies").withIndex("by_key", (q: any) => q.eq("key", DEFAULT_POLICY_KEY)).unique();
  return (row?.value ?? defaultSecPolicy()) as any;
}

// If there is a pending approval tied to leadId, block certain actions.
export async function ensureNoBlockingApprovals(ctx: any, leadId: any, action: string) {
  const pending = await ctx.db
    .query("approvalRequests")
    .withIndex("by_status", (q: any) => q.eq("status", "pending"))
    .order("desc")
    .take(100);

  const hasLeadPending = pending.some((a: any) => a.leadId && a.leadId === leadId);
  if (!hasLeadPending) return;

  // Block actions that create commitments:
  const blocked = new Set(["create_work_order", "schedule_work", "send_sms_contract", "send_sms_estimate"]);
  if (blocked.has(action)) {
    throw new Error(`SEC BLOCK: pending approval exists for this lead (${action})`);
  }
}

// Agent tool permission enforcement (for autonomous actions)
export async function enforceAgentTool(ctx: any, agentName: string, tool: string) {
  const policy = await loadPolicy(ctx);
  const ok = canAgentUseTool(policy, agentName, tool);
  if (!ok) throw new Error(`SEC BLOCK: ${agentName} may not use tool ${tool}`);
  return policy;
}

export async function ensureDepositForScheduling(ctx: any, leadId: any, priority?: string, stage?: string) {
  const policy = await loadPolicy(ctx);

  const dr = policy.depositRules;
  if (!dr?.enabled || !dr.requireBeforeScheduling) return;

  // Exemptions
  if (dr.exemptions?.priorityEmergency && (priority === "emergency" || priority === "high")) {
    return;
  }
  if (dr.exemptions?.stages?.includes(stage ?? "")) {
    return;
  }

  // Find most recent invoice for this lead
  const invoices = await ctx.db.query("invoices").order("desc").take(200);
  const inv = invoices.find((i: any) => i.leadId && i.leadId.equals(leadId));

  const check = hasRequiredDeposit(policy, inv);
  if (!check.ok) throw new Error(`SEC BLOCK: ${check.reason}`);
}

export { DEFAULT_POLICY_KEY };