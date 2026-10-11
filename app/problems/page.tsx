import type { Metadata } from "next";
import { ProblemHubPage } from "../../src/components/PlatformPages";
import { siteUrl } from "../../src/lib/outdoorPlatform";

export const metadata: Metadata = {
  title: "Outdoor Property Problem Finder Charlotte NC",
  description: "Find the right outdoor service based on sprinkler problems, standing water, drainage issues, soggy lawns, patio pooling, overgrown beds, and commercial grounds needs.",
  alternates: { canonical: `${siteUrl}/problems` },
};

export default function ProblemsPage() {
  return <ProblemHubPage />;
}
