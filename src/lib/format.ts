// src/lib/format.ts
export const titleCase = (s: string) =>
  s
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map(w => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export const safeJoin = (...parts: Array<string | undefined | null>) =>
  parts.filter(Boolean).join(" • ");

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));