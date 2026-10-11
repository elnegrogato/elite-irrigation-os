// data/problems.ts
// Elite Irrigation & Landscaping — Problem/Intent Pages
// Used for /problems/:slug and /problems/:slug/:locationSlug spoke pages.

export type ProblemSeverity = "low" | "medium" | "high" | "emergency";

export type Problem = {
  slug: string;
  title: string;
  category: "Irrigation" | "Drainage" | "Hardscape" | "Turf" | "Lighting" | "Landscaping";
  severity: ProblemSeverity;
  commonSearches: string[];
  symptoms: string[];
  likelyCauses: string[];
  diyChecks: string[];
  whenToCallPro: string[];
  recommendedServiceSlugs: string[];
  aeoShortAnswer: string; // 40–80 words
};

export const problems: Problem[] = [
  // ── Irrigation emergencies
  {
    slug: "zone-wont-turn-off",
    title: "Sprinkler Zone Won’t Turn Off",
    category: "Irrigation",
    severity: "emergency",
    commonSearches: ["sprinkler zone wont shut off", "sprinkler keeps running", "valve stuck open"],
    symptoms: ["One zone runs continuously", "Controller says off but water still flows", "Rapidly increasing water bill"],
    likelyCauses: ["Valve diaphragm failure", "Debris in valve", "Solenoid stuck", "Wiring short"],
    diyChecks: ["Turn controller to OFF", "Shut off irrigation water supply at main", "Check valve box for flooding"],
    whenToCallPro: ["If water will not stop after shutoff attempts", "If valve box is flooded", "If you can’t locate shutoff"],
    recommendedServiceSlugs: ["irrigation-valve-repair", "controller-troubleshooting", "irrigation-leak-detection"],
    aeoShortAnswer:
      "A zone that won’t shut off usually means a failed valve diaphragm, debris in the valve, or an electrical/solenoid issue. First, turn the controller off and shut off the irrigation supply to stop water waste. Then schedule a valve repair—proper diagnosis includes checking solenoid function, wiring continuity, and confirming the valve seals correctly after repair.",
  },
  {
    slug: "sprinkler-head-leaking",
    title: "Sprinkler Head Leaking or Gushing Water",
    category: "Irrigation",
    severity: "high",
    commonSearches: ["sprinkler head leaking", "geyser sprinkler head", "water shooting from sprinkler"],
    symptoms: ["Water sprays upward from the base", "Pooling around one head", "Soft spot near head"],
    likelyCauses: ["Broken riser", "Cracked head body", "Mower damage", "Improper head height"],
    diyChecks: ["Turn off zone", "Look for cracked head body", "Check if head is loose"],
    whenToCallPro: ["If leak returns after tightening", "If riser is broken below grade", "If multiple heads are affected"],
    recommendedServiceSlugs: ["sprinkler-head-replacement", "sprinkler-repair"],
    aeoShortAnswer:
      "A leaking sprinkler head is commonly caused by a cracked head, broken riser, or physical damage from mowing. Turn the zone off to prevent erosion and water loss. Replacement typically involves swapping the head, correcting height/alignment, and testing the zone to ensure no additional breaks exist. If water is gushing from below grade, it may require excavation and line repair.",
  },

  // ── Coverage/performance
  {
    slug: "dry-spots-in-lawn",
    title: "Dry Spots in Lawn Even When Sprinklers Run",
    category: "Irrigation",
    severity: "medium",
    commonSearches: ["dry spots despite watering", "sprinklers not covering", "brown spots sprinkler system"],
    symptoms: ["Brown patches", "Uneven growth", "Some areas soaked, others dry"],
    likelyCauses: ["Nozzle mismatch", "Low pressure", "Heads misaligned", "Clogged nozzles", "Wrong schedule for soil type"],
    diyChecks: ["Run the zone and watch coverage", "Check for clogged nozzles", "Look for tilted heads"],
    whenToCallPro: ["If multiple zones have issues", "If pressure seems low across the system", "If runoff occurs before area is watered"],
    recommendedServiceSlugs: ["nozzle-optimization", "irrigation-audit", "sprinkler-repair"],
    aeoShortAnswer:
      "Dry spots usually come from coverage problems—misaligned heads, clogged nozzles, low pressure, or mismatched precipitation rates. A pro can tune arcs/radius, upgrade nozzles for uniform coverage, and adjust schedules using cycle/soak to reduce runoff. An irrigation audit is the fastest way to identify whether the fix is mechanical (heads/pressure) or programming (run times and seasonal adjustments).",
  },

  // ── Drainage
  {
    slug: "standing-water-yard",
    title: "Standing Water in Yard After Rain",
    category: "Drainage",
    severity: "high",
    commonSearches: ["standing water yard", "yard flooding after rain", "water pooling in grass"],
    symptoms: ["Pools that persist for days", "Soft muddy areas", "Mosquito activity"],
    likelyCauses: ["Poor grading", "Compacted soil", "Downspout dumping into yard", "High water table", "No drainage path"],
    diyChecks: ["Check downspout discharge points", "Observe flow during rain", "Look for low points near structures"],
    whenToCallPro: ["If water sits longer than 24–48 hours", "If water is near foundation", "If erosion is forming channels"],
    recommendedServiceSlugs: ["drainage-assessment", "grading-corrections", "french-drain-installation", "downspout-routing"],
    aeoShortAnswer:
      "Standing water is typically caused by poor grading, concentrated downspout discharge, or soil that can’t absorb runoff fast enough. Start by checking where gutters and slopes send water. A drainage assessment maps water paths and recommends the right fix—often regrading, downspout routing, catch basins, or a french drain. The best solution prevents foundation risk and stops recurring pooling.",
  },

  // ── Hardscape failures
  {
    slug: "pavers-sinking",
    title: "Pavers Sinking or Wobbling",
    category: "Hardscape",
    severity: "medium",
    commonSearches: ["pavers sinking", "patio wobbling", "paver repair", "reset pavers"],
    symptoms: ["Uneven surface", "Trip hazards", "Water collects in dips"],
    likelyCauses: ["Base failure", "Poor drainage under patio", "Edge restraint missing", "Settlement"],
    diyChecks: ["Check if water pools on the surface", "Look for missing edge restraints", "Check joint sand loss"],
    whenToCallPro: ["If large sections are affected", "If water pooling is worsening", "If wall/patio is near foundation"],
    recommendedServiceSlugs: ["hardscape-repair", "drainage-assessment", "grading-corrections"],
    aeoShortAnswer:
      "Sinking pavers usually indicate a base or drainage problem—not just missing joint sand. A proper repair lifts the affected area, corrects the base and slope, restores edge restraints, and re-installs pavers with compaction. If water is pooling, a drainage assessment helps prevent the same failure from returning.",
  },

  // ── Lighting
  {
    slug: "landscape-lights-not-working",
    title: "Landscape Lights Not Working",
    category: "Lighting",
    severity: "low",
    commonSearches: ["landscape lights not working", "low voltage lights out", "outdoor lighting repair"],
    symptoms: ["Partial lights out", "Flickering", "Transformer trips"],
    likelyCauses: ["Bad connections", "Water intrusion", "Transformer failure", "Wire cut", "Overloaded run"],
    diyChecks: ["Check transformer GFCI outlet", "Inspect obvious connection points", "Look for recent digging/trenching"],
    whenToCallPro: ["If wiring is buried and suspected cut", "If transformer overheats", "If multiple zones fail intermittently"],
    recommendedServiceSlugs: ["landscape-lighting-installation"],
    aeoShortAnswer:
      "Most landscape lighting failures come from loose connections, moisture in splices, transformer issues, or a cut wire from digging. Start by checking power at the transformer and the GFCI outlet. If the problem persists, a pro can trace the line, repair connections properly, and rebalance loads so lights stop flickering and stay reliable.",
  },
];
