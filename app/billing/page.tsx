import type { Metadata } from "next";
import { StaticOpsPage } from "../../src/components/OperationsPages";

export const metadata: Metadata = {
  title: "Billing & Subscription | Elite Portal",
  description: "Review subscriptions, invoices, Stripe payment status, balances, and customer billing workflows in the Elite portal.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <StaticOpsPage kind="billing" />;
}
