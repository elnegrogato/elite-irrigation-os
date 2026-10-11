import type { Metadata } from "next";
import { DashboardPage } from "../../src/components/OperationsPages";

export const metadata: Metadata = {
  title: "Operations Dashboard | Elite Portal",
  description: "Run Elite Irrigation & Landscaping leads, work orders, invoices, approvals, and activity from one responsive dashboard.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DashboardPage />;
}
