// src/ops/sources.ts
export type LeadSurface =
  | "organic"
  | "maps"
  | "lsa"
  | "google_ads"
  | "bing_ads"
  | "nextdoor"
  | "facebook"
  | "instagram"
  | "youtube"
  | "yelp"
  | "angi"
  | "homeadvisor"
  | "thumbtack"
  | "houzz"
  | "bbb"
  | "referral"
  | "partner"
  | "direct"
  | "email"
  | "phone"
  | "sms"
  | "other";

export type LeadIntent =
  | "repair"
  | "install"
  | "upgrade"
  | "maintenance"
  | "inspection"
  | "emergency"
  | "contract"
  | "unknown";

export type LeadEntityType = "homeowner" | "hoa" | "multifamily" | "commercial" | "builder" | "unknown";

export const surfacePriority: Record<LeadSurface, number> = {
  lsa: 10, maps: 9, organic: 8, referral: 9, partner: 9,
  google_ads: 7, bing_ads: 6,
  nextdoor: 7, facebook: 6, instagram: 6, youtube: 5,
  yelp: 5, angi: 5, homeadvisor: 5, thumbtack: 5, houzz: 5, bbb: 4,
  phone: 8, sms: 7, email: 6, direct: 6, other: 1,
};