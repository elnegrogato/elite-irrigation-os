// src/data/pageFamilies.ts
import type { Location } from "../../data/locations_full";

export type Family = {
  slug: string;
  titleTemplate: string;       // "HOA Irrigation Maintenance in {location}"
  descriptionTemplate: string; // safe text
  route: (locationSlug: string) => string; // build path
  minRing?: number;
  maxRing?: number;
  states?: Array<Location["state"]>;
  tags?: string[];
};

export const pageFamilies: Family[] = [
  {
    slug: "hoa-irrigation-maintenance",
    titleTemplate: "HOA Irrigation Maintenance in {location}",
    descriptionTemplate: "Board-ready irrigation service: SLAs, approvals, photo documentation, and predictable scheduling in {location}.",
    route: (loc) => `/f/hoa-irrigation-maintenance/${loc}`,
    maxRing: 3,
    states: ["NC", "SC"],
    tags: ["b2b", "hoa"],
  },
  {
    slug: "commercial-grounds-irrigation",
    titleTemplate: "Commercial Grounds & Irrigation in {location}",
    descriptionTemplate: "Facilities-ready exterior operations: irrigation, drainage remediation, and documented work orders in {location}.",
    route: (loc) => `/f/commercial-grounds-irrigation/${loc}`,
    maxRing: 3,
    states: ["NC", "SC"],
    tags: ["b2b", "commercial"],
  },
  {
    slug: "storm-drainage-response",
    titleTemplate: "Storm Drainage Response in {location}",
    descriptionTemplate: "Rapid drainage triage after heavy rain: assessments, routing, and stabilization options in {location}.",
    route: (loc) => `/f/storm-drainage-response/${loc}`,
    maxRing: 2,
    states: ["NC", "SC"],
    tags: ["seasonal", "storm"],
  },
];
