// scripts/export-case-studies.ts
import fs from "node:fs";
import path from "node:path";
import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const CONVEX_URL = process.env.CONVEX_URL || process.env.VITE_CONVEX_URL;
if (!CONVEX_URL) throw new Error("CONVEX_URL/VITE_CONVEX_URL not set");

async function main() {
  const client = new ConvexHttpClient(CONVEX_URL);

  console.log("Fetching case studies...");
  const data = await client.query("caseStudies:exportAllPublished", {});

  const outJson = path.join((process as any).cwd(), "public/case-studies.json");
  fs.writeFileSync(outJson, JSON.stringify(data, null, 2), "utf8");

  const outTs = path.join((process as any).cwd(), "src/data/generated/caseStudies.static.ts");
  const content = `// AUTO-GENERATED
export const caseStudiesStatic = ${JSON.stringify(data, null, 2)} as const;
`;
  fs.mkdirSync(path.dirname(outTs), { recursive: true });
  fs.writeFileSync(outTs, content, "utf8");

  console.log(`✅ Exported ${data.length} case studies to public/case-studies.json and TS static file`);
}

main().catch((e) => {
  console.error(e);
  (process as any).exit(1);
});
