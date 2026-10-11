// src/lib/metaDynamic.ts
import { costPages, CostPage } from "../../data/costPages";
import { comparePages, ComparePage } from "../../data/comparePages";
import { nearMeVariants, NearMeVariant } from "../../data/nearMeVariants";
import { buildBaseDescription, metaForSpoke, metaForService } from "./seo";
import { serviceBySlug, locationBySlug, problemBySlug, brandBySlug } from "./indexMaps";

export type ResolvedMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
  ogType?: "website" | "article";
  ogImage?: string;
};

const BRAND = "Elite Irrigation & Landscaping";
// Default image used if specific category image isn't available.
const DEFAULT_IMG = "https://eliteirrigation.com/og-image.png";

const costMap = new Map<string, CostPage>(costPages.map(c => [c.slug, c]));
const compareMap = new Map<string, ComparePage>(comparePages.map(c => [c.slug, c]));
const nearMeMap = new Map<string, NearMeVariant>(nearMeVariants.map(v => [v.slug, v]));

function safeMeta(title: string, desc: string, path: string): ResolvedMeta {
  return {
    title: `${title} | ${BRAND}`,
    description: buildBaseDescription(desc),
    canonicalPath: path,
    ogImage: DEFAULT_IMG,
    ogType: "website"
  };
}

export function resolveMetaForPath(pathname: string): ResolvedMeta {
  const path = pathname === "" ? "/" : pathname;

  // Core pages
  if (path === "/") return safeMeta("Irrigation, Drainage, Hardscape & Lighting", "Serving Harrisburg, Charlotte + 200 miles.", "/");
  if (path === "/services") return safeMeta("Services", "Explore irrigation, drainage, hardscape, lighting, seasonal plans, and contracts.", path);
  if (path === "/areas-we-serve") return safeMeta("Areas We Serve", "Charlotte metro and regional coverage for repairs, installs, and projects.", path);
  if (path === "/problems") return safeMeta("Problem Diagnosis", "Find the cause of common irrigation, drainage, turf, and hardscape problems.", path);
  if (path === "/brands") return safeMeta("Brands We Support", "Controller, drainage, paver, and lighting ecosystems we install and service.", path);
  if (path === "/cost") return safeMeta("Cost & Pricing", "Transparent pricing ranges and drivers for common exterior services.", path);
  if (path === "/compare") return safeMeta("Comparisons", "Side-by-side comparisons to choose the right system and approach.", path);
  if (path === "/book-now") return safeMeta("Book Now", "Schedule an inspection or service call with fast response and clear options.", path);

  // /services/:slug
  if (path.startsWith("/services/")) {
    const slug = path.split("/")[2];
    const svc = serviceBySlug.get(slug);
    if (!svc) return safeMeta("Not Found", "This page does not exist.", path);
    return metaForService(svc.name, path, svc.category);
  }

  // /areas/:locationSlug
  if (path.startsWith("/areas/")) {
    const slug = path.split("/")[2];
    const loc = locationBySlug.get(slug);
    if (!loc) return safeMeta("Not Found", "This page does not exist.", path);
    return safeMeta(`Serving ${loc.name}`, `Elite services ${loc.name} with irrigation repair, drainage, hardscape, lighting, and seasonal plans.`, path);
  }

  // /problems/:problemSlug OR /problems/:problemSlug/:locationSlug
  if (path.startsWith("/problems/")) {
    const parts = path.split("/").filter(Boolean);
    const pSlug = parts[1];
    const locSlug = parts[2];
    const p = problemBySlug.get(pSlug);
    if (!p) return safeMeta("Not Found", "This page does not exist.", path);

    if (!locSlug) return safeMeta(p.title, p.aeoShortAnswer, path);

    const loc = locationBySlug.get(locSlug);
    const locName = loc?.name ?? "your area";
    return safeMeta(`${p.title} in ${locName}`, p.aeoShortAnswer, path);
  }

  // /brands/:brandSlug OR /brands/:brandSlug/:locationSlug
  if (path.startsWith("/brands/")) {
    const parts = path.split("/").filter(Boolean);
    const bSlug = parts[1];
    const locSlug = parts[2];
    const b = brandBySlug.get(bSlug);
    if (!b) return safeMeta("Not Found", "This page does not exist.", path);

    if (!locSlug) return safeMeta(b.name, b.shortPitch, path);

    const loc = locationBySlug.get(locSlug);
    const locName = loc?.name ?? "your area";
    return safeMeta(`${b.name} in ${locName}`, b.shortPitch, path);
  }

  // /cost/:slug
  if (path.startsWith("/cost/")) {
    const slug = path.split("/")[2];
    const c = costMap.get(slug);
    if (!c) return safeMeta("Not Found", "This page does not exist.", path);
    return safeMeta(c.title, c.summary, path);
  }

  // /compare/:slug
  if (path.startsWith("/compare/")) {
    const slug = path.split("/")[2];
    const c = compareMap.get(slug);
    if (!c) return safeMeta("Not Found", "This page does not exist.", path);
    return safeMeta(c.title, c.summary, path);
  }

  // Page Families: /f/:familySlug/:locationSlug
  if (path.startsWith("/f/")) {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 3) {
      const loc = locationBySlug.get(parts[2]);
      if (loc) {
         return safeMeta(`Service in ${loc.name}`, `Professional services available in ${loc.name}.`, path);
      }
    }
  }

  // Near-me: /:variantSlug/:locationSlug (ONLY if variant exists)
  {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 2) {
      const v = nearMeMap.get(parts[0]);
      const loc = locationBySlug.get(parts[1]);
      if (v && loc) {
        const title = v.titleTemplate.replace("{location}", loc.name);
        const desc = v.descriptionTemplate.replace("{location}", loc.name);
        return safeMeta(title, desc, path);
      }
    }
  }

  // Spoke: /:serviceSlug-:locationSlug
  {
    const match = path.match(/^\/([a-z0-9-]+)-([a-z0-9-]+)$/i);
    if (match) {
      const serviceSlug = match[1];
      const locationSlug = match[2];
      const svc = serviceBySlug.get(serviceSlug);
      const loc = locationBySlug.get(locationSlug);
      if (svc && loc) {
        return metaForSpoke(svc.name, loc.name, path, svc.category);
      }
    }
  }

  return safeMeta("Elite Irrigation & Landscaping", "Charlotte irrigation, drainage, landscaping, hardscapes, lighting, and outdoor property care.", path);
}
