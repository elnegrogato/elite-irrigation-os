// src/lib/contentBlocks.ts
import type { Service } from "../../data/services";
import type { Location } from "../../data/locations_full";

type Block = { title: string; paragraphs: string[]; bullets?: string[] };

export function buildMicroGuide(service: Service, location: Location): Block {
  const isDrain = service.category === "Drainage" || service.category === "Grading";
  const isIrr = service.category === "Irrigation" || service.category === "Seasonal";
  const isHard = service.category === "Hardscape" || service.category === "Lighting";

  const title = isDrain
    ? `Drainage in ${location.name}: what actually works`
    : isIrr
      ? `Irrigation in ${location.name}: how to prevent repeat failures`
      : isHard
        ? `Outdoor projects in ${location.name}: durability rules`
        : `How we approach ${service.name} in ${location.name}`;

  const paragraphs: string[] = [];
  const bullets: string[] = [];

  if (isDrain) {
    paragraphs.push(
      "Most standing water problems repeat when water has nowhere to go. The winning plan starts with mapping flow paths, then combining the simplest fixes (downspout routing and grading) before trench-heavy installs."
    );
    bullets.push(
      "Confirm discharge points and protect outlets from erosion",
      "Restore slope where feasible (often the cheapest fix)",
      "Use collection (catch basins) only where water reliably pools",
      "Use subsurface systems (french drains) for persistent soggy areas"
    );
  } else if (isIrr) {
    paragraphs.push(
      "Irrigation systems fail for predictable reasons: leaks, stuck valves, wiring faults, and poor coverage. The most cost-effective approach is diagnosing by zone, correcting pressure/coverage, then setting schedules that match soil and sun."
    );
    bullets.push(
      "Zone-by-zone testing to isolate failures",
      "Valve/solenoid and wiring verification",
      "Coverage tuning to reduce dry spots and overspray",
      "Seasonal schedule adjustments (cycle/soak when needed)"
    );
  } else if (isHard) {
    paragraphs.push(
      "Hardscape and lighting last when the invisible parts are correct: base prep, compaction, slope, and protected wiring runs. Most failures are base/drainage failures, not surface failures."
    );
    bullets.push(
      "Engineered base depth + compaction",
      "Slope for drainage away from structures",
      "Edge restraint to prevent creep",
      "Lighting trenching protected and planned early"
    );
  } else {
    paragraphs.push("We start with a fast assessment, then deliver options-based scope with proof documentation and a functional test before closeout.");
  }

  return { title, paragraphs, bullets };
}

export function buildChecklists(service: Service) {
  const preArrival = [
    "Note the problem areas and when you first noticed them",
    "Ensure access to controller/valve boxes (irrigation)",
    "If active flooding, shut off irrigation supply if you can locate it safely",
    "Keep pets secured if gates need access",
  ];

  const onSite = [
    "Confirm scope and success criteria",
    "Photo baseline (wide + close)",
    "Execute checklist steps specific to service type",
    "Functional test (run zone / flow test / slope check / night lighting test)",
  ];

  const closeout = [
    "After photos (wide + close)",
    "Work notes: what changed and why",
    "Confirm functional test evidence recorded",
    "Next-step recommendations (if any) captured clearly",
  ];

  // Add service-specific tweaks
  if (service.category === "Hardscape") closeout.unshift("Base and compaction notes (if area was rebuilt)");
  if (service.category === "Drainage") closeout.unshift("Outlet/discharge photo + protection detail");
  if (service.category === "Irrigation") closeout.unshift("Controller settings screenshot (if changed)");

  return { preArrival, onSite, closeout };
}