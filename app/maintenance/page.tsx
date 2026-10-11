import type { Metadata } from "next";
import { PlatformLandingPage } from "../../src/components/PlatformPages";
import { getPlatformPillar, siteUrl } from "../../src/lib/outdoorPlatform";

const pillar = getPlatformPillar("maintenance")!;

export const metadata: Metadata = {
  title: pillar.metaTitle,
  description: pillar.metaDescription,
  alternates: { canonical: `${siteUrl}/maintenance` },
};

export default function MaintenancePage() {
  return <PlatformLandingPage pillar={pillar} />;
}
