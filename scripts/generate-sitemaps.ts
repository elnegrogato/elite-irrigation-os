// scripts/generate-sitemaps.ts
import fs from "node:fs";
import path from "node:path";
import { generatedRoutes } from "../src/data/generated/routes.generated";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://eliteirrigation.com").replace(/\/$/, "");
const outDir = path.join((process as any).cwd(), "public/sitemaps");
const indexFile = path.join((process as any).cwd(), "public/sitemap-index.xml");
const rootSitemapFile = path.join((process as any).cwd(), "public/sitemap.xml");

const MAX_URLS_PER_SITEMAP = 45000; // stay under 50k with buffer

const staticMarketingRoutes: Array<{ path: string; kind: string }> = [
  { path: "/", kind: "core" },
  { path: "/services", kind: "core" },
  { path: "/areas-we-serve", kind: "core" },
  { path: "/projects", kind: "core" },
  { path: "/about", kind: "core" },
  { path: "/quick-quote", kind: "core" },
  { path: "/book-now", kind: "core" },
  { path: "/pricing", kind: "core" },
  { path: "/contact", kind: "core" },
  { path: "/docs", kind: "core" },
  { path: "/support", kind: "core" },
  { path: "/careers", kind: "core" },
  { path: "/resources", kind: "core" },
  { path: "/terms", kind: "legal" },
  { path: "/privacy", kind: "legal" },
  { path: "/cookies", kind: "legal" },
];

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function priority(kind: string) {
  if (kind === "core") return "1.0";
  if (kind === "service" || kind === "area") return "0.8";
  if (kind === "spoke") return "0.7";
  if (kind.includes("problem")) return "0.6";
  if (kind.includes("brand")) return "0.5";
  if (kind === "near_me") return "0.6";
  return "0.4";
}

function sitemapXml(paths: Array<{ path: string; kind: string }>, today: string) {
  const urlset = paths
    .map(r => {
      const loc = `${BASE_URL}${r.path}`;
      return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority(r.kind)}</priority>
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
}

function sitemapIndexXml(files: string[], today: string) {
  const items = files
    .map(f => {
      const loc = `${BASE_URL}/sitemaps/${f}`;
      return `
  <sitemap>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

function main() {
  const today = new Date().toISOString().slice(0, 10);
  fs.mkdirSync(outDir, { recursive: true });

  const routeMap = new Map<string, { path: string; kind: string }>();
  [...staticMarketingRoutes, ...generatedRoutes].forEach(route => {
    routeMap.set(route.path, { path: route.path, kind: route.kind });
  });
  const routes = [...routeMap.values()].sort((a, b) => a.path.localeCompare(b.path));

  const chunks: Array<Array<{ path: string; kind: string }>> = [];
  for (let i = 0; i < routes.length; i += MAX_URLS_PER_SITEMAP) {
    chunks.push(routes.slice(i, i + MAX_URLS_PER_SITEMAP));
  }

  const files: string[] = [];
  chunks.forEach((chunk, idx) => {
    const file = `sitemap-${idx + 1}.xml`;
    fs.writeFileSync(path.join(outDir, file), sitemapXml(chunk, today), "utf8");
    files.push(file);
  });

  fs.writeFileSync(indexFile, sitemapIndexXml(files, today), "utf8");
  fs.writeFileSync(rootSitemapFile, chunks.length === 1 ? sitemapXml(chunks[0], today) : sitemapIndexXml(files, today), "utf8");
  console.log(`✅ Wrote ${routes.length} URLs across ${files.length} sitemap file(s), sitemap.xml, and sitemap-index.xml`);
}

main();
