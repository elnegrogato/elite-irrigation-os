// src/lib/linkGraph.ts
import { services } from "../../data/services";
import { problems } from "../../data/problems";
import { brands } from "../../data/brands";
import { locationsFull } from "../../data/locations_full";

export type LinkRef = { title: string; path: string; kind: "town" | "service" | "problem" | "brand" | "nearMe" };

export function getLocationBySlug(slug: string) {
  return locationsFull.find(l => l.slug === slug);
}

export function getServiceBySlug(slug: string) {
  return services.find(s => s.slug === slug);
}

export function getLinksForSpoke(serviceSlug: string, locationSlug: string) {
  const loc = getLocationBySlug(locationSlug);
  const svc = getServiceBySlug(serviceSlug);

  if (!loc || !svc) return { neighbors: [] as LinkRef[], related: [] as LinkRef[], problems: [] as LinkRef[], brands: [] as LinkRef[] };

  // Neighbor towns (limit 6)
  const neighborRefs: LinkRef[] = (loc.neighbors ?? [])
    .map(ns => getLocationBySlug(ns))
    .filter(Boolean)
    .slice(0, 6)
    .map(n => ({
      title: `Serving ${n!.name}`,
      path: `/areas/${n!.slug}`,
      kind: "town",
    }));

  // Related services: upsells first, then same category
  const upsell = (svc.upsellSlugs ?? [])
    .map(us => getServiceBySlug(us))
    .filter(Boolean)
    .map(s => ({ title: `${s!.name} in ${loc.name}`, path: `/${s!.slug}-${loc.slug}`, kind: "service" as const }));

  const sameCategory = services
    .filter(s => s.category === svc.category && s.slug !== svc.slug)
    .slice(0, Math.max(0, 8 - upsell.length))
    .map(s => ({ title: `${s.name} in ${loc.name}`, path: `/${s.slug}-${loc.slug}`, kind: "service" as const }));

  // Problems that recommend this service
  const prob = problems
    .filter(p => p.recommendedServiceSlugs.includes(serviceSlug))
    .slice(0, 6)
    .map(p => ({ title: `${p.title} in ${loc.name}`, path: `/problems/${p.slug}/${loc.slug}`, kind: "problem" as const }));

  // Brands related by service slugs
  const brandRefs = brands
    .filter(b => b.relatedServiceSlugs.includes(serviceSlug))
    .slice(0, 6)
    .map(b => ({ title: `${b.name} in ${loc.name}`, path: `/brands/${b.slug}/${loc.slug}`, kind: "brand" as const }));

  return { neighbors: neighborRefs, related: [...upsell, ...sameCategory], problems: prob, brands: brandRefs };
}