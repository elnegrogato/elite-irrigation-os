// data/locations.ts
// Elite — Service Area Locations
//
// Starter set: dense Charlotte metro + regional anchors within ~200 miles.

export type ServiceRing = 0 | 1 | 2 | 3 | 4;

export type Location = {
  slug: string;
  name: string;
  state: "NC" | "SC" | "GA" | "TN" | "VA";
  ring: ServiceRing;
  countyHint?: string;
  tags?: string[]; // "charlotte-neighborhood", "lake", "college-town", "hoas", "builder-heavy"
  neighbors?: string[]; // internal linking suggestions (slugs)
};

export const homeBase = {
  slug: "harrisburg",
  name: "Harrisburg",
  state: "NC" as const,
  ring: 0 as const,
};

export const locations: Location[] = [
  // Ring 0 (0–25mi): Cabarrus/Meck edge + NE Charlotte
  { slug: "harrisburg", name: "Harrisburg", state: "NC", ring: 0, countyHint: "Cabarrus", tags: ["home-base"], neighbors: ["concord", "charlotte", "mint-hill"] },
  { slug: "concord", name: "Concord", state: "NC", ring: 0, countyHint: "Cabarrus", tags: ["hoas", "builder-heavy"], neighbors: ["harrisburg", "kannapolis", "charlotte"] },
  { slug: "kannapolis", name: "Kannapolis", state: "NC", ring: 0, countyHint: "Cabarrus/Rowan", neighbors: ["concord", "salisbury"] },
  { slug: "charlotte", name: "Charlotte", state: "NC", ring: 0, countyHint: "Mecklenburg", tags: ["metro-core"], neighbors: ["harrisburg", "matthews", "mint-hill", "huntersville", "pineville"] },
  { slug: "mint-hill", name: "Mint Hill", state: "NC", ring: 0, countyHint: "Mecklenburg", neighbors: ["charlotte", "matthews"] },
  { slug: "matthews", name: "Matthews", state: "NC", ring: 0, countyHint: "Mecklenburg", neighbors: ["charlotte", "mint-hill", "stallings"] },
  { slug: "pineville", name: "Pineville", state: "NC", ring: 0, countyHint: "Mecklenburg", neighbors: ["charlotte", "ballantyne"] },

  // Charlotte neighborhoods (treat as locations for hyperlocal pages)
  { slug: "ballantyne", name: "Ballantyne", state: "NC", ring: 0, tags: ["charlotte-neighborhood", "hoas"], neighbors: ["pineville", "waxhaw"] },
  { slug: "south-park", name: "SouthPark", state: "NC", ring: 0, tags: ["charlotte-neighborhood"], neighbors: ["charlotte"] },
  { slug: "dilworth", name: "Dilworth", state: "NC", ring: 0, tags: ["charlotte-neighborhood"], neighbors: ["charlotte"] },
  { slug: "plaza-midwood", name: "Plaza Midwood", state: "NC", ring: 0, tags: ["charlotte-neighborhood"], neighbors: ["charlotte"] },
  { slug: "noda", name: "NoDa", state: "NC", ring: 0, tags: ["charlotte-neighborhood"], neighbors: ["charlotte"] },
  { slug: "southend", name: "South End", state: "NC", ring: 0, tags: ["charlotte-neighborhood"], neighbors: ["charlotte"] },
  { slug: "university-city", name: "University City", state: "NC", ring: 0, tags: ["charlotte-neighborhood", "multifamily"], neighbors: ["charlotte", "huntersville"] },

  // Ring 1 (25–60mi): lake + suburbs + SC edge
  { slug: "huntersville", name: "Huntersville", state: "NC", ring: 1, countyHint: "Mecklenburg", tags: ["lake", "hoas"], neighbors: ["cornelius", "mooresville", "charlotte"] },
  { slug: "cornelius", name: "Cornelius", state: "NC", ring: 1, countyHint: "Mecklenburg", tags: ["lake"], neighbors: ["huntersville", "davidson"] },
  { slug: "davidson", name: "Davidson", state: "NC", ring: 1, countyHint: "Mecklenburg", tags: ["college-town", "lake"], neighbors: ["cornelius", "mooresville"] },
  { slug: "mooresville", name: "Mooresville", state: "NC", ring: 1, countyHint: "Iredell", tags: ["lake", "builder-heavy"], neighbors: ["huntersville", "statesville"] },
  { slug: "gastonia", name: "Gastonia", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["belmont", "charlotte"] },
  { slug: "belmont", name: "Belmont", state: "NC", ring: 1, countyHint: "Gaston", tags: ["hoas"], neighbors: ["gastonia", "charlotte"] },
  { slug: "fort-mill", name: "Fort Mill", state: "SC", ring: 1, countyHint: "York", tags: ["hoas", "metro-suburb"], neighbors: ["rock-hill", "charlotte"] },
  { slug: "rock-hill", name: "Rock Hill", state: "SC", ring: 1, countyHint: "York", neighbors: ["fort-mill", "charlotte"] },
  { slug: "waxhaw", name: "Waxhaw", state: "NC", ring: 1, countyHint: "Union", tags: ["luxury", "builder-heavy"], neighbors: ["weddington", "monroe"] },
  { slug: "weddington", name: "Weddington", state: "NC", ring: 1, countyHint: "Union", tags: ["luxury"], neighbors: ["waxhaw", "matthews"] },
  { slug: "monroe", name: "Monroe", state: "NC", ring: 1, countyHint: "Union", neighbors: ["waxhaw", "indian-trail"] },
  { slug: "indian-trail", name: "Indian Trail", state: "NC", ring: 1, countyHint: "Union", tags: ["hoas"], neighbors: ["monroe", "matthews"] },
  { slug: "stallings", name: "Stallings", state: "NC", ring: 1, countyHint: "Union", neighbors: ["matthews", "indian-trail"] },

  // Ring 2 (60–110mi): bigger NC/SC metros
  { slug: "greensboro", name: "Greensboro", state: "NC", ring: 2, countyHint: "Guilford", tags: ["metro"], neighbors: ["winston-salem", "high-point"] },
  { slug: "winston-salem", name: "Winston-Salem", state: "NC", ring: 2, countyHint: "Forsyth", tags: ["metro"], neighbors: ["greensboro"] },
  { slug: "high-point", name: "High Point", state: "NC", ring: 2, countyHint: "Guilford", neighbors: ["greensboro"] },
  { slug: "columbia", name: "Columbia", state: "SC", ring: 2, countyHint: "Richland", tags: ["metro"], neighbors: ["lexington-sc"] },
  { slug: "lexington-sc", name: "Lexington", state: "SC", ring: 2, countyHint: "Lexington", neighbors: ["columbia"] },
  { slug: "fayetteville", name: "Fayetteville", state: "NC", ring: 2, tags: ["metro"], neighbors: [] },
  { slug: "asheville", name: "Asheville", state: "NC", ring: 2, tags: ["mountains"], neighbors: ["hendersonville"] },
  { slug: "hendersonville", name: "Hendersonville", state: "NC", ring: 2, tags: ["mountains"], neighbors: ["asheville"] },

  // Ring 3 (110–160mi): Triangle + coastal edge anchors + Augusta
  { slug: "raleigh", name: "Raleigh", state: "NC", ring: 3, tags: ["metro"], neighbors: ["durham", "cary"] },
  { slug: "durham", name: "Durham", state: "NC", ring: 3, tags: ["metro"], neighbors: ["raleigh", "cary"] },
  { slug: "cary", name: "Cary", state: "NC", ring: 3, tags: ["metro-suburb"], neighbors: ["raleigh", "durham"] },
  { slug: "augusta", name: "Augusta", state: "GA", ring: 3, tags: ["metro"], neighbors: [] },
  { slug: "wilmington", name: "Wilmington", state: "NC", ring: 3, tags: ["coastal"], neighbors: [] },

  // Ring 4 (160–200mi): Charleston/other edges (projects-only)
  { slug: "charleston", name: "Charleston", state: "SC", ring: 4, tags: ["coastal", "projects-only"], neighbors: [] },
  { slug: "knoxville", name: "Knoxville", state: "TN", ring: 4, tags: ["projects-only"], neighbors: [] },
];

export const locationsByRing = locations.reduce<Record<string, Location[]>>((acc, loc) => {
  acc[String(loc.ring)] ||= [];
  acc[String(loc.ring)].push(loc);
  return acc;
}, {});
