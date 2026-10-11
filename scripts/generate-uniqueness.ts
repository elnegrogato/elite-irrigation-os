// scripts/generate-uniqueness.ts
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { services } from "../data/services";
import { locationsFull } from "../data/locations_full";
import { allowSpoke } from "../src/data/exclusions";

type Uniq = {
  leadParagraph: string;
  localContextParagraph: string;
  processParagraph: string;
  miniCaseStudyPrompt: string;
  trustBullets: string[];
  sectionOrder: string[]; // lets you rearrange section order per page
};

const outFile = path.join((process as any).cwd(), "src/data/generated/uniqueness.generated.ts");

function h(s: string) {
  return parseInt(crypto.createHash("sha256").update(s).digest("hex").slice(0, 8), 16);
}
function pick<T>(arr: T[], seed: number, k: number) {
  return arr[(seed + k * 911) % arr.length];
}

const leadOpeners = [
  "If you want this fixed once—and documented—this is the right place to start.",
  "Most exterior problems repeat when the root cause isn’t handled. We solve the cause and prove it.",
  "Elite is built for durable exterior systems: water, drainage, and outdoor function that stays reliable.",
  "The fastest way to a clean outcome is a clear scope, clean execution, and proof you can trust.",
];

const localContextLines = [
  "We schedule by route density, which keeps response times fast and protects quality.",
  "Seasonality matters here—our process adapts schedules and recommendations across spring, summer, fall, and winter.",
  "We work with homeowners, HOAs, and property managers—so documentation and predictable execution are baked in.",
  "We plan work around weather windows and site constraints so you don’t pay for rework.",
];

const processLines = [
  "Our process is simple: assess → options → execute → photo proof → functional test → next-step recommendations.",
  "Every job follows a checklist with required proof photos and a final test before we close it out.",
  "We quote in options when possible and then execute with documentation so you have a clean property record.",
  "We treat each job as part of the property’s long-term exterior system history, not a one-off visit.",
];

const trustBulletsPool = [
  "Before/after photo proof on every job",
  "Options-based pricing when scope allows",
  "Seasonal reminders and plan scheduling",
  "HOA/multifamily-ready reporting",
  "Clear next-step recommendations (no guesswork)",
  "Documented functional testing when applicable",
];

const sectionOrders = [
  ["Hero", "Proof", "WhatWeDo", "FAQ", "CTA", "Links"],
  ["Hero", "WhatWeDo", "Proof", "CTA", "FAQ", "Links"],
  ["Hero", "LocalContext", "WhatWeDo", "Proof", "FAQ", "CTA", "Links"],
  ["Hero", "WhatWeDo", "FAQ", "Proof", "CTA", "Links"],
];

function buildUniq(serviceName: string, locationName: string, seed: number): Uniq {
  const lead = pick(leadOpeners, seed, 1);
  const local = pick(localContextLines, seed, 2);
  const proc = pick(processLines, seed, 3);
  const order = pick(sectionOrders, seed, 4);

  const trust = Array.from({ length: 4 }, (_, i) => pick(trustBulletsPool, seed, 10 + i))
    .filter((v, i, a) => a.indexOf(v) === i);

  return {
    leadParagraph: `${lead}`,
    localContextParagraph: `In ${locationName}, ${local}`,
    processParagraph: `${proc}`,
    miniCaseStudyPrompt: `Attach a real project for ${serviceName} in/near ${locationName}: include before/after photos, scope notes, and a measurable outcome (coverage restored, pooling eliminated, base corrected, etc.).`,
    trustBullets: trust,
    sectionOrder: order,
  };
}

function main() {
  const data: Record<string, Record<string, Uniq>> = {};

  for (const s of services) {
    data[s.slug] ||= {};
    for (const l of locationsFull) {
      const ok = allowSpoke(s, l);
      if (!ok.allowed) continue;
      const seed = h(`${s.slug}|${l.slug}|uniq`);
      data[s.slug][l.slug] = buildUniq(s.name, l.name, seed);
    }
  }

  const content = `// AUTO-GENERATED — do not edit by hand
export type Uniq = {
  leadParagraph: string;
  localContextParagraph: string;
  processParagraph: string;
  miniCaseStudyPrompt: string;
  trustBullets: string[];
  sectionOrder: string[];
};

export const uniqueness: Record<string, Record<string, Uniq>> = ${JSON.stringify(data, null, 2)} as const;
`;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, content, "utf8");
  console.log("✅ uniqueness.generated.ts written");
}

main();