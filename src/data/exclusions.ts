// src/data/exclusions.ts
// Elite — generation exclusions & coverage rules

import type { Service } from "./services";
import type { Location } from "../../data/locations_full";

export type CoverageMode = "full" | "limited" | "projects_only";

export type ExclusionReason =
  | "OUT_OF_COVERAGE"
  | "PROJECTS_ONLY"
  | "SERVICE_NOT_OFFERED_IN_RING"
  | "SERVICE_NOT_OFFERED_IN_STATE"
  | "MANUAL_BLACKLIST";

export type ExclusionResult =
  | { allowed: true; coverageMode: CoverageMode }
  | { allowed: false; coverageMode: CoverageMode; reason: ExclusionReason; detail?: string };

export type ExclusionPolicy = {
  // Set your real boundaries here
  allowedStates: Array<Location["state"]>;
  maxRingForEmergency: number;
  // Hard constraints per service category
  categoryMaxRing: Partial<Record<Service["category"], number>>;
  categoryAllowedStates?: Partial<Record<Service["category"], Array<Location["state"]>>>;
  // Manual blacklist (optional)
  blacklist: Array<{ serviceSlug: string; locationSlug: string; reason?: string }>;
};

export const exclusionPolicy: ExclusionPolicy = {
  allowedStates: ["NC", "SC"], // keep tight; add GA/TN/VA when actually serving
  maxRingForEmergency: 1, // emergency only in metro/core
  categoryMaxRing: {
    Irrigation: 3,
    Drainage: 3,
    Grading: 2,
    Landscaping: 3,
    Turf: 3,
    Seasonal: 3,
    Lighting: 2,
    Hardscape: 2,
    OutdoorLiving: 2,
    HOA: 3,
    Commercial: 3,
    Builder: 3,
    Design: 4,
  },
  categoryAllowedStates: {
    Hardscape: ["NC", "SC"],
    Drainage: ["NC", "SC"],
    Irrigation: ["NC", "SC"],
  },
  blacklist: [
    // example:
    // { serviceSlug: "paver-patio-installation", locationSlug: "charleston", reason: "projects-only region" }
  ],
};

export function resolveCoverageMode(loc: Location): CoverageMode {
  if (loc.tags?.includes("projects-only")) return "projects_only";
  if (loc.ring >= 4) return "projects_only";
  return "full";
}

export function allowSpoke(service: Service, loc: Location): ExclusionResult {
  const coverageMode = resolveCoverageMode(loc);

  // Hard coverage state gate
  if (!exclusionPolicy.allowedStates.includes(loc.state)) {
    return { allowed: false, coverageMode, reason: "OUT_OF_COVERAGE", detail: `State ${loc.state} not enabled` };
  }

  // Manual blacklist
  const hit = exclusionPolicy.blacklist.find(b => b.serviceSlug === service.slug && b.locationSlug === loc.slug);
  if (hit) {
    return { allowed: false, coverageMode, reason: "MANUAL_BLACKLIST", detail: hit.reason };
  }

  // Category state constraints
  const allowedStatesForCat = exclusionPolicy.categoryAllowedStates?.[service.category];
  if (allowedStatesForCat && !allowedStatesForCat.includes(loc.state)) {
    return { allowed: false, coverageMode, reason: "SERVICE_NOT_OFFERED_IN_STATE", detail: service.category };
  }

  // Ring constraints by category
  const maxRing = exclusionPolicy.categoryMaxRing[service.category];
  if (typeof maxRing === "number" && loc.ring > maxRing) {
    return { allowed: false, coverageMode, reason: "SERVICE_NOT_OFFERED_IN_RING", detail: `max ring ${maxRing}` };
  }

  // Emergency constraints
  if (service.isEmergencyCapable && loc.ring > exclusionPolicy.maxRingForEmergency) {
    return { allowed: false, coverageMode, reason: "SERVICE_NOT_OFFERED_IN_RING", detail: "emergency only in core/metro" };
  }

  // Projects-only: allow only design pages, assessments, bids, or high-ticket installs if you want
  if (coverageMode === "projects_only") {
    const okIntents = new Set(["design", "contract", "install"]);
    const hasOk = service.intents.some(i => okIntents.has(i));
    if (!hasOk) {
      return { allowed: false, coverageMode, reason: "PROJECTS_ONLY", detail: "projects-only territory" };
    }
  }

  return { allowed: true, coverageMode };
}
