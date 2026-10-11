import type { Metadata } from "next";
import { PlatformLandingPage } from "../../src/components/PlatformPages";
import { getPlatformPillar, siteUrl } from "../../src/lib/outdoorPlatform";

const pillar = getPlatformPillar("design")!;

export const metadata: Metadata = {
  title: pillar.metaTitle,
  description: pillar.metaDescription,
  alternates: { canonical: `${siteUrl}/design` },
};

export default function DesignPage() {
  return <PlatformLandingPage pillar={pillar} />;
}
