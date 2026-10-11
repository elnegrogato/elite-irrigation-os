// convex/lib/normalize.ts
import { v } from "convex/values";

export type LeadSurface =
  | "organic" | "maps" | "lsa" | "google_ads" | "bing_ads"
  | "nextdoor" | "facebook" | "instagram" | "youtube"
  | "yelp" | "angi" | "homeadvisor" | "thumbtack" | "houzz" | "bbb"
  | "referral" | "partner" | "direct" | "email" | "phone" | "sms" | "other";

export type LeadIntent =
  | "repair" | "install" | "upgrade" | "maintenance" | "inspection" | "emergency" | "contract" | "unknown";

export type LeadEntityType = "homeowner" | "hoa" | "multifamily" | "commercial" | "builder" | "unknown";

export function normalizePhone(p?: string): string | undefined {
  if (!p) return;
  const digits = p.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return p.trim().startsWith("+") ? `+${digits}` : digits;
}

export function inferUrgencyFromText(text?: string): "low" | "medium" | "high" | "emergency" {
  const t = (text ?? "").toLowerCase();
  if (/(flood|flooding|won't stop|wont stop|stuck on|burst|gushing|leak everywhere|emergency)/.test(t)) return "emergency";
  if (/(standing water|yard flooding|major leak|no water|no pressure|backflow)/.test(t)) return "high";
  if (/(broken head|dry spots|uneven|controller|schedule|tune)/.test(t)) return "medium";
  return "low";
}

export function defaultSla(urgency: string, now: number) {
  const mins = urgency === "emergency" ? 10 : urgency === "high" ? 30 : 60;
  return { respondBy: now + mins * 60 * 1000, estimateBy: now + 24 * 60 * 60 * 1000 };
}

export function normalizeSurface(input?: string, referrer?: string): LeadSurface {
  const s = (input ?? "").toLowerCase();
  const r = (referrer ?? "").toLowerCase();

  if (s.includes("lsa")) return "lsa";
  if (s.includes("maps") || r.includes("google.com/maps")) return "maps";
  if (s.includes("nextdoor") || r.includes("nextdoor")) return "nextdoor";
  if (s.includes("facebook") || r.includes("facebook")) return "facebook";
  if (s.includes("instagram") || r.includes("instagram")) return "instagram";
  if (s.includes("yelp") || r.includes("yelp")) return "yelp";
  if (s.includes("thumbtack") || r.includes("thumbtack")) return "thumbtack";
  if (s.includes("angi")) return "angi";
  if (s.includes("homeadvisor")) return "homeadvisor";
  if (s.includes("houzz") || r.includes("houzz")) return "houzz";
  if (s.includes("bbb") || r.includes("bbb")) return "bbb";
  if (s.includes("sms")) return "sms";
  if (s.includes("phone") || s.includes("call")) return "phone";
  if (s.includes("email")) return "email";
  if (r.includes("google")) return "organic";
  return s ? "other" : "direct";
}

export function inferIntent(serviceSlug?: string, text?: string): LeadIntent {
  const t = (text ?? "").toLowerCase();
  if (/(emergency|flood|won't stop|wont stop|stuck on|gushing|burst)/.test(t)) return "emergency";
  if (serviceSlug) {
    if (serviceSlug.includes("repair")) return "repair";
    if (serviceSlug.includes("install")) return "install";
    if (serviceSlug.includes("upgrade")) return "upgrade";
    if (serviceSlug.includes("audit") || serviceSlug.includes("assessment")) return "inspection";
  }
  if (/(quote|estimate|install|new)/.test(t)) return "install";
  if (/(repair|fix|broken|leak)/.test(t)) return "repair";
  if (/(maintenance|plan|winterization|startup)/.test(t)) return "maintenance";
  if (/(hoa|board|contract|commercial|facility)/.test(t)) return "contract";
  return "unknown";
}

export function inferEntityType(text?: string): LeadEntityType {
  const t = (text ?? "").toLowerCase();
  if (/(hoa|board|association)/.test(t)) return "hoa";
  if (/(multifamily|apartment|units)/.test(t)) return "multifamily";
  if (/(commercial|facility|office|retail|church|school)/.test(t)) return "commercial";
  if (/(builder|gc|general contractor|new construction)/.test(t)) return "builder";
  return "homeowner";
}
