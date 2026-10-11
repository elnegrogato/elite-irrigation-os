import type { Metadata } from "next";
import { StaticOpsPage } from "../../src/components/OperationsPages";

export const metadata: Metadata = {
  title: "Settings | Elite Portal",
  description: "Configure Elite business rules, routing, policies, service areas, proof requirements, and team preferences.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <StaticOpsPage kind="settings" />;
}
