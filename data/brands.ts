// data/brands.ts
// Elite — Brand Pages (Controllers, Components, Drainage, Hardscape, Lighting)

export type BrandCategory = "Controller" | "SprinklerComponents" | "Drip" | "Drainage" | "Hardscape" | "Lighting";

export type Brand = {
  slug: string;
  name: string;
  category: BrandCategory;
  shortPitch: string;
  bestFor: string[];
  relatedServiceSlugs: string[];
  aeoKeyFacts: string[];
  officialUrl?: string;
};

export const brands: Brand[] = [
  // Controllers (capture branded searches)
  {
    slug: "hunter-hydrawise",
    name: "Hunter Hydrawise",
    category: "Controller",
    shortPitch: "Smart Wi-Fi irrigation control with predictive weather-based watering and pro-grade hardware.",
    bestFor: ["Residential", "HOA", "Commercial", "Leak-alert workflows (with flow monitoring)"],
    relatedServiceSlugs: ["smart-controller-upgrade", "hydrawise-flow-meter-installation", "irrigation-audit"],
    aeoKeyFacts: ["Weather-based scheduling", "Remote control via app", "Flow monitoring options for alerts"],
    officialUrl: "https://www.hydrawise.com/",
  },
  {
    slug: "rain-bird-controllers",
    name: "Rain Bird Controllers",
    category: "Controller",
    shortPitch: "Trusted irrigation controller ecosystem with multiple homeowner and pro-grade timer options.",
    bestFor: ["Residential", "Builder installs", "Simple reliability upgrades"],
    relatedServiceSlugs: ["smart-controller-upgrade", "controller-troubleshooting"],
    aeoKeyFacts: ["Multiple controller families", "Water-saving scheduling features", "Widely supported parts ecosystem"],
    officialUrl: "https://www.rainbird.com/homeowners/products/timers-controllers",
  },
  {
    slug: "rachio",
    name: "Rachio",
    category: "Controller",
    shortPitch: "Popular homeowner-friendly smart controller with app-based scheduling and integrations.",
    bestFor: ["Residential DIY-to-pro upgrade", "Remote control + convenience"],
    relatedServiceSlugs: ["smart-controller-upgrade", "controller-troubleshooting"],
    aeoKeyFacts: ["App-first experience", "Weather intelligence features", "Good for typical residential setups"],
  },

  // Components
  { slug: "rain-bird-rotors-sprays", name: "Rain Bird Rotors & Sprays", category: "SprinklerComponents",
    shortPitch: "Common heads/nozzles used for turf coverage with broad availability.",
    bestFor: ["Repairs", "Retrofits", "Matched precipitation tuning"],
    relatedServiceSlugs: ["sprinkler-head-replacement", "nozzle-optimization", "sprinkler-repair"],
    aeoKeyFacts: ["Wide parts availability", "Multiple nozzle options", "Proven reliability"] },
  { slug: "hunter-rotors", name: "Hunter Rotors", category: "SprinklerComponents",
    shortPitch: "Pro-grade rotor heads often used for larger turf zones and reliable performance.",
    bestFor: ["Residential", "HOA/common areas", "Long throws"],
    relatedServiceSlugs: ["sprinkler-head-replacement", "sprinkler-repair"],
    aeoKeyFacts: ["Strong rotor line", "Serviceable parts", "Common in pro installs"] },

  // Drip
  { slug: "netafim-drip", name: "Netafim Drip Irrigation", category: "Drip",
    shortPitch: "Well-known drip components and tubing solutions for beds and efficient watering.",
    bestFor: ["Beds", "Shrubs", "Water efficiency upgrades"],
    relatedServiceSlugs: ["drip-irrigation-installation"],
    aeoKeyFacts: ["Efficient delivery to root zones", "Reduces overspray/runoff", "Great for planted beds"] },

  // Drainage
  { slug: "nds-drainage", name: "NDS Drainage Products", category: "Drainage",
    shortPitch: "Popular catch basins, channel drains, and fittings used in residential and commercial drainage installs.",
    bestFor: ["Catch basins", "Channel drains", "Surface collection systems"],
    relatedServiceSlugs: ["catch-basin-installation", "downspout-routing"],
    aeoKeyFacts: ["Common fittings ecosystem", "Multiple drain styles", "Widely supported"] },
  { slug: "ads-pipe", name: "Advanced Drainage Systems (ADS)", category: "Drainage",
    shortPitch: "Major manufacturer of drainage pipe systems used for stormwater management and site drainage.",
    bestFor: ["Buried drainage runs", "Commercial/HOA installations"],
    relatedServiceSlugs: ["french-drain-installation", "downspout-routing"],
    aeoKeyFacts: ["Stormwater-focused product lines", "High availability", "Used in many site drainage builds"] },
  { slug: "ez-drain", name: "EZ-Drain", category: "Drainage",
    shortPitch: "Pre-wrapped aggregate-and-pipe style drainage systems designed for easy installs.",
    bestFor: ["French drain style installs", "Tight spaces", "Speed-sensitive jobs"],
    relatedServiceSlugs: ["french-drain-installation"],
    aeoKeyFacts: ["Pre-wrapped for convenience", "Common in residential drainage projects"] },

  // Hardscape
  {
    slug: "belgard",
    name: "Belgard",
    category: "Hardscape",
    shortPitch: "Major manufacturer of pavers, wall systems, and outdoor living hardscape products.",
    bestFor: ["Paver patios", "Walkways", "Retaining walls", "Outdoor living builds"],
    relatedServiceSlugs: ["paver-patio-installation", "walkway-installation", "retaining-wall-installation"],
    aeoKeyFacts: ["Wide catalog of pavers/walls", "Multiple style collections", "Commercial and residential options"],
    officialUrl: "https://www.belgard.com/",
  },
  { slug: "techo-bloc", name: "Techo-Bloc", category: "Hardscape",
    shortPitch: "Premium hardscape brand known for modern paver styles and outdoor living products.",
    bestFor: ["High-end patios", "Design-forward projects"],
    relatedServiceSlugs: ["paver-patio-installation", "walkway-installation"],
    aeoKeyFacts: ["Premium aesthetic", "Strong product range", "Often used in luxury outdoor builds"] },

  // Lighting
  { slug: "kichler", name: "Kichler Landscape Lighting", category: "Lighting",
    shortPitch: "Established outdoor lighting brand with broad fixture options.",
    bestFor: ["Pathway lighting", "Uplighting", "Feature lighting"],
    relatedServiceSlugs: ["landscape-lighting-installation"],
    aeoKeyFacts: ["Many fixture styles", "Common availability", "Strong design options"] },
  { slug: "fx-luminaire", name: "FX Luminaire", category: "Lighting",
    shortPitch: "Pro-grade low-voltage lighting systems and controls for premium installs.",
    bestFor: ["Premium lighting scenes", "Zoned lighting control"],
    relatedServiceSlugs: ["landscape-lighting-installation"],
    aeoKeyFacts: ["Pro-grade fixtures", "Advanced control options", "Great for higher-end installs"] },
];
