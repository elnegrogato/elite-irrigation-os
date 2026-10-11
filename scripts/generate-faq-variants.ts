// scripts/generate-faq-variants.ts
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { services } from "../data/services";
import { locationsFull } from "../data/locations_full";

type QA = { q: string; a: string };

const outFile = path.join((process as any).cwd(), "src/data/generated/faqVariants.generated.ts");

function hashToInt(s: string) {
  const h = crypto.createHash("sha256").update(s).digest("hex").slice(0, 8);
  return parseInt(h, 16);
}

function pick<T>(arr: T[], seed: number, idx: number) {
  return arr[(seed + idx * 997) % arr.length];
}

const answerOpeners = [
  "In most cases,",
  "Typically,",
  "For most properties,",
  "The quickest path is",
  "A reliable approach is",
];

const schedulingLines = [
  "We prioritize dense routes and triage urgent issues first.",
  "Scheduling depends on season and route density; emergencies get priority.",
  "We group nearby jobs to keep costs down and response times fast.",
  "We aim for fast scheduling with clear windows and confirmation texts.",
];

const proofLines = [
  "Every job includes before/after photos and notes so you have a clean record.",
  "We document the work with photo proof and a quick functional test.",
  "You’ll get a clear summary of what changed, plus evidence photos.",
  "We close jobs with proof: photos, notes, and a test result where applicable.",
];

const pricingLines = [
  "Pricing depends on scope, access, and whether digging or specialty parts are needed.",
  "Costs vary by complexity and parts; we provide Good/Better/Best options when possible.",
  "The main drivers are time, materials, and site conditions; we quote clearly after assessment.",
  "We’ll give you an options-based quote so you can choose the right performance level.",
];

function buildFaq(serviceName: string, locationName: string, seed: number): QA[] {
  const opener = pick(answerOpeners, seed, 1);
  const sched = pick(schedulingLines, seed, 2);
  const proof = pick(proofLines, seed, 3);
  const price = pick(pricingLines, seed, 4);

  return [
    {
      q: `How much does ${serviceName.toLowerCase()} cost in ${locationName}?`,
      a: `${opener} ${price}`,
    },
    {
      q: `How fast can you schedule ${serviceName.toLowerCase()} in ${locationName}?`,
      a: `${opener} ${sched}`,
    },
    {
      q: `Do you provide photo proof and documentation?`,
      a: `${opener} ${proof}`,
    },
    {
      q: `What should I do before you arrive?`,
      a: `${opener} if possible, note the problem areas, turn off irrigation water if there’s active flooding, and ensure access to the controller/valve boxes. We’ll handle the rest during the assessment.`,
    },
  ];
}

function main() {
  const data: Record<string, Record<string, QA[]>> = {};

  for (const s of services) {
    data[s.slug] ||= {};
    for (const l of locationsFull) {
      const seed = hashToInt(`${s.slug}|${l.slug}`);
      data[s.slug][l.slug] = buildFaq(s.name, l.name, seed);
    }
  }

  const content = `// AUTO-GENERATED — do not edit by hand
export type QA = { q: string; a: string };
export const faqVariants: Record<string, Record<string, QA[]>> = ${JSON.stringify(data, null, 2)} as const;
`;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, content, "utf8");
  console.log("✅ faqVariants.generated.ts written");
}

main();