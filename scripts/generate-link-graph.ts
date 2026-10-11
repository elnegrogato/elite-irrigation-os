// scripts/generate-link-graph.ts
import fs from "node:fs";
import path from "node:path";
import { services } from "../data/services";
import { locationsFull } from "../data/locations_full";
import { getLinksForSpoke } from "../src/lib/linkGraph";

const outFile = path.join((process as any).cwd(), "src/data/generated/linkGraph.generated.ts");

function main() {
  const graph: Record<string, Record<string, any>> = {};

  for (const s of services) {
    graph[s.slug] ||= {};
    for (const l of locationsFull) {
      graph[s.slug][l.slug] = getLinksForSpoke(s.slug, l.slug);
    }
  }

  const content = `// AUTO-GENERATED — do not edit by hand
export const linkGraph = ${JSON.stringify(graph, null, 2)} as const;
`;
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, content, "utf8");
  console.log(`✅ linkGraph.generated.ts written`);
}

main();