// scripts/generate-page-manifests.ts
import fs from "node:fs";
import path from "node:path";
import { services } from "../data/services";
import { problems } from "../data/problems";
import { brands } from "../data/brands";
import { costPages } from "../data/costPages";
import { comparePages } from "../data/comparePages";
import { nearMeVariants } from "../data/nearMeVariants";
import { locationsFull } from "../data/locations_full";
import { metaForSpoke, metaForService, metaForArea, metaForIndex } from "../src/lib/seo";
import { getLinksForSpoke } from "../src/lib/linkGraph";

type PageKind =
  | "core"
  | "service"
  | "area"
  | "spoke"
  | "problem"
  | "problem_spoke"
  | "brand"
  | "brand_spoke"
  | "cost"
  | "compare"
  | "near_me";

type Manifest = {
  path: string;
  kind: PageKind;
  title: string;
  description: string;
  canonicalPath: string;
  // Lightweight context for pre-render / analytics
  serviceSlug?: string;
  locationSlug?: string;
  refSlug?: string; // problem slug, brand slug, cost slug, compare slug, nearMe variant slug
  // Precomputed internal link targets (spoke pages only)
  links?: ReturnType<typeof getLinksForSpoke>;
};

const outFile = path.join((process as any).cwd(), "src/data/generated/pageManifests.generated.ts");

function findLocation(slug: string) {
  return locationsFull.find(l => l.slug === slug);
}
function findService(slug: string) {
  return services.find(s => s.slug === slug);
}

