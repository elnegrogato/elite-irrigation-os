// data/services.ts
// Elite Irrigation & Landscaping — Service Taxonomy
// Simple, direct language for NC homeowners.

export type ServiceCategory =
  | "Irrigation"
  | "Grading"
  | "Drainage"
  | "Landscaping"
  | "Turf"
  | "Hardscape"
  | "OutdoorLiving"
  | "Lighting"
  | "Seasonal"
  | "Maintenance"
  | "TreeBrush"
  | "Commercial"
  | "HOA"
  | "Builder"
  | "Design";

export type ServicePackTier = "Basic" | "Performance" | "Premium" | "Luxury";

export type ServiceUnit = "job" | "hour" | "zone" | "head" | "linear_ft" | "sq_ft" | "cubic_yd" | "fixture" | "controller" | "visit" | "acre" | "tree";

export type Service = {
  slug: string;
  name: string;
  category: ServiceCategory;
  subcategory: string;
  keywords: string[];
  intents: Array<"repair" | "install" | "upgrade" | "maintenance" | "emergency" | "inspection" | "design" | "contract">;
  seasonality?: Array<"spring" | "summer" | "fall" | "winter" | "storm">;
  isEmergencyCapable?: boolean;
  units: ServiceUnit[];
  quickSummary: string;
  whatWeDoBullets: string[];
  pricingBand?: { min: number; max: number; unit: ServiceUnit; notes?: string };
  packs?: Array<{
    tier: ServicePackTier;
    promise: string;
    includes: string[];
    excludes?: string[];
    typicalRange?: { min: number; max: number; unit: ServiceUnit };
  }>;
  upsellSlugs?: string[];
  proofChecklist?: string[];
  complianceNotes?: string[];
  b2bFit?: Array<"Residential" | "HOA" | "Multifamily" | "Commercial" | "Builder" | "Municipal">;
};

const proofBase = [
  "Photos before we start",
  "Photos after we finish",
  "Notes on what we fixed",
  "List of parts used",
  "Video of it working (if needed)",
];

