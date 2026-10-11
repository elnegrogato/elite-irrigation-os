// data/servicePacks.ts
// Elite — Standardized Packs (Good/Better/Best style)
// Used by estimators, agents, and programmatic service pages.

export type PackTier = "Good" | "Better" | "Best" | "Elite";

export type ServicePack = {
  id: string;
  serviceSlug: string;
  tier: PackTier;
  name: string;
  promise: string;
  includes: string[];
  excludes?: string[];
  prerequisites?: string[];
  optionsAddOns?: string[];
  typicalRange?: { min: number; max: number; unit: string };
  sla?: { responseHours: number; scheduleWindowDays: number };
  proofRequirements: string[];
  warrantyNotes?: string[];
};

const proof = [
  "Before photos (wide + close)",
  "After photos (wide + close)",
  "Work notes (what changed + why)",
  "Function test (video/photo)",
] as const;

export const servicePacks: ServicePack[] = [
  // Sprinkler Repair Packs
  {
    id: "sprinkler-repair-good",
    serviceSlug: "sprinkler-repair",
    tier: "Good",
    name: "Sprinkler Repair — Restore Function",
    promise: "Get the system running again and stop obvious waste.",
    includes: ["Zone test", "Minor head/nozzle replacement", "Basic adjustments", "Function test"],
    excludes: ["Major excavation", "Valve replacement", "Wiring tracing"],
    typicalRange: { min: 175, max: 450, unit: "job" },
    sla: { responseHours: 24, scheduleWindowDays: 5 },
    proofRequirements: [...proof],
  },
  {
    id: "sprinkler-repair-better",
    serviceSlug: "sprinkler-repair",
    tier: "Better",
    name: "Sprinkler Repair — Tune + Repair",
    promise: "Fix the break and improve coverage to reduce dry spots/runoff.",
    includes: ["Everything in Good", "Coverage tuning (arc/radius)", "Pressure check", "Controller schedule check"],
    typicalRange: { min: 350, max: 850, unit: "job" },
    sla: { responseHours: 12, scheduleWindowDays: 3 },
    proofRequirements: [...proof, "Controller settings screenshot"],
  },
  {
    id: "sprinkler-repair-best",
    serviceSlug: "sprinkler-repair",
    tier: "Best",
    name: "Sprinkler Repair — Repair + Efficiency Plan",
    promise: "Repair plus a practical upgrade path for water savings and reliability.",
    includes: ["Everything in Better", "Leak isolation recommendations", "Nozzle optimization recommendations", "Water-efficiency notes"],
    typicalRange: { min: 650, max: 1500, unit: "job" },
    sla: { responseHours: 6, scheduleWindowDays: 2 },
    proofRequirements: [...proof, "Coverage notes (dry spots/overspray)"],
  },

  // Drainage Assessment
  {
    id: "drainage-assessment-good",
    serviceSlug: "drainage-assessment",
    tier: "Good",
    name: "Drainage Assessment — Quick Diagnosis",
    promise: "Understand why water pools and the fastest viable fix.",
    includes: ["Site walkthrough", "Downspout/discharge check", "Basic grading review", "Recommended next steps"],
    typicalRange: { min: 195, max: 495, unit: "job" },
    sla: { responseHours: 24, scheduleWindowDays: 7 },
    proofRequirements: [...proof, "Flow map photos"],
  },
  {
    id: "drainage-assessment-best",
    serviceSlug: "drainage-assessment",
    tier: "Best",
    name: "Drainage Assessment — Plan + Options",
    promise: "A prioritized drainage plan with options, rough budgets, and phasing.",
    includes: ["Everything in Good", "Option A/B/C solutions", "Rough budget bands", "Phasing plan"],
    typicalRange: { min: 395, max: 895, unit: "job" },
    sla: { responseHours: 24, scheduleWindowDays: 5 },
    proofRequirements: [...proof, "Plan notes PDF/upload"],
  },

  // French Drain
  {
    id: "french-drain-better",
    serviceSlug: "french-drain-installation",
    tier: "Better",
    name: "French Drain — Proven System",
    promise: "Move subsurface water away with proper slope and materials.",
    includes: ["Design path + discharge", "Trench + pipe + fabric", "Aggregate bedding", "Flow test", "Clean restoration"],
    prerequisites: ["Utility locate (811) complete"],
    typicalRange: { min: 4500, max: 12000, unit: "job" },
    sla: { responseHours: 24, scheduleWindowDays: 14 },
    proofRequirements: [...proof, "Trench install photos", "Outlet photo/video"],
  },
  {
    id: "french-drain-elite",
    serviceSlug: "french-drain-installation",
    tier: "Elite",
    name: "French Drain — Premium Remediation",
    promise: "A drainage system designed for longevity, outlet protection, and reduced maintenance.",
    includes: ["Everything in Better", "Upgraded fabric/pipe", "Catch basin integration if needed", "Erosion control at outlet", "Follow-up inspection"],
    prerequisites: ["Utility locate (811) complete"],
    typicalRange: { min: 9000, max: 35000, unit: "job" },
    sla: { responseHours: 24, scheduleWindowDays: 21 },
    proofRequirements: [...proof, "Outlet protection photos", "Follow-up checklist"],
  },

  // Smart Controller Upgrade
  {
    id: "smart-controller-good",
    serviceSlug: "smart-controller-upgrade",
    tier: "Good",
    name: "Smart Controller — Install + Setup",
    promise: "Smart controller installed and connected with a working schedule.",
    includes: ["Controller install", "App pairing", "Basic schedule setup", "Zone test"],
    typicalRange: { min: 450, max: 1200, unit: "job" },
    sla: { responseHours: 24, scheduleWindowDays: 10 },
    proofRequirements: [...proof, "App screenshot (online)"],
  },
  {
    id: "smart-controller-best",
    serviceSlug: "smart-controller-upgrade",
    tier: "Best",
    name: "Smart Controller — Install + Audit Tune",
    promise: "Smart controller plus an irrigation tune for water savings and better plant health.",
    includes: ["Everything in Good", "Irrigation audit", "Cycle/soak tuning", "Efficiency recommendations"],
    typicalRange: { min: 850, max: 2200, unit: "job" },
    sla: { responseHours: 24, scheduleWindowDays: 10 },
    proofRequirements: [...proof, "Audit notes", "Schedule screenshot"],
  },

  // Paver Patio
  {
    id: "paver-patio-better",
    serviceSlug: "paver-patio-installation",
    tier: "Better",
    name: "Paver Patio — Engineered Build",
    promise: "A patio built to last: base depth, slope, compaction, and clean finish.",
    includes: ["Excavation", "Engineered base", "Paver install", "Edge restraint", "Jointing + compaction"],
    prerequisites: ["Access confirmed", "Material selection finalized"],
    typicalRange: { min: 12000, max: 25000, unit: "job" },
    sla: { responseHours: 24, scheduleWindowDays: 30 },
    proofRequirements: [...proof, "Base depth photo", "Compaction note"],
  },
  {
    id: "paver-patio-elite",
    serviceSlug: "paver-patio-installation",
    tier: "Elite",
    name: "Paver Patio — Premium Outdoor Living",
    promise: "Design-forward patio with drainage strategy and lighting readiness.",
    includes: ["Everything in Better", "Border/inlay design", "Drainage integration", "Lighting trench/conduit coordination"],
    prerequisites: ["Design approved", "Drainage plan verified"],
    typicalRange: { min: 25000, max: 80000, unit: "job" },
    sla: { responseHours: 24, scheduleWindowDays: 45 },
    proofRequirements: [...proof, "Drainage detail photos", "Night lighting-ready notes"],
  },
];