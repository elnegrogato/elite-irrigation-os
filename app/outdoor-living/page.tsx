import type { Metadata } from "next";
import { PlatformLandingPage } from "../../src/components/PlatformPages";
import { getPlatformPillar, siteUrl } from "../../src/lib/outdoorPlatform";

const pillar = getPlatformPillar("outdoor-living")!;

export const metadata: Metadata = {
  title: pillar.metaTitle,
  description: pillar.metaDescription,
  alternates: { canonical: `${siteUrl}/outdoor-living` },
};

export default function OutdoorLivingPage() {
  return <PlatformLandingPage pillar={pillar} />;
}
