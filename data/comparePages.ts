// data/comparePages.ts
// Elite — Comparison Pages (research intent)

export type ComparePage = {
  slug: string;
  title: string;
  summary: string;
  sections: Array<{ heading: string; bullets: string[] }>;
  whoWins: Array<{ scenario: string; recommendation: string }>;
  relatedServiceSlugs: string[];
  faq: Array<{ q: string; a: string }>;
};

export const comparePages: ComparePage[] = [
  {
    slug: "hydrawise-vs-rachio",
    title: "Hydrawise vs Rachio (Which Smart Controller Is Better?)",
    summary:
      "Both Hydrawise and Rachio can improve watering efficiency, but they differ in “pro-grade” features, monitoring options, and how they fit HOA/commercial setups. The best choice depends on zones, desired alerts, and how hands-on you want control to be.",
    sections: [
      { heading: "Hydrawise Strengths", bullets: ["Pro-oriented ecosystem", "Flow monitoring + alert workflows", "Strong for larger/complex systems"] },
      { heading: "Rachio Strengths", bullets: ["Homeowner-friendly app experience", "Great for typical residential systems", "Easy remote schedule changes"] },
      { heading: "Decision Factors", bullets: ["Zone count and complexity", "Need for leak alerts/flow monitoring", "HOA/commercial reporting requirements"] },
    ],
    whoWins: [
      { scenario: "Complex or HOA irrigation", recommendation: "Hydrawise (better scalability + monitoring options)" },
      { scenario: "Typical residential convenience upgrade", recommendation: "Rachio (fast homeowner adoption)" },
    ],
    relatedServiceSlugs: ["smart-controller-upgrade", "irrigation-audit", "hydrawise-flow-meter-installation"],
    faq: [
      { q: "Will a smart controller lower my water bill?", a: "Often, yes—especially if schedules were mis-set. But leaks and coverage issues must be fixed first." },
      { q: "Do I still need seasonal adjustments?", a: "Smart controllers help, but tuning and audits produce the biggest efficiency gains." },
    ],
  },
  {
    slug: "drip-vs-spray-irrigation",
    title: "Drip vs Spray Irrigation (Beds and Shrubs)",
    summary:
      "Drip irrigation is usually best for beds and shrubs because it waters the root zone with minimal overspray. Spray is faster for turf coverage but wastes water in beds and on hard surfaces. The right system often combines both.",
    sections: [
      { heading: "Drip Pros/Cons", bullets: ["Efficient root-zone watering", "Less evaporation/overspray", "Requires filtration and proper emitter selection"] },
      { heading: "Spray Pros/Cons", bullets: ["Fast coverage for turf", "More overspray risk in beds", "Higher evaporation and runoff potential"] },
      { heading: "Where Each Fits", bullets: ["Beds/shrubs: drip", "Turf: spray/rotor/MP", "Mixed landscapes: zoned combo"] },
    ],
    whoWins: [
      { scenario: "Plant beds and foundation plantings", recommendation: "Drip (better efficiency and healthier plants)" },
      { scenario: "Open turf areas", recommendation: "Spray/rotor/MP (better coverage)" },
    ],
    relatedServiceSlugs: ["drip-irrigation-installation", "irrigation-system-installation", "irrigation-audit"],
    faq: [
      { q: "Can I convert existing beds to drip?", a: "Yes—often a high-ROI upgrade that reduces waste and improves plant health." },
      { q: "Will drip prevent weeds?", a: "It helps by watering targeted areas, but mulch/maintenance still matters." },
    ],
  },
  {
    slug: "french-drain-vs-surface-drain",
    title: "French Drain vs Surface Drain (Standing Water Fix)",
    summary:
      "Surface drains (catch basins/channel drains) collect water where it pools. French drains handle subsurface water and persistent soggy ground. Many properties need a combination: collect surface water and move it through a subsurface system.",
    sections: [
      { heading: "Surface Drains Best For", bullets: ["Hardscape/driveway runoff", "Low points that pool quickly", "Capturing water at collection points"] },
      { heading: "French Drains Best For", bullets: ["Soggy lawns and subsurface water", "Long-term wet areas", "Moving water away under the surface"] },
      { heading: "Combo Approaches", bullets: ["Catch basin feeding a french drain run", "Downspout routing + grading + targeted drains"] },
    ],
    whoWins: [
      { scenario: "Water pools in one obvious low spot", recommendation: "Surface drain (catch basin) first" },
      { scenario: "Yard stays soggy for days", recommendation: "French drain + grading evaluation" },
    ],
    relatedServiceSlugs: ["drainage-assessment", "catch-basin-installation", "french-drain-installation", "grading-corrections"],
    faq: [
      { q: "Do drains always need an outlet?", a: "Most effective systems include a safe discharge route; a good plan defines where water goes." },
      { q: "Can grading alone solve it?", a: "Sometimes—grading is often cheaper and should be evaluated before trench-heavy installs." },
    ],
  },
  {
    slug: "pavers-vs-stamped-concrete",
    title: "Pavers vs Stamped Concrete (Patios and Walkways)",
    summary:
      "Pavers are modular and repairable: if one section settles, you can reset it. Stamped concrete can look great, but cracks are harder to hide and repairs are more visible. Your climate, soil movement, and drainage matter.",
    sections: [
      { heading: "Pavers", bullets: ["Repairable and modular", "Great design flexibility", "Requires proper base prep + edge restraint"] },
      { heading: "Stamped Concrete", bullets: ["Seamless look", "Often faster installation", "Cracks can be unavoidable and visible"] },
      { heading: "Decision Factors", bullets: ["Soil movement and drainage", "Design preferences", "Long-term repair tolerance"] },
    ],
    whoWins: [
      { scenario: "You want easier long-term repairs", recommendation: "Pavers" },
      { scenario: "You want a seamless slab aesthetic", recommendation: "Stamped concrete (accept crack risk)" },
    ],
    relatedServiceSlugs: ["paver-patio-installation", "walkway-installation", "hardscape-repair"],
    faq: [
      { q: "Do pavers shift?", a: "They can if the base or drainage is wrong. A correct build minimizes movement." },
      { q: "Which is cheaper?", a: "It depends on design and prep. Total cost is driven by excavation/base/drainage more than surface." },
    ],
  },
];