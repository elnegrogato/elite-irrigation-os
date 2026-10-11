import type { Metadata } from "next";
import { StaticOpsPage } from "../../src/components/OperationsPages";

export const metadata: Metadata = {
  title: "Activity Log | Elite Portal",
  description: "Track form submissions, stage changes, approvals, invoices, work orders, automations, and customer communication events.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <StaticOpsPage kind="activity" />;
}
