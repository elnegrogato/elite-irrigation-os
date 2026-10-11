// src/lib/indexMaps.ts
import { services, Service } from "../../data/services";
import { locationsFull, Location } from "../../data/locations_full";
import { problems, Problem } from "../../data/problems";
import { brands, Brand } from "../../data/brands";

export const serviceBySlug = new Map<string, Service>(services.map(s => [s.slug, s]));
export const locationBySlug = new Map<string, Location>(locationsFull.map(l => [l.slug, l]));
export const problemBySlug = new Map<string, Problem>(problems.map(p => [p.slug, p]));
export const brandBySlug = new Map<string, Brand>(brands.map(b => [b.slug, b]));
