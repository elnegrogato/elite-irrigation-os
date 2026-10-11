// data/costPages.ts
// Elite — Cost / Pricing Intent Pages
// Routes:
// /cost/:slug

export type CostPage = {
  slug: string;
  title: string;
  summary: string; // short AEO answer
  relatedServiceSlugs: string[];
  factors: string[];
  typicalRanges: Array<{ label: string; min: number; max: number; unit: string }>;
  faq: Array<{ q: string; a: string }>;
};

export const costPages: CostPage[] = [
  {
    slug: "sprinkler-repair-cost",
    title: "Sprinkler Repair Cost",
    summary:
      "Sprinkler repair cost depends on what failed (head vs valve vs wiring), how many zones are impacted, and whether digging is required. Most repairs fall into a service minimum plus parts, with larger failures priced as a scoped job.",
    relatedServiceSlugs: ["sprinkler-repair", "sprinkler-head-replacement", "irrigation-valve-repair"],
    factors: [
      "Type of failure (head/nozzle vs valve vs controller vs wiring)",
      "Underground excavation required",
      "Number of zones/heads affected",
      "Parts brand/type availability",
      "After-hours or priority scheduling",
    ],
    typicalRanges: [
      { label: "Minor repair / service call", min: 175, max: 450, unit: "job" },
      { label: "Valve repair/replacement (typical)", min: 250, max: 850, unit: "job" },
      { label: "Wire diagnostics + repair (typical)", min: 300, max: 1200, unit: "job" },
    ],
    faq: [
      { q: "Why is my sprinkler repair quote higher than expected?", a: "Underground breaks, valve box flooding, or wiring shorts can require diagnostic time and careful excavation." },
      { q: "Can I just replace the head myself?", a: "Sometimes, yes—if the riser isn’t broken below grade and the thread type matches. If it keeps leaking, schedule a pro repair." },
    ],
  },
  {
    slug: "irrigation-installation-cost",
    title: "Irrigation System Installation Cost",
    summary:
      "Irrigation installation cost is driven by property size, zone count, turf vs bed drip coverage, trench difficulty, and smart controller add-ons. A properly designed system prioritizes uniform coverage and water efficiency.",
    relatedServiceSlugs: ["irrigation-system-installation", "drip-irrigation-installation", "smart-controller-upgrade"],
    factors: [
      "Square footage and landscaping complexity",
      "Zone count and head type (spray/rotor/MP/drip)",
      "Trenching difficulty (roots, rock, existing hardscape)",
      "Controller type (basic vs smart Wi-Fi)",
      "Backflow requirements (if applicable locally)",
    ],
    typicalRanges: [
      { label: "Small residential system", min: 2500, max: 6500, unit: "job" },
      { label: "Medium residential system", min: 6500, max: 12000, unit: "job" },
      { label: "Large / HOA/common areas (starting)", min: 12000, max: 40000, unit: "job" },
    ],
    faq: [
      { q: "How many zones do I need?", a: "Zones depend on sun exposure, plant type, head type, pressure, and coverage. Turf and beds typically require separate zones." },
      { q: "Is a smart controller worth it?", a: "Often yes—weather-based watering and seasonal adjustments reduce waste and improve plant health." },
    ],
  },
  {
    slug: "french-drain-cost",
    title: "French Drain Cost",
    summary:
      "French drain pricing depends on linear footage, trench depth, slope constraints, discharge routing, and restoration requirements. The best drains solve the root cause by controlling both surface and subsurface water paths.",
    relatedServiceSlugs: ["french-drain-installation", "drainage-assessment", "grading-corrections"],
    factors: [
      "Linear footage and trench depth",
      "Discharge location and routing",
      "Soil type and water table conditions",
      "Obstructions (trees, utilities, hardscape)",
      "Surface restoration (sod/seed/stone)",
    ],
    typicalRanges: [
      { label: "Short run (typical)", min: 1500, max: 4500, unit: "job" },
      { label: "Medium run (typical)", min: 4500, max: 12000, unit: "job" },
      { label: "Complex drainage remediation", min: 12000, max: 35000, unit: "job" },
    ],
    faq: [
      { q: "Do I need grading or a drain?", a: "Sometimes grading fixes it cheaper. Often the winning combo is downspout routing + grading + targeted drains." },
      { q: "Where does the water go?", a: "A safe discharge point: daylight outlet, approved drain line, or a designed infiltration area when appropriate." },
    ],
  },
  {
    slug: "paver-patio-cost",
    title: "Paver Patio Cost",
    summary:
      "Paver patio cost depends on square footage, base depth requirements, access/excavation difficulty, paver selection, and design complexity. Proper base prep and drainage prevent settling and costly rework.",
    relatedServiceSlugs: ["paver-patio-installation", "walkway-installation", "hardscape-repair"],
    factors: [
      "Square footage and shape complexity",
      "Excavation and base depth",
      "Paver brand/style and border/inlay features",
      "Access constraints (equipment and hauling)",
      "Drainage integration (slope, drains, edge restraints)",
    ],
    typicalRanges: [
      { label: "Small patio (typical)", min: 4500, max: 12000, unit: "job" },
      { label: "Medium patio (typical)", min: 12000, max: 25000, unit: "job" },
      { label: "High-end patio/outdoor living (starting)", min: 25000, max: 80000, unit: "job" },
    ],
    faq: [
      { q: "Why do pavers settle?", a: "Base failure or drainage problems. A correct build uses compacted base, slope, and edge restraints." },
      { q: "Can you add lighting later?", a: "Yes, but it’s best to plan conduit/trenching during the build for cleaner results." },
    ],
  },
  {
    slug: "sod-installation-cost",
    title: "Sod Installation Cost",
    summary:
      "Sod cost depends on square footage, soil prep and grading needs, sod type/availability, and access. Great sod installs prioritize level grading and a strict watering plan for establishment.",
    relatedServiceSlugs: ["sod-installation", "grading-corrections", "irrigation-audit"],
    factors: ["Square footage", "Topsoil/amendments needed", "Grading corrections", "Sod type and season", "Access/hauling"],
    typicalRanges: [
      { label: "Small yard (typical)", min: 1800, max: 5500, unit: "job" },
      { label: "Medium yard (typical)", min: 5500, max: 14000, unit: "job" },
      { label: "Large yard / regrade + sod", min: 14000, max: 40000, unit: "job" },
    ],
    faq: [
      { q: "How long until sod is established?", a: "Usually weeks—not days. Watering consistency is the difference between success and failure." },
      { q: "Do I need irrigation first?", a: "It’s strongly recommended. At minimum, have a watering plan and consistent coverage." },
    ],
  },
];