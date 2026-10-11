// data/surfaces.ts
// Elite — Market Surfaces (where leads + trust come from)

export type SurfaceType =
  | "Maps"
  | "Search"
  | "Directories"
  | "Social"
  | "Video"
  | "Paid"
  | "Partnership"
  | "B2BProcurement"
  | "Offline";

export type Surface = {
  type: SurfaceType;
  name: string;
  whyItMatters: string;
  primaryKPIs: string[];
  setupNotes: string[];
};

export const surfaces: Surface[] = [
  {
    type: "Maps",
    name: "Google Business Profile (GBP)",
    whyItMatters: "Primary ‘near me’ discovery and conversion surface for local services.",
    primaryKPIs: ["Calls", "Website clicks", "Direction requests", "Review velocity", "Map pack ranking"],
    setupNotes: ["Accurate categories/services", "Service area configured", "Photos posted weekly", "Q&A maintained"],
  },
  {
    type: "Maps",
    name: "Apple Business Connect / Apple Maps",
    whyItMatters: "Often overlooked; improves local discovery and consistency.",
    primaryKPIs: ["Profile views", "Calls", "Directions"],
    setupNotes: ["NAP consistency", "Photos", "Hours", "Service categories"],
  },
  {
    type: "Maps",
    name: "Bing Places",
    whyItMatters: "Secondary map/search visibility; supports citation consistency.",
    primaryKPIs: ["Impressions", "Calls", "Clicks"],
    setupNotes: ["Sync NAP", "Service categories", "Photos"],
  },
  {
    type: "Search",
    name: "Programmatic SEO (Service × Location × Intent)",
    whyItMatters: "Long-term compounding capture across thousands of local queries.",
    primaryKPIs: ["Organic traffic", "Rank distribution", "Leads from organic", "Conversion rate by page family"],
    setupNotes: ["Unique proof blocks", "AEO answers + schema", "Internal linking graph", "Sitemap automation"],
  },
  {
    type: "Paid",
    name: "Google Local Services Ads (LSA)",
    whyItMatters: "Pay-per-lead visibility above search results (eligibility varies).",
    primaryKPIs: ["Cost/lead", "Booked rate", "Dispute rate", "Lead response time"],
    setupNotes: ["Fast SLA response", "Call recording", "Job-type tagging for quality"],
  },
  {
    type: "Directories",
    name: "Angi / HomeAdvisor",
    whyItMatters: "Lead marketplace + citations; can be profitable with strong process discipline.",
    primaryKPIs: ["Cost/lead", "Booked rate", "Refund/dispute rate", "ROI by job type"],
    setupNotes: ["Tight service types", "Quick response", "Qualification scripts"],
  },
  {
    type: "Directories",
    name: "Thumbtack",
    whyItMatters: "Good for repair/service calls and quick-turn projects.",
    primaryKPIs: ["Cost/lead", "Response time", "Booked rate"],
    setupNotes: ["Template replies", "Pricing ranges", "Portfolio photos"],
  },
  {
    type: "Directories",
    name: "Houzz (Find a Pro)",
    whyItMatters: "Strong for design-forward hardscape and outdoor living work.",
    primaryKPIs: ["Inquiries", "Project close rate", "Average ticket"],
    setupNotes: ["Before/after galleries", "Design pages", "Review cadence"],
  },
  {
    type: "Directories",
    name: "Yelp / BBB",
    whyItMatters: "Trust surface + citations; helps conversion when properly managed.",
    primaryKPIs: ["Review rating", "Inquiries", "Profile completeness"],
    setupNotes: ["Accurate info", "Regular photo posts", "Response to reviews"],
  },
  {
    type: "Social",
    name: "Nextdoor",
    whyItMatters: "Hyperlocal, trust-based lead generation for home services.",
    primaryKPIs: ["Recommendations", "Leads", "Neighbor referrals"],
    setupNotes: ["Weekly posts", "Before/after visuals", "Neighborhood targeting"],
  },
  {
    type: "Video",
    name: "YouTube Shorts / Instagram Reels / TikTok",
    whyItMatters: "Visual proof converts hardscape/drainage/irrigation work faster than text.",
    primaryKPIs: ["Views", "Profile clicks", "Inquiries", "DM-to-booked rate"],
    setupNotes: ["Before/after format", "30–60s explainers", "Local tags + neighborhood naming"],
  },
  {
    type: "Partnership",
    name: "Realtors / Home Inspectors / Property Managers",
    whyItMatters: "High-trust referrals; densifies routes and unlocks recurring contracts.",
    primaryKPIs: ["Partner leads", "Close rate", "Repeat volume", "Route density"],
    setupNotes: ["Partner SOP", "Fast turn SLAs", "Co-branded inspection reports"],
  },
  {
    type: "B2BProcurement",
    name: "HOA / Multifamily / Facilities Contracts",
    whyItMatters: "Recurring revenue and stable capacity planning.",
    primaryKPIs: ["Contract value", "Renewal rate", "SLA compliance", "Gross margin"],
    setupNotes: ["Board-ready reporting", "Approval thresholds", "Monthly photos + site notes"],
  },
  {
    type: "Offline",
    name: "Yard signs / truck wraps / neighborhood mailers",
    whyItMatters: "Creates local ‘you’ve seen them’ trust; boosts map conversions.",
    primaryKPIs: ["Calls by neighborhood", "Direct traffic", "Brand searches"],
    setupNotes: ["QR booking", "Service-area targeting", "Seasonal messaging"],
  },
];