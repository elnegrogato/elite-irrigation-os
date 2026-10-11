// convex/lib/sec.ts
export type SecPolicy = {
  approvalThresholds: {
    defaultAutoApproveUnder: number;
    emergencyMaxAutoApprove: number;
    requireApprovalOver: number;
  };
  toolPermissions: Record<string, { // agentName
    allow: Array<"queue_sms" | "send_sms" | "advance_stage" | "create_estimate" | "create_appointment">;
  }>;
  depositRules?: {
    enabled: boolean;
    defaultPercent: number;
    minDepositAmount: number;
    maxDepositAmount: number;
    requireBeforeScheduling: boolean;
    applyTo?: { workOrders?: boolean; appointments?: boolean };
    exemptions?: { priorityEmergency?: boolean; stages?: string[] };
  };
  agentSettings?: Record<string, { enabled: boolean; intervalMins?: number }>;
};

export const DEFAULT_POLICY_KEY = "SEC_DEFAULT";

export function canAgentUseTool(policy: SecPolicy, agentName: string, tool: string) {
  const rules = policy.toolPermissions?.[agentName];
  if (!rules) return false;
  return rules.allow.includes(tool as any);
}

export function isAgentEnabled(policy: SecPolicy, agentName: string) {
  return policy.agentSettings?.[agentName]?.enabled ?? true; // Default to true if missing
}

export function defaultSecPolicy(): SecPolicy {
  return {
    approvalThresholds: {
      defaultAutoApproveUnder: 250,
      emergencyMaxAutoApprove: 500,
      requireApprovalOver: 1000,
    },
    toolPermissions: {
      SLAWatcher: { allow: ["queue_sms", "advance_stage"] },
      FollowUpAgent: { allow: ["queue_sms"] },
      ReviewAgent: { allow: ["queue_sms"] },
      DispatcherCopilot: { allow: ["create_appointment", "advance_stage"] },
      AdminUser: { allow: ["send_sms", "queue_sms", "advance_stage", "create_estimate", "create_appointment"] },
    },
    depositRules: {
      enabled: true,
      defaultPercent: 30,
      minDepositAmount: 200,
      maxDepositAmount: 5000,
      requireBeforeScheduling: true,
      applyTo: { workOrders: true, appointments: true },
      exemptions: { priorityEmergency: true, stages: ["lead", "contacted"] },
    },
    agentSettings: {
      SLAWatcher: { enabled: true },
      FollowUpAgent: { enabled: true },
      ReviewAgent: { enabled: true },
    },
  };
}