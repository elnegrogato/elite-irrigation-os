// src/lib/sectionRenderer.ts
export type SectionKey = "Hero" | "LocalContext" | "Proof" | "WhatWeDo" | "FAQ" | "CTA" | "Links";

export function normalizeOrder(order?: string[]): SectionKey[] {
  const fallback: SectionKey[] = ["Hero", "Proof", "WhatWeDo", "FAQ", "CTA", "Links"];
  if (!order?.length) return fallback;

  const allowed = new Set(fallback);
  const filtered = order.filter(x => allowed.has(x as any)) as SectionKey[];
  // Ensure required sections exist at least once
  for (const s of fallback) if (!filtered.includes(s)) filtered.push(s);
  return filtered;
}