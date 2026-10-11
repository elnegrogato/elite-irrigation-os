// scripts/generate-sitemap.ts
import fs from "node:fs";
import path from "node:path";
import { generatedRoutes } from "../src/data/generated/routes.generated";

const BASE_URL = "https://example.com"; // set to your live domain
const outFile = path.join((process as any).cwd(), "public/sitemap.xml");

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function main() {
  const today = new Date().toISOString().slice(0, 10);

  const urlset = generatedRoutes
    .map(r => {
      const loc = `${BASE_URL}${r.path}`;
      // Priority heuristics
      const priority =
        r.kind === "core" ? "1.0" :
        r.kind === "service" || r.kind === "area" ? "0.8" :
        r.kind === "spoke" ? "0.7" :
        r.kind.includes("problem") ? "0.6" :
        r.kind.includes("brand") ? "0.5" :
        r.kind === "near_me" ? "0.6" :
        "0.4";

      return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, xml, "utf8");
  console.log(`✅ sitemap.xml written (${generatedRoutes.length} urls)`);
}

main();