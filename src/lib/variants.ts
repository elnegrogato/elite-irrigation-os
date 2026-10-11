// src/lib/variants.ts
import { Service } from "../../data/services";
import { Location } from "../../data/locations_full";

type QA = { q: string; a: string };

// Simple string hash
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

const answerOpeners = ["In most cases,", "Typically,", "For most properties,", "A reliable approach is", "The quickest path is"];
const pricingLines = [
  "pricing depends on scope, access, and whether digging or specialty parts are needed.",
  "cost varies by complexity and parts; we provide options when possible.",
  "the main drivers are time, materials, and site conditions; we quote clearly after assessment.",
  "we’ll give you an options-based quote so you can choose the right performance level.",
];
const schedulingLines = [
  "we prioritize dense routes and triage urgent issues first.",
  "scheduling depends on season and route density; emergencies get priority.",
  "we group nearby jobs to keep costs down and response times fast.",
  "we aim for fast scheduling with clear windows and confirmations.",
];
const proofLines = [
  "every job includes before/after photos and notes so you have a clean record.",
  "we document the work with photo proof and a quick functional test.",
  "you’ll get clarity: what we did, why we did it, and what to watch next.",
];

export function buildFaq(service: Service, location: Location): QA[] {
  const seed = hashToInt(`${service.slug}|${location.slug}|faq`);
  const opener = pick(answerOpeners, seed, 1);
  const price = pick(pricingLines, seed, 2);
  const sched = pick(schedulingLines, seed, 3);
  const proof = pick(proofLines, seed, 4);

  return [
    { q: `How much does ${service.name.toLowerCase()} cost in ${location.name}?`, a: `${opener} ${price}` },
    { q: `How fast can you schedule ${service.name.toLowerCase()} in ${location.name}?`, a: `${opener} ${sched}` },
    { q: `Do you provide photo proof and documentation?`, a: `${opener} ${proof}` },
    { q: `What should I do before you arrive?`, a: `${opener} note problem areas, ensure access to controller/valve boxes, and shut off irrigation supply if there’s active flooding.` },
  ];
}

export function buildProofBlock(service: Service, location: Location) {
  const seed = hashToInt(`${service.slug}|${location.slug}|proof`);
  const leadLines = [
    "We’re built for reliability: clear scope, clean execution, and documented results.",
    "We solve the root cause and prove the fix with photos and functional testing.",
    "We treat exterior work as a system—water, drainage, surfaces—so problems don’t repeat.",
  ];
  const localLines = [
    "We schedule by route density to keep response times fast and pricing fair.",
    "We plan around seasonality and weather windows to protect quality.",
    "We build scopes around real constraints: access, grading, and water flow.",
  ];

  const headline = `${service.name} in ${location.name} — done right, documented`;
  const paragraphs = [
    `${pick(leadLines, seed, 1)} In ${location.name}, ${pick(localLines, seed, 2)}`,
    "Every job closes with a proof bundle: before/after photos, work notes, and a functional test where applicable.",
  ];

  const proofPrompts = [
    `Before photos: the area affected by ${service.name.toLowerCase()}`,
    `Close-up photos: key components or failure points`,
    `After photos: finished result + restored grade`,
    "Functional test evidence: short video or photo of system running",
  ];

  const trustBadges = [
    "Photo-proof closeout on every job",
    "Options-based quotes when the scope allows",
    "Seasonal scheduling built-in",
    "HOA / multifamily ready reporting",
  ];

  return { headline, paragraphs, proofPrompts, trustBadges };
}