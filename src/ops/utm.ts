// src/ops/utm.ts
import type { LeadSurface } from "./sources";

export type UTM = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  gclid?: string;
  fbclid?: string;
};

export function normalizeSurface(u: UTM, referrer?: string): LeadSurface {
  const s = (u.source ?? "").toLowerCase();
  const m = (u.medium ?? "").toLowerCase();
  const r = (referrer ?? "").toLowerCase();

  if (u.gclid || s.includes("google") || r.includes("google")) {
    if (m.includes("cpc") || m.includes("paid")) return "google_ads";
    if (m.includes("lsa")) return "lsa";
    if (m.includes("maps")) return "maps";
    return "organic";
  }
  if (s.includes("bing") || r.includes("bing")) return m.includes("cpc") ? "bing_ads" : "organic";
  if (s.includes("nextdoor") || r.includes("nextdoor")) return "nextdoor";
  if (s.includes("facebook") || r.includes("facebook") || u.fbclid) return "facebook";
  if (s.includes("instagram") || r.includes("instagram")) return "instagram";
  if (s.includes("yelp") || r.includes("yelp")) return "yelp";
  if (s.includes("thumbtack") || r.includes("thumbtack")) return "thumbtack";
  if (s.includes("angi") || s.includes("homeadvisor")) return s.includes("homeadvisor") ? "homeadvisor" : "angi";
  if (s.includes("houzz") || r.includes("houzz")) return "houzz";
  if (s.includes("bbb") || r.includes("bbb")) return "bbb";
  if (m.includes("email")) return "email";
  return "direct";
}