import type { Metadata } from "next";
import { PlansHubPage } from "../../src/components/PlatformPages";
import { siteUrl } from "../../src/lib/outdoorPlatform";

export const metadata: Metadata = {
  title: "Outdoor Property Maintenance Plans Charlotte NC",
  description: "Recurring lawn care, landscape management, commercial grounds, HOA grounds, estate maintenance, irrigation checks, and seasonal outdoor property care plans.",
  alternates: { canonical: `${siteUrl}/plans` },
};

export default function PlansPage() {
  return <PlansHubPage />;
}
