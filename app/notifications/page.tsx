import type { Metadata } from "next";
import { StaticOpsPage } from "../../src/components/OperationsPages";

export const metadata: Metadata = {
  title: "Notifications | Elite Portal",
  description: "Review lead, field, invoice, compliance, and SLA notifications for Elite Irrigation & Landscaping operations.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <StaticOpsPage kind="notifications" />;
}
