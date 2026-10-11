import type { Metadata } from "next";
import { PlatformLandingPage } from "../../src/components/PlatformPages";
import { getPlatformPillar, siteUrl } from "../../src/lib/outdoorPlatform";

const pillar = getPlatformPillar("hoa")!;

export const metadata: Metadata = {
  title: pillar.metaTitle,
  description: pillar.metaDescription,
  alternates: { canonical: `${siteUrl}/hoa` },
};

export default function HoaPage() {
  return <PlatformLandingPage pillar={pillar} />;
}
