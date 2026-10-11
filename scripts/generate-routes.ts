// scripts/generate-routes.ts
import fs from "node:fs";
import path from "node:path";
import { services } from "../data/services";
import { problems } from "../data/problems";
import { brands } from "../data/brands";
import { costPages } from "../data/costPages";
import { comparePages } from "../data/comparePages";
import { nearMeVariants } from "../data/nearMeVariants";
import { locationsFull } from "../data/locations_full";
import { allowSpoke } from "../src/data/exclusions";
import { pageFamilies } from "../src/data/pageFamilies";

type RouteRow = { path: string; kind: string; serviceSlug?: string; locationSlug?: string; refSlug?: string };

const outFile = path.join((process as any).cwd(), "src/data/generated/routes.generated.ts");

function writeTS(rows: RouteRow[]) {
  const content = `// AUTO-GENERATED — do not edit by hand
export type GeneratedRoute = { path: string; kind: string; serviceSlug?: string; locationSlug?: string; refSlug?: string };

export const generatedRoutes: GeneratedRoute[] = ${JSON.stringify(rows, null, 2)} as const;
`;
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, content, "utf8");
}

function main() {
  const rows: RouteRow[] = [];

  // Core pages
  rows.push({ path: "/", kind: "core" });
  rows.push({ path: "/services", kind: "core" });
  rows.push({ path: "/areas-we-serve", kind: "core" });
  rows.push({ path: "/problems", kind: "core" });
  rows.push({ path: "/brands", kind: "core" });
  rows.push({ path: "/cost", kind: "core" });
  rows.push({ path: "/compare", kind: "core" });
  rows.push({ path: "/book-now", kind: "core" });

  // Services + areas
  for (const s of services) rows.push({ path: `/services/${s.slug}`, kind: "service", refSlug: s.slug });
  for (const l of locationsFull) rows.push({ path: `/areas/${l.slug}`, kind: "area", locationSlug: l.slug });

  // Spokes: service × location
  for (const s of services) {
    for (const l of locationsFull) {
      const verdict = allowSpoke(s, l);
      if (!verdict.allowed) continue;
      rows.push({ path: `/${s.slug}-${l.slug}`, kind: "spoke", serviceSlug: s.slug, locationSlug: l.slug });
    }
  }

  // Problems: hub + problem + problem×location
  for (const p of problems) {
    rows.push({ path: `/problems/${p.slug}`, kind: "problem", refSlug: p.slug });
    for (const l of locationsFull) {
      if (l.ring > 3) continue; 
      rows.push({ path: `/problems/${p.slug}/${l.slug}`, kind: "problem_spoke", refSlug: p.slug, locationSlug: l.slug });
    }
  }

  // Brands: hub + brand + brand×location
  for (const b of brands) {
    rows.push({ path: `/brands/${b.slug}`, kind: "brand", refSlug: b.slug });
    for (const l of locationsFull) {
      if (l.ring > 3) continue;
      rows.push({ path: `/brands/${b.slug}/${l.slug}`, kind: "brand_spoke", refSlug: b.slug, locationSlug: l.slug });
    }
  }

  // Cost + Compare
  for (const c of costPages) rows.push({ path: `/cost/${c.slug}`, kind: "cost", refSlug: c.slug });
  for (const c of comparePages) rows.push({ path: `/compare/${c.slug}`, kind: "compare", refSlug: c.slug });

  // Near-me variants
  for (const v of nearMeVariants) {
    for (const l of locationsFull) {
      // Ring cap for near-me: typically keep it tight (0-2)
      if (l.ring > 2) continue;
      rows.push({ path: `/${v.slug}/${l.slug}`, kind: "near_me", refSlug: v.slug, locationSlug: l.slug });
    }
  }

  // Page Families
  for (const fam of pageFamilies) {
    for (const l of locationsFull) {
      if (fam.states && !fam.states.includes(l.state)) continue;
      if (typeof fam.maxRing === "number" && l.ring > fam.maxRing) continue;
      if (typeof fam.minRing === "number" && l.ring < fam.minRing) continue;
      rows.push({ path: fam.route(l.slug), kind: "family", refSlug: fam.slug, locationSlug: l.slug });
    }
  }

  writeTS(rows);
  console.log(`✅ routes.generated.ts written (${rows.length} routes)`);
}

main();