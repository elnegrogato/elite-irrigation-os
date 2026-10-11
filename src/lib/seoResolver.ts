// src/lib/seoResolver.ts
import { serviceBySlug, locationBySlug, problemBySlug, brandBySlug } from "./indexMaps";
import { costPages, CostPage } from "../../data/costPages";
import { comparePages, ComparePage } from "../../data/comparePages";
import { nearMeVariants, NearMeVariant } from "../../data/nearMeVariants";
import { routes as R } from "./routeHelpers";

type Family = { slug: string; titleTemplate: string; descriptionTemplate: string };

type PageKind =
  | "home" | "servicesIndex" | "service" | "areasIndex" | "area"
  | "spoke"
  | "problemsIndex" | "problem" | "problemSpoke"
  | "brandsIndex" | "brand" | "brandSpoke"
  | "costIndex" | "cost"
  | "compareIndex" | "compare"
  | "nearMe"
  | "family"
  | "bookNow"
  | "notFound";

export type SeoResolved = {
  kind: PageKind;
  title: string;
  description: string;
  canonical: string;
  og: {
    type: "website" | "article";
    url: string;
    title: string;
    description: string;
    image: string; // absolute URL
  };
  twitter: {
    card: "summary_large_image" | "summary";
    title: string;
    description: string;
    image: string;
  };
  jsonLd: any[]; // array of JSON-LD blocks to inject
};

const BRAND = "Elite Irrigation & Landscaping";
const HQ = "Harrisburg, NC";
const SERVICE_AREA = "Charlotte, NC + 200 miles";

// Keep generated/static metadata aligned with the primary Next metadata.
const SITE_URL = "https://eliteirrigation.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

function baseDesc(extra?: string) {
  const core = `${BRAND} • ${HQ} • Serving ${SERVICE_AREA}.`;
  return extra ? `${core} ${extra}` : core;
}

function absUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function localBusinessLd(areaServed: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: BRAND,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    areaServed: areaServed.map(a => ({ "@type": "Place", name: a })),
    address: { "@type": "PostalAddress", addressLocality: "Harrisburg", addressRegion: "NC" },
  };
}

function serviceLd(serviceName: string, area: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    provider: { "@type": "LocalBusiness", name: BRAND },
    areaServed: area,
    url,
  };
}

