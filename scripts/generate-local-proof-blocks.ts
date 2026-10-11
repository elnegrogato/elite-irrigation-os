// scripts/generate-local-proof-blocks.ts
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { services } from "../data/services";
import { locationsFull } from "../data/locations_full";

type ProofBlock = {
  headline: string;
  paragraphs: string[];
  proofPrompts: string[]; // prompts for what to photograph/document on-site
  trustBadges: string[];  // reusable “trust lines”
};

const outFile = path.join((process as any).cwd(), "src/data/generated/localProof.generated.ts");

function hashToInt(s: string) {
  const h = crypto.createHash("sha256").update(s).digest("hex").slice(0, 8);
  return parseInt(h, 16);
}

function pick<T>(arr: T[], seed: number, idx: number) {
  return arr[(seed + idx * 733) % arr.length];
}

const leadLines = [
  "We serve homeowners, HOAs, and property managers with a process built for reliability.",
  "Elite is built around fast triage, clean execution, and documented results you can trust.",
  "We focus on durable exterior systems—water, drainage, surfaces, and outdoor usability.",
  "Our work is designed to prevent repeat problems, not just patch symptoms.",
];

const localTone = [
  "We route crews to keep response times fast and pricing fair.",
  "We plan work in dense service blocks to reduce downtime and travel waste.",
  "We schedule around seasonality and weather windows to protect quality.",
  "We build scopes that match the property’s real constraints—access, grading, and water flow.",
];

const documentationLines = [
  "Every job closes with a proof bundle: before/after photos, work notes, and a functional test.",
  "We document what changed so you can track the property’s exterior system history over time.",
  "You’ll get clarity: what we did, why we did it, and what to watch next.",
];

const trustBadgesBase = [
  "Photo-proof closeout on every job",
  "Options-based quotes when the scope allows",
  "Seasonal scheduling built-in",
  "HOA / multifamily ready reporting",
];

function buildProofBlock(serviceName: string, locationName: string, seed: number): ProofBlock {
  const lead = pick(leadLines, seed, 1);
  const tone = pick(localTone, seed, 2);
  const doc = pick(documentationLines, seed, 3);

  const prompts = [
    `Before photos: the area affected by ${serviceName.toLowerCase()}`,
    `Close-up photos: key components or failure points (heads/valves/drains/base layers, as applicable)`,
    `After photos: finished result + restored grade/coverage/flow (as applicable)`,
    "Functional test evidence: short video or photo of system running correctly",
  ];

  return {
    headline: `${serviceName} in ${locationName} — done right, documented`,
    paragraphs: [
      `${lead} In ${locationName}, ${tone}`,
      `${doc}`,
    ],
    proofPrompts: prompts,
    trustBadges: trustBadgesBase,
  };
}

function main() {
  const data: Record<string, Record<string, ProofBlock>> = {};

  for (const s of services) {
    data[s.slug] ||= {};
    for (const l of locationsFull) {
      const seed = hashToInt(`${s.slug}|${l.slug}|proof`);
      data[s.slug][l.slug] = buildProofBlock(s.name, l.name, seed);
    }
  }

  const content = `// AUTO-GENERATED — do not edit by hand
export type ProofBlock = {
  headline: string;
  paragraphs: string[];
  proofPrompts: string[];
  trustBadges: string[];
};

export const localProof: Record<string, Record<string, ProofBlock>> = ${JSON.stringify(data, null, 2)} as const;
`;

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, content, "utf8");
  console.log("✅ localProof.generated.ts written");
}

main();