// src/lib/content-generators.ts
import { Service, ServiceCategory } from "../../data/services";
import { Location } from "../../data/locations_full";

// Deterministic random
function hashToInt(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: number, idx: number) {
  return arr[(seed + idx * 997) % arr.length];
}

type GuideStep = {
  title: string;
  desc: string;
};

export function generateMicroGuide(service: Service, location: Location): GuideStep[] {
  const seed = hashToInt(`${service.slug}|${location.slug}|guide`);
  
  // Generic fallback steps
  let steps: GuideStep[] = [
    { title: "Assessment", desc: `We arrive in ${location.name}, inspect the site, and verify the root cause.` },
    { title: "Plan", desc: "We provide clear options (Good/Better/Best) with upfront pricing." },
    { title: "Execution", desc: "Our team executes the work cleanly, following local codes." },
    { title: "Validation", desc: "We test the system and provide photo proof of completion." }
  ];

  // Category-specific logic overrides
  if (service.category === 'Irrigation') {
    steps = [
      { 
        title: "Diagnostic Run", 
        desc: `In ${location.name}, we start by pressurizing the system and running a zone-by-zone test to flag all failures (electrical, hydraulic, or mechanical).` 
      },
      { 
        title: "Targeted Repair", 
        desc: `We expose the issue—whether it's a valve box in ${location.name} clay soil or a broken line—and repair it using pro-grade fittings.` 
      },
      { 
        title: "Coverage Tuning", 
        desc: "Once flowing, we adjust nozzles and head alignment to stop overspray on hardscapes and eliminate dry spots." 
      },
      { 
        title: "Controller Setup", 
        desc: "We reset your watering schedule based on current season and soil type to prevent runoff." 
      }
    ];
  }

  if (service.category === 'Drainage') {
    steps = [
      { 
        title: "Flow Mapping", 
        desc: `We watch how water moves across your property during rain events (or simulate it) to find low points.` 
      },
      { 
        title: "Elevation Check", 
        desc: "Using laser levels, we determine the necessary slope to move water away from your foundation by gravity." 
      },
      { 
        title: "Installation", 
        desc: `We trench and install the system (French drain, catch basin, or piping) with proper aggregate and fabric.` 
      },
      { 
        title: "Outlet Protection", 
        desc: `We secure the discharge point to prevent erosion and ensure water exits safely away from ${location.name} neighbors.` 
      }
    ];
  }

  if (service.category === 'Hardscape') {
    steps = [
      { 
        title: "Base Excavation", 
        desc: "We dig down to solid subgrade and install a compacted gravel base—critical for preventing settling." 
      },
      { 
        title: "Drainage Layer", 
        desc: "We grade the base to shed water away from your home, ensuring the patio or wall stays stable." 
      },
      { 
        title: "Install & Edge", 
        desc: "We lay pavers or blocks with precision, installing edge restraints to lock the structure in place." 
      },
      { 
        title: "Jointing & Seal", 
        desc: "We sweep in polymeric sand and compact it to seal joints against weeds and washout." 
      }
    ];
  }

  // Add a variation twist based on the seed so identical categories don't look 100% identical text-wise
  const twists = [
    " We document every step with photos.",
    " Clean-up is part of the job; we leave the site spotless.",
    " We double-check pressure/flow rates before leaving.",
    " Our trucks are stocked to handle most surprises on the spot."
  ];
  
  steps[3].desc += pick(twists, seed, 0);

  return steps;
}