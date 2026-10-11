import type { Metadata } from "next";
import { StaticOpsPage } from "../../src/components/OperationsPages";

export const metadata: Metadata = {
  title: "API Keys & Webhooks | Elite Portal",
  description: "Manage scoped API keys, webhook signing, credential rotation, and integration access for the Elite portal.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <StaticOpsPage kind="apiKeys" />;
}
