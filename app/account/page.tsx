import type { Metadata } from "next";
import { StaticOpsPage } from "../../src/components/OperationsPages";

export const metadata: Metadata = {
  title: "Account Management | Elite Portal",
  description: "Manage team profile, password, access, sessions, preferences, and notification settings in the Elite portal.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <StaticOpsPage kind="account" />;
}
