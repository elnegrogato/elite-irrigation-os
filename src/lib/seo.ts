// src/lib/seo.ts
import { safeJoin } from "./format";

export type SeoMeta = {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
  ogType?: "website" | "article";
  ogImage?: string;
};

const BRAND = "Elite Irrigation & Landscaping";
const PRIMARY_CITY = "Harrisburg, NC";
const SERVICE_AREA = "Charlotte, NC + 200 miles";

// Use the branded social card instead of generic stock imagery for generated metadata.
const DEFAULT_OG_IMAGE = "https://eliteirrigation.com/og-image.png";

export function buildBaseDescription(extra?: string) {
  return safeJoin(
    `${BRAND} • ${PRIMARY_CITY}`,
    `Serving ${SERVICE_AREA}`,
    extra ?? "Fast scheduling, evidence-grade photo proof, and clear pricing options."
  );
}

export function metaForSpoke(serviceName: string, locationName: string, path: string, category?: string): SeoMeta {
  const title = `${serviceName} in ${locationName} | ${BRAND}`;
  const description = buildBaseDescription(
    `${serviceName} in ${locationName}. Repairs, installs, upgrades, seasonal plans, and commercial/HOA options.`
  );
  return { 
    title, 
    description, 
    canonicalPath: path,
    ogType: "website",
    ogImage: getImageForCategory(category)
  };
}

export function metaForService(serviceName: string, path: string, category?: string): SeoMeta {
  const title = `${serviceName} | ${BRAND}`;
  const description = buildBaseDescription(`${serviceName} services: process, pricing bands, FAQs, and booking.`);
  return { 
    title, 
    description, 
    canonicalPath: path,
    ogType: "website",
    ogImage: getImageForCategory(category)
  };
}

export function metaForArea(locationName: string, path: string): SeoMeta {
  const title = `Areas We Serve: ${locationName} | ${BRAND}`;
  const description = buildBaseDescription(
    `Elite serves ${locationName} with irrigation repair, drainage solutions, hardscape, lighting, and seasonal plans.`
  );
  return { title, description, canonicalPath: path, ogType: "website", ogImage: DEFAULT_OG_IMAGE };
}

export function metaForIndex(title: string, path: string, desc?: string): SeoMeta {
  return { 
    title: `${title} | ${BRAND}`, 
    description: buildBaseDescription(desc), 
    canonicalPath: path,
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE
  };
}

function getImageForCategory(_cat?: string): string {
  return DEFAULT_OG_IMAGE;
}
