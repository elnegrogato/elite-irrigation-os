// convex/lib/deposit.ts
import type { SecPolicy } from "./sec";

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function requiredDeposit(policy: SecPolicy, invoiceTotal: number) {
  const dr = policy.depositRules!;
  const pct = clamp(dr.defaultPercent ?? 30, 5, 95) / 100;
  const raw = invoiceTotal * pct;
  const minAmt = dr.minDepositAmount ?? 0;
  const maxAmt = dr.maxDepositAmount ?? invoiceTotal;
  return clamp(raw, minAmt, maxAmt);
}

export function hasRequiredDeposit(policy: SecPolicy, invoice: any) {
  const dr = policy.depositRules;
  if (!dr?.enabled || !dr.requireBeforeScheduling) return { ok: true as const };

  // If no invoice, can’t verify deposit
  if (!invoice) return { ok: false as const, reason: "No invoice exists to collect deposit." };

  const req = requiredDeposit(policy, invoice.total ?? invoice.balanceDue ?? 0);
  const paid = invoice.amountPaid ?? 0;

  if (paid >= req) return { ok: true as const };

  return {
    ok: false as const,
    reason: `Deposit required: $${req.toFixed(2)} (paid $${paid.toFixed(2)}).`,
    required: req,
    paid,
  };
}