function breadcrumbLd(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

// lightweight lookups for cost/compare/nearMe/family
const costBySlug = new Map<string, CostPage>(costPages.map(x => [x.slug, x]));
const compareBySlug = new Map<string, ComparePage>(comparePages.map(x => [x.slug, x]));
const nearMeBySlug = new Map<string, NearMeVariant>(nearMeVariants.map(v => [v.slug, v]));
const familyBySlug = new Map<string, Family>();

export function resolveSeoForPath(pathname: string): SeoResolved {
  const path = pathname === "" ? "/" : pathname;

  // Core pages
  if (path === "/") {
    const title = `Irrigation, Drainage, Hardscape & Lighting | ${BRAND}`;
    const description = baseDesc("Repairs, installs, seasonal plans, and HOA/commercial contracts with photo-proof documentation.");
    const canonical = R.home();
    return {
      kind: "home",
      title,
      description,
      canonical,
      og: { type: "website", url: absUrl(canonical), title, description, image: DEFAULT_OG_IMAGE },
      twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
      jsonLd: [localBusinessLd([HQ, "Charlotte, NC"])],
    };
  }

  if (path === R.servicesIndex()) {
    const title = `Services | ${BRAND}`;
    const description = baseDesc("Explore irrigation repair, drainage remediation, hardscape builds, lighting installs, and seasonal service plans.");
    return {
      kind: "servicesIndex",
      title,
      description,
      canonical: path,
      og: { type: "website", url: absUrl(path), title, description, image: DEFAULT_OG_IMAGE },
      twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
      jsonLd: [localBusinessLd([HQ, "Charlotte, NC"])],
    };
  }

  if (path === R.areasIndex()) {
    const title = `Areas We Serve | ${BRAND}`;
    const description = baseDesc("Charlotte metro + regional coverage. Dense routes for fast scheduling; project crews for larger installs.");
    return {
      kind: "areasIndex",
      title,
      description,
      canonical: path,
      og: { type: "website", url: absUrl(path), title, description, image: DEFAULT_OG_IMAGE },
      twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
      jsonLd: [localBusinessLd([HQ, "Charlotte, NC"])],
    };
  }

  if (path === R.problemsIndex()) {
    const title = `Problem Diagnosis | ${BRAND}`;
    const description = baseDesc("Find the cause of common sprinkler, drainage, turf, and hardscape issues with next-step guidance.");
    return {
      kind: "problemsIndex",
      title,
      description,
      canonical: path,
      og: { type: "website", url: absUrl(path), title, description, image: DEFAULT_OG_IMAGE },
      twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
      jsonLd: [localBusinessLd([HQ, "Charlotte, NC"])],
    };
  }

  if (path === R.brandsIndex()) {
    const title = `Brands We Support | ${BRAND}`;
    const description = baseDesc("Controller, drainage, lighting, and hardscape ecosystems we install and service.");
    return {
      kind: "brandsIndex",
      title,
      description,
      canonical: path,
      og: { type: "website", url: absUrl(path), title, description, image: DEFAULT_OG_IMAGE },
      twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
      jsonLd: [localBusinessLd([HQ, "Charlotte, NC"])],
    };
  }

  if (path === R.costIndex()) {
    const title = `Cost & Pricing | ${BRAND}`;
    const description = baseDesc("Pricing bands and key drivers for common services like sprinkler repair, french drains, sod, and patios.");
    return {
      kind: "costIndex",
      title,
      description,
      canonical: path,
      og: { type: "website", url: absUrl(path), title, description, image: DEFAULT_OG_IMAGE },
      twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
      jsonLd: [localBusinessLd([HQ, "Charlotte, NC"])],
    };
  }

  if (path === R.compareIndex()) {
    const title = `Comparisons | ${BRAND}`;
    const description = baseDesc("Side-by-side comparisons to choose the right approach and avoid repeat problems.");
    return {
      kind: "compareIndex",
      title,
      description,
      canonical: path,
      og: { type: "website", url: absUrl(path), title, description, image: DEFAULT_OG_IMAGE },
      twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
      jsonLd: [localBusinessLd([HQ, "Charlotte, NC"])],
    };
  }

  if (path === R.bookNow()) {
    const title = `Book Now | ${BRAND}`;
    const description = baseDesc("Schedule an assessment or service call. Fast response, clear options, and proof documentation.");
    return {
      kind: "bookNow",
      title,
      description,
      canonical: path,
      og: { type: "website", url: absUrl(path), title, description, image: DEFAULT_OG_IMAGE },
      twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
      jsonLd: [localBusinessLd([HQ, "Charlotte, NC"])],
    };
  }

  // /services/:slug
  if (path.startsWith("/services/")) {
    const slug = path.split("/")[2];
    const svc = serviceBySlug.get(slug);
    if (svc) {
      const title = `${svc.name} | ${BRAND}`;
      const description = baseDesc(`${svc.quickSummary} Process, options, FAQs, and booking.`);
      const url = absUrl(path);
      return {
        kind: "service",
        title,
        description,
        canonical: path,
        og: { type: "article", url, title, description, image: DEFAULT_OG_IMAGE },
        twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
        jsonLd: [
          localBusinessLd([HQ, "Charlotte, NC"]),
          serviceLd(svc.name, SERVICE_AREA, url),
          breadcrumbLd([
            { name: "Home", item: absUrl("/") },
            { name: "Services", item: absUrl("/services") },
            { name: svc.name, item: url },
          ]),
        ],
      };
    }
  }

  // /areas/:locationSlug
  if (path.startsWith("/areas/")) {
    const slug = path.split("/")[2];
    const loc = locationBySlug.get(slug);
    if (loc) {
      const title = `Serving ${loc.name} | ${BRAND}`;
      const description = baseDesc(`Elite serves ${loc.name} with irrigation, drainage, hardscape, lighting, and seasonal plans.`);
      const url = absUrl(path);
      return {
        kind: "area",
        title,
        description,
        canonical: path,
        og: { type: "article", url, title, description, image: DEFAULT_OG_IMAGE },
        twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
        jsonLd: [
          localBusinessLd([HQ, loc.name]),
          breadcrumbLd([
            { name: "Home", item: absUrl("/") },
            { name: "Areas", item: absUrl("/areas-we-serve") },
            { name: loc.name, item: url },
          ]),
        ],
      };
    }
  }

  // /problems/:p or /problems/:p/:loc
  if (path.startsWith("/problems/")) {
    const parts = path.split("/").filter(Boolean);
    const pSlug = parts[1];
    const lSlug = parts[2];
    const p = problemBySlug.get(pSlug);
    if (p) {
      const loc = lSlug ? locationBySlug.get(lSlug) : undefined;
      const title = loc ? `${p.title} in ${loc.name} | ${BRAND}` : `${p.title} | ${BRAND}`;
      const description = baseDesc(p.aeoShortAnswer);
      const url = absUrl(path);
      return {
        kind: loc ? "problemSpoke" : "problem",
        title,
        description,
        canonical: path,
        og: { type: "article", url, title, description, image: DEFAULT_OG_IMAGE },
        twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
        jsonLd: [
          localBusinessLd([HQ, loc?.name ?? "Charlotte, NC"]),
          breadcrumbLd([
            { name: "Home", item: absUrl("/") },
            { name: "Problems", item: absUrl("/problems") },
            { name: p.title, item: absUrl(`/problems/${p.slug}`) },
            ...(loc ? [{ name: loc.name, item: url }] : []),
          ]),
        ],
      };
    }
  }

  // /brands/:b or /brands/:b/:loc
  if (path.startsWith("/brands/")) {
    const parts = path.split("/").filter(Boolean);
    const bSlug = parts[1];
    const lSlug = parts[2];
    const b = brandBySlug.get(bSlug);
    if (b) {
      const loc = lSlug ? locationBySlug.get(lSlug) : undefined;
      const title = loc ? `${b.name} in ${loc.name} | ${BRAND}` : `${b.name} | ${BRAND}`;
      const description = baseDesc(b.shortPitch);
      const url = absUrl(path);
      return {
        kind: loc ? "brandSpoke" : "brand",
        title,
        description,
        canonical: path,
        og: { type: "article", url, title, description, image: DEFAULT_OG_IMAGE },
        twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
        jsonLd: [
          localBusinessLd([HQ, loc?.name ?? "Charlotte, NC"]),
          breadcrumbLd([
            { name: "Home", item: absUrl("/") },
            { name: "Brands", item: absUrl("/brands") },
            { name: b.name, item: absUrl(`/brands/${b.slug}`) },
            ...(loc ? [{ name: loc.name, item: url }] : []),
          ]),
        ],
      };
    }
  }

  // /cost/:slug
  if (path.startsWith("/cost/")) {
    const slug = path.split("/")[2];
    const c = costBySlug.get(slug);
    if (c) {
      const title = `${c.title} | ${BRAND}`;
      const description = baseDesc(c.summary);
      const url = absUrl(path);
      return {
        kind: "cost",
        title,
        description,
        canonical: path,
        og: { type: "article", url, title, description, image: DEFAULT_OG_IMAGE },
        twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
        jsonLd: [localBusinessLd([HQ, "Charlotte, NC"])],
      };
    }
  }

  // /compare/:slug
  if (path.startsWith("/compare/")) {
    const slug = path.split("/")[2];
    const c = compareBySlug.get(slug);
    if (c) {
      const title = `${c.title} | ${BRAND}`;
      const description = baseDesc(c.summary);
      const url = absUrl(path);
      return {
        kind: "compare",
        title,
        description,
        canonical: path,
        og: { type: "article", url, title, description, image: DEFAULT_OG_IMAGE },
        twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
        jsonLd: [localBusinessLd([HQ, "Charlotte, NC"])],
      };
    }
  }

  // family pages: /f/:family/:loc
  if (path.startsWith("/f/")) {
    const parts = path.split("/").filter(Boolean);
    const famSlug = parts[1];
    const locSlug = parts[2];
    const fam = familyBySlug.get(famSlug);
    const loc = locationBySlug.get(locSlug);
    if (fam && loc) {
      const t = fam.titleTemplate.replace("{location}", loc.name);
      const d = fam.descriptionTemplate.replace("{location}", loc.name);
      const title = `${t} | ${BRAND}`;
      const description = baseDesc(d);
      const url = absUrl(path);
      return {
        kind: "family",
        title,
        description,
        canonical: path,
        og: { type: "article", url, title, description, image: DEFAULT_OG_IMAGE },
        twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
        jsonLd: [localBusinessLd([HQ, loc.name]), serviceLd(t, loc.name, url)],
      };
    }
  }

  // near-me: /:variant/:loc (only when variant exists)
  {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 2) {
      const v = nearMeBySlug.get(parts[0]);
      const loc = locationBySlug.get(parts[1]);
      if (v && loc) {
        const title = `${v.titleTemplate.replace("{location}", loc.name)} | ${BRAND}`;
        const description = baseDesc(v.descriptionTemplate.replace("{location}", loc.name));
        const url = absUrl(path);
        return {
          kind: "nearMe",
          title,
          description,
          canonical: path,
          og: { type: "article", url, title, description, image: DEFAULT_OG_IMAGE },
          twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
          jsonLd: [localBusinessLd([HQ, loc.name])],
        };
      }
    }
  }

  // spoke /:service-:location
  {
    const m = path.match(/^\/([a-z0-9-]+)-([a-z0-9-]+)$/i);
    if (m) {
      const svc = serviceBySlug.get(m[1]);
      const loc = locationBySlug.get(m[2]);
      if (svc && loc) {
        const title = `${svc.name} in ${loc.name} | ${BRAND}`;
        const description = baseDesc(`${svc.quickSummary} Options-based quotes, photo-proof closeout, and fast scheduling in ${loc.name}.`);
        const url = absUrl(path);
        return {
          kind: "spoke",
          title,
          description,
          canonical: path,
          og: { type: "article", url, title, description, image: DEFAULT_OG_IMAGE },
          twitter: { card: "summary_large_image", title, description, image: DEFAULT_OG_IMAGE },
          jsonLd: [
            localBusinessLd([HQ, loc.name]),
            serviceLd(`${svc.name} in ${loc.name}`, loc.name, url),
            breadcrumbLd([
              { name: "Home", item: absUrl("/") },
              { name: "Services", item: absUrl("/services") },
              { name: svc.name, item: absUrl(`/services/${svc.slug}`) },
              { name: loc.name, item: url },
            ]),
          ],
        };
      }
    }
  }

  // Not found
  const nfTitle = `Not Found | ${BRAND}`;
  const nfDesc = baseDesc("This page does not exist.");
  return {
    kind: "notFound",
    title: nfTitle,
    description: nfDesc,
    canonical: path,
    og: { type: "website", url: absUrl(path), title: nfTitle, description: nfDesc, image: DEFAULT_OG_IMAGE },
    twitter: { card: "summary", title: nfTitle, description: nfDesc, image: DEFAULT_OG_IMAGE },
    jsonLd: [localBusinessLd([HQ, "Charlotte, NC"])],
  };
}
