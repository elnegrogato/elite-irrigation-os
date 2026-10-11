import type { Metadata } from "next";
import { PlatformLandingPage } from "../../src/components/PlatformPages";
import { getPlatformPillar, siteUrl } from "../../src/lib/outdoorPlatform";

const pillar = getPlatformPillar("hardscapes")!;

export const metadata: Metadata = {
  title: pillar.metaTitle,
  description: pillar.metaDescription,
  alternates: { canonical: `${siteUrl}/hardscapes` },
};

export default function HardscapesPage() {
  return <PlatformLandingPage pillar={pillar} />;
}