function main() {
  const manifests: Manifest[] = [];

  // Core/index pages
  const core = [
    { path: "/", kind: "core" as const, title: "Home", desc: "Exterior systems: irrigation, drainage, hardscape, lighting, and seasonal plans." },
    { path: "/services", kind: "core" as const, title: "Services", desc: "All services offered by Elite." },
    { path: "/areas-we-serve", kind: "core" as const, title: "Areas We Serve", desc: "Charlotte + 200 miles coverage map." },
    { path: "/problems", kind: "core" as const, title: "Problems", desc: "Diagnosis pages for common irrigation, drainage, and hardscape issues." },
    { path: "/brands", kind: "core" as const, title: "Brands", desc: "Brands and systems we support." },
    { path: "/cost", kind: "core" as const, title: "Cost", desc: "Cost and pricing transparency pages." },
    { path: "/compare", kind: "core" as const, title: "Compare", desc: "Comparison guides for homeowners and property managers." },
    { path: "/book-now", kind: "core" as const, title: "Book Now", desc: "Schedule an inspection or service call." },
  ];

  for (const c of core) {
    const meta = metaForIndex(c.title, c.path, c.desc);
    manifests.push({
      path: c.path,
      kind: c.kind,
      title: meta.title,
      description: meta.description,
      canonicalPath: meta.canonicalPath,
    });
  }

  // Services
  for (const s of services) {
    const p = `/services/${s.slug}`;
    const meta = metaForService(s.name, p);
    manifests.push({
      path: p,
      kind: "service",
      title: meta.title,
      description: meta.description,
      canonicalPath: meta.canonicalPath,
      refSlug: s.slug,
      serviceSlug: s.slug,
    });
  }

  // Areas
  for (const l of locationsFull) {
    const p = `/areas/${l.slug}`;
    const meta = metaForArea(l.name, p);
    manifests.push({
      path: p,
      kind: "area",
      title: meta.title,
      description: meta.description,
      canonicalPath: meta.canonicalPath,
      locationSlug: l.slug,
      refSlug: l.slug,
    });
  }

  // Spokes
  for (const s of services) {
    for (const l of locationsFull) {
      const p = `/${s.slug}-${l.slug}`;
      const meta = metaForSpoke(s.name, l.name, p);
      manifests.push({
        path: p,
        kind: "spoke",
        title: meta.title,
        description: meta.description,
        canonicalPath: meta.canonicalPath,
        serviceSlug: s.slug,
        locationSlug: l.slug,
        links: getLinksForSpoke(s.slug, l.slug),
      });
    }
  }

  // Problems
  for (const pr of problems) {
    const p = `/problems/${pr.slug}`;
    const meta = metaForIndex(pr.title, p, pr.aeoShortAnswer);
    manifests.push({
      path: p,
      kind: "problem",
      title: meta.title,
      description: meta.description,
      canonicalPath: meta.canonicalPath,
      refSlug: pr.slug,
    });

    for (const l of locationsFull) {
      const pp = `/problems/${pr.slug}/${l.slug}`;
      const meta2 = metaForIndex(`${pr.title} in ${l.name}`, pp, pr.aeoShortAnswer);
      manifests.push({
        path: pp,
        kind: "problem_spoke",
        title: meta2.title,
        description: meta2.description,
        canonicalPath: meta2.canonicalPath,
        refSlug: pr.slug,
        locationSlug: l.slug,
      });
    }
  }

  // Brands
  for (const b of brands) {
    const p = `/brands/${b.slug}`;
    const meta = metaForIndex(b.name, p, b.shortPitch);
    manifests.push({
      path: p,
      kind: "brand",
      title: meta.title,
      description: meta.description,
      canonicalPath: meta.canonicalPath,
      refSlug: b.slug,
    });

    for (const l of locationsFull) {
      const pp = `/brands/${b.slug}/${l.slug}`;
      const meta2 = metaForIndex(`${b.name} in ${l.name}`, pp, b.shortPitch);
      manifests.push({
        path: pp,
        kind: "brand_spoke",
        title: meta2.title,
        description: meta2.description,
        canonicalPath: meta2.canonicalPath,
        refSlug: b.slug,
        locationSlug: l.slug,
      });
    }
  }

  // Cost + compare
  for (const c of costPages) {
    const p = `/cost/${c.slug}`;
    const meta = metaForIndex(c.title, p, c.summary);
    manifests.push({
      path: p,
      kind: "cost",
      title: meta.title,
      description: meta.description,
      canonicalPath: meta.canonicalPath,
      refSlug: c.slug,
    });
  }

  for (const c of comparePages) {
    const p = `/compare/${c.slug}`;
    const meta = metaForIndex(c.title, p, c.summary);
    manifests.push({
      path: p,
      kind: "compare",
      title: meta.title,
      description: meta.description,
      canonicalPath: meta.canonicalPath,
      refSlug: c.slug,
    });
  }

  // Near-me variants
  for (const v of nearMeVariants) {
    for (const l of locationsFull) {
      const p = `/${v.slug}/${l.slug}`;
      const title = v.titleTemplate.replace("{location}", l.name);
      const desc = v.descriptionTemplate.replace("{location}", l.name);
      const meta = metaForIndex(title, p, desc);
      manifests.push({
        path: p,
        kind: "near_me",
        title: meta.title,
        description: meta.description,
        canonicalPath: meta.canonicalPath,
        refSlug: v.slug,
        locationSlug: l.slug,
      });
    }
  }

  // Write TS file
  const content = `// AUTO-GENERATED — do not edit by hand
export type PageKind =
  | "core" | "service" | "area" | "spoke"
  | "problem" | "problem_spoke"
  | "brand" | "brand_spoke"
  | "cost" | "compare" | "near_me";

export type PageManifest = {
  path: string;
  kind: PageKind;
  title: string;
  description: string;
  canonicalPath: string;
  serviceSlug?: string;
  locationSlug?: string;
  refSlug?: string;
  links?: any;
};

export const pageManifests: PageManifest[] = ${JSON.stringify(manifests, null, 2)} as const;

export const manifestByPath: Record<string, PageManifest> = Object.fromEntries(
  pageManifests.map(m => [m.path, m])
) as any;
`;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, content, "utf8");
  console.log(`✅ pageManifests.generated.ts written (${manifests.length} manifests)`);
}

main();