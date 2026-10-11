// data/nearMeVariants.ts
// Elite — "Near Me" Variations (programmatic pages)
// Routes example:
// /irrigation-repair-near-me/:locationSlug
// /drainage-contractor-near-me/:locationSlug

export type NearMeVariant = {
  slug: string;
  titleTemplate: string; // e.g. "Sprinkler Repair Near Me in {location}"
  descriptionTemplate: string;
  intent: "near_me" | "emergency" | "best" | "licensed" | "same_day" | "local";
};

export const nearMeVariants: NearMeVariant[] = [
  {
    slug: "sprinkler-repair-near-me",
    titleTemplate: "Sprinkler Repair Near Me in {location}",
    descriptionTemplate:
      "Fast sprinkler repair in {location}. Same-week scheduling, photo-proof work, and clear pricing options.",
    intent: "near_me",
  },
  {
    slug: "irrigation-repair-near-me",
    titleTemplate: "Irrigation Repair Near Me in {location}",
    descriptionTemplate:
      "Irrigation diagnostics and repairs in {location}—valves, heads, wiring, controllers, leaks, and coverage tuning.",
    intent: "near_me",
  },
  {
    slug: "drainage-contractor-near-me",
    titleTemplate: "Drainage Contractor Near Me in {location}",
    descriptionTemplate:
      "Solve standing water and flooding issues in {location} with practical drainage plans and proven installs.",
    intent: "near_me",
  },
  {
    slug: "french-drain-near-me",
    titleTemplate: "French Drain Installation Near Me in {location}",
    descriptionTemplate:
      "French drain design and installation in {location} with correct slope, materials, and outlet protection.",
    intent: "near_me",
  },
  {
    slug: "paver-patio-near-me",
    titleTemplate: "Paver Patio Contractor Near Me in {location}",
    descriptionTemplate:
      "Beautiful paver patios in {location}—engineered base prep, clean edges, drainage-conscious builds.",
    intent: "near_me",
  },
  {
    slug: "landscape-lighting-near-me",
    titleTemplate: "Landscape Lighting Near Me in {location}",
    descriptionTemplate:
      "Low-voltage landscape lighting installs in {location}—path lights, uplights, steps, and outdoor scenes.",
    intent: "near_me",
  },
  {
    slug: "same-day-sprinkler-repair",
    titleTemplate: "Same-Day Sprinkler Repair in {location}",
    descriptionTemplate:
      "Need it fixed fast? Priority sprinkler repairs in {location} for leaks, stuck zones, and broken heads.",
    intent: "same_day",
  },
  {
    slug: "best-irrigation-company",
    titleTemplate: "Best Irrigation Company in {location}",
    descriptionTemplate:
      "Elite is built for reliability: diagnostics, water-savings tuning, and evidence-grade documentation in {location}.",
    intent: "best",
  },
];