export const services: Service[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // IRRIGATION — Repairs / Diagnostics
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "sprinkler-repair",
    name: "Sprinkler Repair",
    category: "Irrigation",
    subcategory: "Repair",
    keywords: ["sprinkler repair", "irrigation repair", "fix sprinkler", "sprinklers not working"],
    intents: ["repair", "inspection", "emergency"],
    seasonality: ["spring", "summer", "fall"],
    isEmergencyCapable: true,
    units: ["job", "hour"],
    quickSummary: "We find leaks, fix broken heads, and get your system running right so your grass stays green.",
    whatWeDoBullets: [
      "Turn on each zone to find the problem",
      "Fix leaks and replace broken parts",
      "Adjust heads so they spray the grass, not the driveway",
      "Check your timer settings",
    ],
    packs: [
      {
        tier: "Basic",
        promise: "Fix the main problem.",
        includes: ["System test", "Replace broken heads", "Basic adjustments"],
        typicalRange: { min: 175, max: 450, unit: "job" },
      },
      {
        tier: "Performance",
        promise: "Fix it plus tune it up.",
        includes: ["Everything in Basic", "Adjust all heads for better coverage", "Check water pressure"],
        typicalRange: { min: 350, max: 850, unit: "job" },
      },
    ],
    upsellSlugs: ["irrigation-audit", "smart-controller-upgrade"],
    proofChecklist: [...proofBase, "Photo of timer settings"],
    complianceNotes: ["We call 811 before digging deep trenches."],
    b2bFit: ["Residential", "HOA", "Commercial"],
  },
  {
    slug: "sprinkler-head-replacement",
    name: "Replace Sprinkler Heads",
    category: "Irrigation",
    subcategory: "Repair",
    keywords: ["sprinkler head replacement", "broken sprinkler head", "replace lawn sprinkler"],
    intents: ["repair", "maintenance"],
    seasonality: ["spring", "summer", "fall"],
    units: ["head", "job"],
    quickSummary: "We replace broken or leaking sprinkler heads with new, durable ones.",
    whatWeDoBullets: [
      "Dig out the old broken head",
      "Install a matching new head",
      "Adjust the spray pattern",
      "Make sure it sits level with the ground",
    ],
    pricingBand: { min: 35, max: 125, unit: "head", notes: "plus service call fee" },
    upsellSlugs: ["nozzle-optimization", "sprinkler-repair"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA", "Commercial"],
  },
  {
    slug: "irrigation-leak-detection",
    name: "Find & Fix Water Leaks",
    category: "Irrigation",
    subcategory: "Diagnostics",
    keywords: ["sprinkler leak", "water pooling in yard", "high water bill", "find irrigation leak"],
    intents: ["inspection", "repair", "emergency"],
    seasonality: ["spring", "summer", "fall"],
    isEmergencyCapable: true,
    units: ["job", "hour"],
    quickSummary: "Got a high water bill or a wet spot in the yard? We find the leak and stop the waste.",
    whatWeDoBullets: [
      "Test pressure to find the leak",
      "Dig carefully to expose the pipe",
      "Repair the break",
      "Fill the hole and clean up",
    ],
    packs: [
      {
        tier: "Basic",
        promise: "Find and cap the leak.",
        includes: ["Leak search", "Dig and repair", "Test"],
      },
    ],
    upsellSlugs: ["smart-controller-upgrade", "hydrawise-flow-meter-installation"],
    proofChecklist: [...proofBase, "Photo of the leak"],
    complianceNotes: ["We call 811 before digging."],
    b2bFit: ["Residential", "HOA", "Commercial"],
  },
  {
    slug: "irrigation-valve-repair",
    name: "Sprinkler Valve Repair",
    category: "Irrigation",
    subcategory: "Valves",
    keywords: ["sprinkler valve repair", "sprinklers wont turn off", "zone stuck on"],
    intents: ["repair", "emergency"],
    seasonality: ["spring", "summer", "fall"],
    isEmergencyCapable: true,
    units: ["job", "hour"],
    quickSummary: "If a zone won't turn on (or won't turn off), it's usually a valve. We fix or replace them.",
    whatWeDoBullets: [
      "Locate the valve box",
      "Check the wiring and parts",
      "Rebuild or replace the valve",
      "Test to make sure it opens and closes correctly",
    ],
    upsellSlugs: ["wire-tracing-irrigation"],
    proofChecklist: [...proofBase, "Photo of valve box"],
    b2bFit: ["Residential", "HOA", "Commercial"],
  },
  {
    slug: "controller-troubleshooting",
    name: "Timer / Controller Repair",
    category: "Irrigation",
    subcategory: "Electrical",
    keywords: ["sprinkler timer repair", "controller not working", "sprinkler box blank"],
    intents: ["repair", "inspection"],
    seasonality: ["spring", "summer", "fall"],
    units: ["job", "hour"],
    quickSummary: "Screen blank? Zones not running? We troubleshoot your sprinkler timer and wiring.",
    whatWeDoBullets: [
      "Check power and batteries",
      "Test wire connections",
      "Reprogram the schedule if needed",
      "Replace the unit if it's dead",
    ],
    upsellSlugs: ["smart-controller-upgrade"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA", "Commercial"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // IRRIGATION — Install / Upgrades
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "irrigation-system-installation",
    name: "New Sprinkler Installation",
    category: "Irrigation",
    subcategory: "Install",
    keywords: ["install sprinklers", "new irrigation system", "sprinkler system cost"],
    intents: ["install", "design"],
    seasonality: ["spring", "summer", "fall"],
    units: ["job", "zone"],
    quickSummary: "We install complete sprinkler systems so you never have to drag a hose again.",
    whatWeDoBullets: [
      "Plan where heads need to go",
      "Dig trenches and lay pipe",
      "Install valves and timer",
      "Show you how to use the app/timer",
    ],
    packs: [
      {
        tier: "Basic",
        promise: "Good coverage for the lawn.",
        includes: ["Lawn zones", "Standard timer", "Rain sensor"],
      },
      {
        tier: "Premium",
        promise: "Lawn + flower beds + Wi-Fi control.",
        includes: ["Lawn zones", "Drip lines for beds", "Wi-Fi controller", "Water saving nozzles"],
      },
    ],
    upsellSlugs: ["sod-installation", "landscaping"],
    proofChecklist: [...proofBase, "Map of zones"],
    complianceNotes: ["We handle 811 utility locates."],
    b2bFit: ["Residential", "HOA", "Commercial", "Builder"],
  },
  {
    slug: "smart-controller-upgrade",
    name: "Wi-Fi Sprinkler Timer Upgrade",
    category: "Irrigation",
    subcategory: "Smart Home",
    keywords: ["wifi sprinkler controller", "smart irrigation", "control sprinklers from phone"],
    intents: ["upgrade", "install"],
    seasonality: ["spring", "summer", "fall"],
    units: ["controller", "job"],
    quickSummary: "Control your sprinklers from your phone and stop watering when it rains.",
    whatWeDoBullets: [
      "Remove your old timer",
      "Install a new Wi-Fi controller",
      "Connect it to your phone",
      "Set up a water-saving schedule",
    ],
    upsellSlugs: ["irrigation-audit"],
    proofChecklist: [...proofBase, "Screenshot of app"],
    b2bFit: ["Residential", "HOA", "Commercial"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // DRAINAGE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "drainage-assessment",
    name: "Drainage Inspection",
    category: "Drainage",
    subcategory: "Inspection",
    keywords: ["yard drainage", "standing water", "wet yard", "drainage problem"],
    intents: ["inspection"],
    seasonality: ["spring", "summer", "fall", "storm"],
    units: ["job"],
    quickSummary: "We figure out why your yard is wet and give you a plan to fix it.",
    whatWeDoBullets: [
      "Walk the property to see where water pools",
      "Check your gutters and downspouts",
      "Measure slopes with a laser level",
      "Give you a quote for the fix",
    ],
    upsellSlugs: ["french-drain-installation", "downspout-routing"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA", "Commercial"],
  },
  {
    slug: "downspout-routing",
    name: "Bury Downspouts",
    category: "Drainage",
    subcategory: "Gutters",
    keywords: ["bury downspouts", "gutter drains", "pipe water away from house"],
    intents: ["install", "upgrade"],
    seasonality: ["spring", "summer", "fall"],
    units: ["job", "linear_ft"],
    quickSummary: "We pipe roof water away from your house so it doesn't flood your foundation.",
    whatWeDoBullets: [
      "Dig a trench from your gutter downspout",
      "Install solid pipe to move water away",
      "Put a pop-up emitter at the end",
      "Put the grass back",
    ],
    upsellSlugs: ["french-drain-installation"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA"],
  },
  {
    slug: "french-drain-installation",
    name: "French Drain Installation",
    category: "Drainage",
    subcategory: "Drains",
    keywords: ["french drain", "yard drain", "drying out wet yard"],
    intents: ["install"],
    seasonality: ["spring", "summer", "fall"],
    units: ["linear_ft", "job"],
    quickSummary: "A gravel-filled trench with a pipe that pulls water out of soggy ground.",
    whatWeDoBullets: [
      "Dig a trench through the wet area",
      "Line it with fabric and gravel",
      "Install a perforated pipe",
      "Cover it back up so it drains",
    ],
    upsellSlugs: ["grading-corrections"],
    proofChecklist: [...proofBase],
    complianceNotes: ["We call 811 before digging."],
    b2bFit: ["Residential", "HOA", "Commercial"],
  },
  {
    slug: "grading-corrections",
    name: "Yard Grading / Leveling",
    category: "Grading",
    subcategory: "Dirt Work",
    keywords: ["yard grading", "leveling yard", "slope away from house"],
    intents: ["install", "repair"],
    seasonality: ["spring", "summer", "fall"],
    units: ["job"],
    quickSummary: "We fix the slope of your yard so water runs away from your house, not towards it.",
    whatWeDoBullets: [
      "Bring in dirt to fill low spots",
      "Grade the soil to create a proper slope",
      "Spread seed or sod over the bare dirt",
    ],
    upsellSlugs: ["sod-installation", "drainage-assessment"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA", "Builder"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // HARDSCAPE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "paver-patio-installation",
    name: "Paver Patio Installation",
    category: "Hardscape",
    subcategory: "Patios",
    keywords: ["paver patio", "new patio", "backyard patio"],
    intents: ["install", "design"],
    seasonality: ["spring", "summer", "fall"],
    units: ["sq_ft", "job"],
    quickSummary: "We build beautiful stone or paver patios for grilling and hanging out.",
    whatWeDoBullets: [
      "Dig out the area and put in a gravel base",
      "Level the ground perfectly",
      "Lay the pavers in your chosen pattern",
      "Lock them in with sand so they stay put",
    ],
    upsellSlugs: ["landscape-lighting-installation", "walkway-installation"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA"],
  },
  {
    slug: "walkway-installation",
    name: "Walkway Installation",
    category: "Hardscape",
    subcategory: "Walkways",
    keywords: ["paver walkway", "stone path", "sidewalk"],
    intents: ["install"],
    seasonality: ["spring", "summer", "fall"],
    units: ["linear_ft", "job"],
    quickSummary: "A nice, solid path to your front door or backyard.",
    whatWeDoBullets: [
      "Mark out the path shape",
      "Install a solid base",
      "Lay pavers or stone",
      "Finish the edges",
    ],
    upsellSlugs: ["landscape-lighting-installation"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA", "Commercial"],
  },
  {
    slug: "hardscape-repair",
    name: "Patio Repair",
    category: "Hardscape",
    subcategory: "Repair",
    keywords: ["fix patio", "sunken pavers", "loose stones"],
    intents: ["repair"],
    seasonality: ["spring", "summer", "fall"],
    units: ["job"],
    quickSummary: "We fix uneven pavers, sunken spots, and loose stones to make your patio safe again.",
    whatWeDoBullets: [
      "Lift up the sunken pavers",
      "Add more base material and level it",
      "Put the pavers back",
      "Fill the joints with new sand",
    ],
    upsellSlugs: ["pressure-washing"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LIGHTING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "landscape-lighting-installation",
    name: "Outdoor Lighting",
    category: "Lighting",
    subcategory: "Install",
    keywords: ["outdoor lighting", "path lights", "landscape lights"],
    intents: ["install", "upgrade"],
    seasonality: ["spring", "summer", "fall"],
    units: ["fixture", "job"],
    quickSummary: "Make your home look great at night and safer to walk around.",
    whatWeDoBullets: [
      "Plan where lights should go",
      "Run low-voltage wire (safe and hidden)",
      "Install high-quality LED fixtures",
      "Set the timer so they come on automatically",
    ],
    upsellSlugs: ["paver-patio-installation"],
    proofChecklist: [...proofBase, "Photo at night"],
    b2bFit: ["Residential", "HOA"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LANDSCAPING
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "mulch-installation",
    name: "Mulch & Pine Straw",
    category: "Landscaping",
    subcategory: "Beds",
    keywords: ["mulch delivery", "pine straw install", "refresh flower beds"],
    intents: ["maintenance"],
    seasonality: ["spring", "fall"],
    units: ["cubic_yd", "job"],
    quickSummary: "Fresh mulch or pine straw to make your yard look clean and keep weeds down.",
    whatWeDoBullets: [
      "Clean out weeds and debris",
      "Edge the beds for a sharp look",
      "Spread fresh mulch or straw evenly",
      "Clean up the driveway and walks",
    ],
    upsellSlugs: ["planting-installation"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA", "Commercial"],
  },
  {
    slug: "sod-installation",
    name: "Sod Installation",
    category: "Turf",
    subcategory: "Install",
    keywords: ["new grass", "sod installation", "replace lawn"],
    intents: ["install"],
    seasonality: ["spring", "summer", "fall"],
    units: ["sq_ft", "job"],
    quickSummary: "Instant green grass. We scrape off the old weeds and lay down fresh sod.",
    whatWeDoBullets: [
      "Remove old grass/weeds",
      "Prep the soil",
      "Lay fresh rolls of sod",
      "Roll it smooth and water it in",
    ],
    upsellSlugs: ["irrigation-system-installation"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA", "Builder"],
  },
  {
    slug: "planting-installation",
    name: "Planting Trees & Shrubs",
    category: "Landscaping",
    subcategory: "Planting",
    keywords: ["plant trees", "plant bushes", "landscaping"],
    intents: ["install"],
    seasonality: ["spring", "fall"],
    units: ["job"],
    quickSummary: "We plant trees, shrubs, and flowers correctly so they grow and thrive.",
    whatWeDoBullets: [
      "Dig the right size hole",
      "Add good soil",
      "Plant straight and secure",
      "Mulch and water",
    ],
    upsellSlugs: ["mulch-installation", "drip-irrigation-installation"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA", "Builder"],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // MAINTENANCE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "irrigation-seasonal-plan",
    name: "Sprinkler Service Plan",
    category: "Maintenance",
    subcategory: "Plans",
    keywords: ["sprinkler maintenance", "spring startup", "winterization"],
    intents: ["contract", "maintenance"],
    seasonality: ["spring", "summer", "fall", "winter"],
    units: ["visit", "job"],
    quickSummary: "We come out in Spring to turn it on, Summer to check it, and Winter to shut it down.",
    whatWeDoBullets: [
      "Spring: Turn on water and check all heads",
      "Summer: Check for dry spots and adjust timer",
      "Winter: Blow out water to prevent freezing",
    ],
    packs: [
      {
        tier: "Basic",
        promise: "Start, Check, Close.",
        includes: ["Spring Startup", "Mid-Season Check", "Winterization"],
      },
    ],
    upsellSlugs: ["smart-controller-upgrade"],
    proofChecklist: [...proofBase],
    b2bFit: ["Residential", "HOA"],
  },
];

// Convenience indexes
export const servicesByCategory = services.reduce<Record<string, Service[]>>((acc, s) => {
  acc[s.category] ||= [];
  acc[s.category].push(s);
  return acc;
}, {});