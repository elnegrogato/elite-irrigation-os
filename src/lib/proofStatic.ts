// src/lib/proofStatic.ts
import { locationsFull } from "../../data/locations_full";

const staticData: any[] = [];

export function getCaseStudiesStaticForSpoke(serviceSlug: string, locationSlug: string, limit = 2) {
  const direct = staticData
    .filter((x: any) => x.publish && x.serviceSlug === serviceSlug && x.locationSlug === locationSlug)
    .slice(0, limit);

  if (direct.length) return direct;

  const loc = locationsFull.find(l => l.slug === locationSlug);
  const neighbors = (loc?.neighbors ?? []).slice(0, 8);

  const neighborHits = staticData
    .filter((x: any) => x.publish && x.serviceSlug === serviceSlug && neighbors.includes(x.locationSlug))
    .slice(0, limit);

  return neighborHits;
}

export function getRecentCaseStudiesStatic(limit = 30) {
  return staticData.filter((x: any) => x.publish).slice(0, limit);
}

export function getCaseStudyByIdStatic(id: string) {
  return staticData.find((x: any) => String(x._id) === id || String(x.id) === id) ?? null;
}

export function getCaseStudiesByServiceStatic(serviceSlug: string, limit = 50) {
  return staticData.filter((x: any) => x.publish && x.serviceSlug === serviceSlug).slice(0, limit);
}
