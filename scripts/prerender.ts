// scripts/prerender.ts
import fs from "node:fs";
import path from "node:path";
import { pathToFileUrl } from "url";
import { generatedRoutes } from "../src/data/generated/routes.generated";

// IMPORTANT: this imports the SSR render function from build output.
// We'll build SSR first, then this script runs with the built server bundle.

const OUT_DIR = path.join((process as any).cwd(), "dist-static");

// ENV controls for batching
const BATCH_INDEX = Number(process.env.BATCH_INDEX ?? "0");   // 0-based
const BATCH_SIZE = Number(process.env.BATCH_SIZE ?? "100000"); // default all
const CONCURRENCY = Number(process.env.CONCURRENCY ?? "8");

function filePathForRoute(routePath: string) {
  const normalized = routePath === "/" ? "/index" : routePath;
  return path.join(OUT_DIR, normalized, "index.html");
}

async function main() {
  const entryServerPath = path.join((process as any).cwd(), "dist-ssr/entry-server.js");
  const { render } = await import(pathToFileUrl(entryServerPath).toString());

  const start = BATCH_INDEX * BATCH_SIZE;
  const end = Math.min(generatedRoutes.length, start + BATCH_SIZE);
  const slice = generatedRoutes.slice(start, end);

  console.log(`Batch ${BATCH_INDEX}: rendering ${slice.length} pages (${start}..${end-1}) with ${CONCURRENCY} workers`);

  let i = 0;
  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= slice.length) break;
      
      const r = slice[idx];
      const html = render(r.path);
      const fp = filePathForRoute(r.path);
      
      fs.mkdirSync(path.dirname(fp), { recursive: true });
      fs.writeFileSync(fp, html, "utf8");
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log(`✅ Rendered batch ${BATCH_INDEX}`);
}

main().catch(err => {
  console.error(err);
  (process as any).exit(1);
});