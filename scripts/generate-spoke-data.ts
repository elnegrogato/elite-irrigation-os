// scripts/generate-spoke-data.ts
import fs from "node:fs";
import path from "node:path";
import { services } from "../data/services";
import { locationsFull } from "../data/locations_full";

type SpokeDatum = {
  serviceSlug: string;
  locationSlug: string;
  ring: number;
  state: string;
  // For ops + filters:
  isCore: boolean;
  isMetro: boolean;
  // Useful for internal linking:
  neighborSlugs: string[];
  // Optional: “projects-only” / “limited coverage”
  coverageMode?: "full" | "projects_only" | "limited";
};

const outFile = path.join((process as any).cwd(), "src/data/generated/spokeData.generated.ts");

// Minimal exclusion/coverage policy hooks (edit later as you learn the market)
function coverageForLocation(loc: { ring: number; tags?: string[] }) {
  if (loc.tags?.includes("projects-only")) return "projects_only";
  if (loc.ring >= 4) return "projects_only";
  return "full";
}

function main() {
  const matrix: Record<string, Record<string, SpokeDatum>> = {};

  for (const s of services) {
    matrix[s.slug] ||= {};
    for (const l of locationsFull) {
      matrix[s.slug][l.slug] = {
        serviceSlug: s.slug,
        locationSlug: l.slug,
        ring: l.ring,
        state: l.state,
        isCore: l.ring === 0,
        isMetro: l.ring <= 1,
        neighborSlugs: (l.neighbors ?? []).slice(0, 8),
        coverageMode: coverageForLocation(l),
      };
    }
  }

  const content = `// AUTO-GENERATED — do not edit by hand
export type SpokeDatum = ${JSON.stringify(
    {
      serviceSlug: "string",
      locationSlug: "string",
      ring: 0,
      state: "NC",
      isCore: true,
      isMetro: true,
      neighborSlugs: ["..."],
      coverageMode: "full",
    },
    null,
    2
  )} & any;

export const spokeData: Record<string, Record<string, any>> = ${JSON.stringify(matrix, null, 2)} as const;
`;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, content, "utf8");
  console.log(`✅ spokeData.generated.ts written`);
}

main();