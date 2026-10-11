export type ContentCategory = 
  | "Irrigation" | "Drainage" | "Hardscapes" | "OutdoorLiving" 
  | "PoolArea" | "Lighting" | "Maintenance" | "Commercial" 
  | "Luxury" | "Seasonal" | "Local";

export type BlogPost = {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  category: ContentCategory;
  tags: string[];
  shortAnswer: string;
  publishMonth: string;
  relatedServiceSlugs: string[];
  relatedLocationSlugs: string[];
  relatedGuideSlugs: string[];
  imageBrief: { alt: string; filename: string };
};

export type ContentHub = {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  category: ContentCategory;
  introCopy: string;
  featuredPostSlugs: string[];
  relatedServiceSlugs: string[];
  relatedLocationSlugs: string[];
  faqSlugs?: string[];
};

export type LocalGuide = {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  locationSlug: string;
  category: ContentCategory;
  introCopy: string;
  commonProblems: string[];
  seasonalNotes: string[];
  relatedServiceSlugs: string[];
  faqSlugs?: string[];
};

export type FAQEntry = {
  slug: string;
  question: string;
  shortAnswer: string;
  category: ContentCategory;
  relatedServiceSlugs: string[];
  aeoKeywords: string[];
};

export type AEOBlock = {
  slug: string;
  question: string;
  shortAnswer: string;
  commonCauses: string[];
  whenToCall: string;
  whatToDoNext: string;
  relatedQuestions: string[];
  category: ContentCategory;
};

export type SeasonalCalendarItem = {
  month: string;
  theme: string;
  blogSlugs: string[];
  servicePromotionSlugs: string[];
  gbpPostIdea: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-sprinkler-zone-not-working",
    title: "Why Your Sprinkler Zone Is Not Working",
    metaDescription: "Troubleshoot why a single sprinkler zone isn't turning on. Learn about solenoid failures, wiring issues, and valve problems in Charlotte NC.",
    h1: "Why Your Sprinkler Zone Is Not Working",
    category: "Irrigation",
    tags: ["Repair", "Troubleshooting", "Sprinklers"],
    shortAnswer: "A single sprinkler zone usually fails due to a faulty solenoid, a broken wire, or a stuck valve diaphragm. If other zones work, the issue is specific to that zone's hardware or electrical connection.",
    publishMonth: "2026-03",
    relatedServiceSlugs: ["sprinkler-repair", "smart-controller-upgrade"],
    relatedLocationSlugs: ["charlotte", "harrisburg", "concord"],
    relatedGuideSlugs: ["irrigation-learning-center"],
    imageBrief: { alt: "Technician inspecting a sprinkler valve box", filename: "sprinkler-zone-repair.jpg" }
  },
  {
    slug: "why-sprinkler-wont-shut-off",
    title: "Why Your Sprinkler System Won't Shut Off",
    metaDescription: "Is your sprinkler system running constantly? Discover the common causes like stuck valves or controller glitches and how to stop the water waste.",
    h1: "Why Your Sprinkler System Won't Shut Off",
    category: "Irrigation",
    tags: ["Repair", "Emergency", "Water Waste"],
    shortAnswer: "Sprinklers that won't shut off are typically caused by a mechanical failure in the valve (like debris in the diaphragm) or a controller malfunction. Turn off the main water supply immediately to prevent flooding.",
    publishMonth: "2026-07",
    relatedServiceSlugs: ["sprinkler-repair"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["irrigation-learning-center"],
    imageBrief: { alt: "Water pooling around a sprinkler head that won't stop", filename: "sprinkler-wont-shut-off.jpg" }
  },
  {
    slug: "how-to-tell-if-irrigation-leak",
    title: "How to Tell If Your Irrigation System Has a Leak",
    metaDescription: "High water bills or soggy spots? Learn the signs of an underground irrigation leak and how to locate it before it damages your landscape.",
    h1: "How to Tell If Your Irrigation System Has a Leak",
    category: "Irrigation",
    tags: ["Maintenance", "Leak Detection", "Water Bill"],
    shortAnswer: "Signs of an irrigation leak include unexplained spikes in your water bill, persistent soggy areas in the lawn, and low water pressure in certain zones. Check your water meter while the system is off to confirm.",
    publishMonth: "2026-05",
    relatedServiceSlugs: ["sprinkler-repair", "irrigation-system-installation"],
    relatedLocationSlugs: ["charlotte", "cornelius"],
    relatedGuideSlugs: ["irrigation-learning-center"],
    imageBrief: { alt: "Soggy patch of grass indicating an underground leak", filename: "irrigation-leak-signs.jpg" }
  },
  {
    slug: "sprinkler-controller-needs-replacement",
    title: "Signs Your Sprinkler Controller Needs Replacement",
    metaDescription: "Is your irrigation timer acting up? Learn when it's time to upgrade to a modern smart controller for better efficiency and control.",
    h1: "Signs Your Sprinkler Controller Needs Replacement",
    category: "Irrigation",
    tags: ["Upgrades", "Technology", "Smart Home"],
    shortAnswer: "Replace your controller if it loses programming frequently, has a blank display, fails to trigger zones, or if you want to save up to 50% on water with weather-based smart technology.",
    publishMonth: "2026-02",
    relatedServiceSlugs: ["smart-controller-upgrade", "sprinkler-repair"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["smart-irrigation-guide"],
    imageBrief: { alt: "Old mechanical sprinkler timer vs new smart controller", filename: "sprinkler-controller-upgrade.jpg" }
  },
  {
    slug: "smart-irrigation-controllers-worth-it",
    title: "Smart Irrigation Controllers: Are They Worth It?",
    metaDescription: "Discover the ROI of smart irrigation controllers. Learn how weather-based scheduling saves money and improves lawn health in North Carolina.",
    h1: "Smart Irrigation Controllers: Are They Worth It?",
    category: "Irrigation",
    tags: ["ROI", "Sustainability", "Smart Home"],
    shortAnswer: "Yes, smart controllers are worth it for most Charlotte homeowners. They typically pay for themselves within 2 seasons through water savings and prevent overwatering during our humid NC summers.",
    publishMonth: "2026-01",
    relatedServiceSlugs: ["smart-controller-upgrade"],
    relatedLocationSlugs: ["charlotte", "huntersville", "cornelius"],
    relatedGuideSlugs: ["smart-irrigation-guide"],
    imageBrief: { alt: "Homeowner using a smartphone app to control sprinklers", filename: "smart-irrigation-app.jpg" }
  },
  {
    slug: "how-often-irrigation-inspection",
    title: "How Often Should Irrigation Systems Be Inspected?",
    metaDescription: "Prevent costly repairs with regular irrigation checkups. Learn the ideal inspection schedule for Charlotte area sprinkler systems.",
    h1: "How Often Should Irrigation Systems Be Inspected?",
    category: "Irrigation",
    tags: ["Maintenance", "Prevention", "Checklist"],
    shortAnswer: "We recommend professional inspections twice a year: once during spring startup and again in mid-summer to adjust for heat. Monthly visual checks by homeowners are also encouraged.",
    publishMonth: "2026-04",
    relatedServiceSlugs: ["sprinkler-repair"],
    relatedLocationSlugs: ["charlotte", "concord"],
    relatedGuideSlugs: ["irrigation-learning-center"],
    imageBrief: { alt: "Technician checking sprinkler head alignment", filename: "irrigation-inspection.jpg" }
  },
  {
    slug: "spring-irrigation-startup-checklist",
    title: "Spring Irrigation Startup Checklist for Charlotte Homes",
    metaDescription: "Get your sprinkler system ready for the growing season. Follow our professional checklist for a safe and efficient spring startup.",
    h1: "Spring Irrigation Startup Checklist for Charlotte Homes",
    category: "Irrigation",
    tags: ["Spring", "Maintenance", "Checklist"],
    shortAnswer: "A proper spring startup involves slowly pressurizing the main line, checking every head for clogs or damage, cleaning filters, and programming the controller for spring weather patterns.",
    publishMonth: "2026-03",
    relatedServiceSlugs: ["sprinkler-repair"],
    relatedLocationSlugs: ["charlotte", "harrisburg", "concord"],
    relatedGuideSlugs: ["seasonal-maintenance-guide"],
    imageBrief: { alt: "Spring flowers with a sprinkler running in the background", filename: "spring-startup.jpg" }
  },
  {
    slug: "irrigation-winterization-guide",
    title: "Irrigation Winterization Guide for Charlotte-Area Homes",
    metaDescription: "Protect your pipes from freezing. Learn why winterization is essential for Charlotte irrigation systems and when to schedule it.",
    h1: "Irrigation Winterization Guide for Charlotte-Area Homes",
    category: "Irrigation",
    tags: ["Winter", "Maintenance", "Protection"],
    shortAnswer: "Winterization involves blowing out all water from the lines using compressed air to prevent freeze damage. In Charlotte, this should be completed by late November before the first hard freeze.",
    publishMonth: "2026-10",
    relatedServiceSlugs: ["sprinkler-repair"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["seasonal-maintenance-guide"],
    imageBrief: { alt: "Compressed air blowing water out of a sprinkler head", filename: "irrigation-winterization.jpg" }
  },
  {
    slug: "why-lawn-dry-spots",
    title: "Why Your Lawn Has Dry Spots Even Though You Water It",
    metaDescription: "Frustrated by brown patches? Discover why your irrigation might be missing spots and how to achieve head-to-head coverage.",
    h1: "Why Your Lawn Has Dry Spots Even Though You Water It",
    category: "Irrigation",
    tags: ["Lawn Care", "Troubleshooting", "Coverage"],
    shortAnswer: "Dry spots are usually caused by poor 'head-to-head' coverage, clogged nozzles, or sunken heads that can't clear the grass height. It can also indicate localized soil compaction or pests.",
    publishMonth: "2026-06",
    relatedServiceSlugs: ["sprinkler-repair"],
    relatedLocationSlugs: ["charlotte", "concord"],
    relatedGuideSlugs: ["irrigation-learning-center"],
    imageBrief: { alt: "Brown patch in an otherwise green lawn", filename: "lawn-dry-spots.jpg" }
  },
  {
    slug: "sprinkler-repair-cost-charlotte",
    title: "Sprinkler Repair Cost Factors in Charlotte NC",
    metaDescription: "Wondering how much a sprinkler repair costs? We break down the factors that influence pricing for irrigation service in the Charlotte area.",
    h1: "Sprinkler Repair Cost Factors in Charlotte NC",
    category: "Irrigation",
    tags: ["Cost", "Pricing", "Repair"],
    shortAnswer: "Sprinkler repair costs vary by scope, including parts like heads, valves, or controllers, and the labor required for diagnostic and excavation. Most minor repairs fall within a standard service call range.",
    publishMonth: "2026-04",
    relatedServiceSlugs: ["sprinkler-repair"],
    relatedLocationSlugs: ["charlotte", "harrisburg", "concord"],
    relatedGuideSlugs: ["irrigation-learning-center"],
    imageBrief: { alt: "Technician writing an estimate for a repair", filename: "repair-cost-factors.jpg" }
  },
  {
    slug: "irrigation-installation-cost-charlotte",
    title: "Irrigation Installation Cost Factors in Charlotte NC",
    metaDescription: "Planning a new sprinkler system? Learn what drives the cost of irrigation installation, from lot size to zone count and smart features.",
    h1: "Irrigation Installation Cost Factors in Charlotte NC",
    category: "Irrigation",
    tags: ["Cost", "Installation", "Investment"],
    shortAnswer: "Installation costs are driven by the number of zones, total square footage, soil conditions (like clay or rock), and the quality of components like smart controllers and high-efficiency nozzles.",
    publishMonth: "2026-02",
    relatedServiceSlugs: ["irrigation-system-installation"],
    relatedLocationSlugs: ["charlotte", "huntersville", "cornelius"],
    relatedGuideSlugs: ["irrigation-learning-center"],
    imageBrief: { alt: "New irrigation system being installed in a yard", filename: "installation-cost-factors.jpg" }
  },
  {
    slug: "repair-vs-replace-irrigation",
    title: "When to Repair vs Replace an Irrigation System",
    metaDescription: "Is your old sprinkler system a money pit? Learn how to decide between fixing individual components or investing in a full system replacement.",
    h1: "When to Repair vs Replace an Irrigation System",
    category: "Irrigation",
    tags: ["Repair", "Replacement", "Decision Making"],
    shortAnswer: "Consider replacement if your system is over 15 years old, has frequent main line leaks, or uses outdated technology that wastes significant water. Minor head or valve issues are usually better to repair.",
    publishMonth: "2026-08",
    relatedServiceSlugs: ["sprinkler-repair", "irrigation-system-installation"],
    relatedLocationSlugs: ["charlotte", "concord"],
    relatedGuideSlugs: ["irrigation-learning-center"],
    imageBrief: { alt: "Old rusty irrigation valve vs a new clean installation", filename: "repair-vs-replace.jpg" }
  },
  {
    slug: "best-irrigation-upgrades-new-sod",
    title: "Best Irrigation Upgrades for New Sod",
    metaDescription: "Protect your investment in new grass. Discover the essential irrigation upgrades to ensure your new sod thrives in the Charlotte heat.",
    h1: "Best Irrigation Upgrades for New Sod",
    category: "Irrigation",
    tags: ["Sod", "Upgrades", "Lawn Care"],
    shortAnswer: "For new sod, we recommend high-efficiency rotary nozzles for uniform coverage and a smart controller with a 'new sod' program to automate the frequent watering required during the first 30 days.",
    publishMonth: "2026-09",
    relatedServiceSlugs: ["smart-controller-upgrade", "irrigation-system-installation"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["irrigation-learning-center"],
    imageBrief: { alt: "Fresh green sod being watered by a sprinkler", filename: "new-sod-irrigation.jpg" }
  },
  {
    slug: "smart-controllers-reduce-water-waste",
    title: "How Smart Controllers Help Reduce Water Waste",
    metaDescription: "Stop watering the sidewalk. Learn how smart irrigation technology uses local weather data to eliminate overwatering and save resources.",
    h1: "How Smart Controllers Help Reduce Water Waste",
    category: "Irrigation",
    tags: ["Sustainability", "Technology", "Water Conservation"],
    shortAnswer: "Smart controllers use real-time weather data to skip cycles when rain is forecast and adjust run times based on evaporation rates, preventing the common 'watering in the rain' scenario.",
    publishMonth: "2026-05",
    relatedServiceSlugs: ["smart-controller-upgrade"],
    relatedLocationSlugs: ["charlotte", "cornelius"],
    relatedGuideSlugs: ["smart-irrigation-guide"],
    imageBrief: { alt: "Infographic showing water savings with smart tech", filename: "reduce-water-waste.jpg" }
  },
  {
    slug: "broken-sprinkler-head-what-to-do",
    title: "What to Do If a Sprinkler Head Breaks",
    metaDescription: "Mower hit a head? Learn the immediate steps to take when a sprinkler head breaks and how to prevent geysers in your yard.",
    h1: "What to Do If a Sprinkler Head Breaks",
    category: "Irrigation",
    tags: ["Repair", "DIY", "Maintenance"],
    shortAnswer: "If a head breaks, turn off that zone at the controller. You can often unscrew the broken top and replace it with a matching model, but ensure no dirt enters the line during the process.",
    publishMonth: "2026-06",
    relatedServiceSlugs: ["sprinkler-repair"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["irrigation-learning-center"],
    imageBrief: { alt: "Broken sprinkler head spraying water everywhere", filename: "broken-sprinkler-head.jpg" }
  },
  {
    slug: "why-yard-holds-water",
    title: "Why Your Yard Holds Water After Rain",
    metaDescription: "Tired of a swampy backyard? Discover the common causes of standing water in Charlotte yards, from heavy clay soil to poor grading.",
    h1: "Why Your Yard Holds Water After Rain",
    category: "Drainage",
    tags: ["Standing Water", "Soil", "Grading"],
    shortAnswer: "Standing water is usually caused by heavy clay soils that don't absorb water, low spots in the yard's grading, or runoff from neighboring properties and downspouts.",
    publishMonth: "2026-03",
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"],
    relatedLocationSlugs: ["charlotte", "harrisburg", "concord"],
    relatedGuideSlugs: ["drainage-learning-center"],
    imageBrief: { alt: "Large puddle in a backyard after a storm", filename: "yard-standing-water.jpg" }
  },
  {
    slug: "french-drain-vs-catch-basin",
    title: "French Drain vs Catch Basin: Which Is Better?",
    metaDescription: "Confused about drainage options? We compare French drains and catch basins to help you choose the right solution for your yard's water issues.",
    h1: "French Drain vs Catch Basin: Which Is Better?",
    category: "Drainage",
    tags: ["Solutions", "Comparison", "French Drain"],
    shortAnswer: "French drains are best for managing groundwater and soggy soil over a large area, while catch basins are designed to quickly collect large volumes of surface water from low spots or downspouts.",
    publishMonth: "2026-04",
    relatedServiceSlugs: ["french-drain-installation", "drainage-assessment"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["french-drain-guide-center"],
    imageBrief: { alt: "Diagram comparing a French drain and a catch basin", filename: "french-drain-vs-catch-basin.jpg" }
  },
  {
    slug: "signs-yard-needs-drainage",
    title: "Signs Your Yard Needs Drainage Work",
    metaDescription: "Don't ignore the warning signs. Learn how to spot drainage problems like foundation cracks, mold, and dying grass before they cause major damage.",
    h1: "Signs Your Yard Needs Drainage Work",
    category: "Drainage",
    tags: ["Warning Signs", "Maintenance", "Prevention"],
    shortAnswer: "Key signs include water pooling for more than 24 hours, basement or crawlspace dampness, soil erosion, and 'spongy' turf that never seems to dry out.",
    publishMonth: "2026-02",
    relatedServiceSlugs: ["drainage-assessment"],
    relatedLocationSlugs: ["charlotte", "concord"],
    relatedGuideSlugs: ["drainage-learning-center"],
    imageBrief: { alt: "Erosion channel in a yard indicating drainage issues", filename: "drainage-warning-signs.jpg" }
  },
  {
    slug: "water-pooling-near-foundation",
    title: "Water Pooling Near Foundation: What It Could Mean",
    metaDescription: "Protect your home's structural integrity. Learn why water near your foundation is a serious issue and how to redirect it safely.",
    h1: "Water Pooling Near Foundation: What It Could Mean",
    category: "Drainage",
    tags: ["Foundation", "Safety", "Home Protection"],
    shortAnswer: "Water near the foundation can lead to hydrostatic pressure, causing basement leaks, foundation shifts, and mold. It's critical to redirect this water at least 10 feet away from the home.",
    publishMonth: "2026-05",
    relatedServiceSlugs: ["drainage-assessment", "french-drain-installation"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["drainage-learning-center"],
    imageBrief: { alt: "Water sitting against a brick foundation wall", filename: "foundation-water-pooling.jpg" }
  },
  {
    slug: "downspout-drainage-affects-yard",
    title: "How Downspout Drainage Affects Your Yard",
    metaDescription: "Are your gutters dumping water in the wrong place? Learn how to properly manage downspout runoff to prevent yard erosion and flooding.",
    h1: "How Downspout Drainage Affects Your Yard",
    category: "Drainage",
    tags: ["Gutters", "Runoff", "Erosion"],
    shortAnswer: "Unmanaged downspouts can dump hundreds of gallons of water in one spot, causing severe erosion and foundation issues. Piping downspouts underground to a bubbler or dry well is the most effective solution.",
    publishMonth: "2026-06",
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"],
    relatedLocationSlugs: ["charlotte", "cornelius"],
    relatedGuideSlugs: ["drainage-learning-center"],
    imageBrief: { alt: "Downspout extension redirecting water away from a house", filename: "downspout-drainage.jpg" }
  },
  {
    slug: "why-patio-holds-water",
    title: "Why Your Patio Holds Water",
    metaDescription: "Is your patio a puddle? Discover why hardscapes fail to drain properly and how to fix pitch issues or add integrated drainage.",
    h1: "Why Your Patio Holds Water",
    category: "Drainage",
    tags: ["Hardscapes", "Patio", "Repair"],
    shortAnswer: "Patios hold water if they weren't built with a proper 1-2% slope away from the house, or if the surrounding soil has settled and created a 'bowl' effect that traps runoff.",
    publishMonth: "2026-07",
    relatedServiceSlugs: ["paver-patio-installation", "drainage-assessment"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["hardscape-patio-guide"],
    imageBrief: { alt: "Water pooling on a stone paver patio", filename: "patio-water-issues.jpg" }
  },
  {
    slug: "poor-drainage-damages-lawns-hardscapes",
    title: "How Poor Drainage Damages Lawns and Hardscapes",
    metaDescription: "Drainage issues are more than just a nuisance. Learn how excess water destroys turf, rots plant roots, and causes patios to shift.",
    h1: "How Poor Drainage Damages Lawns and Hardscapes",
    category: "Drainage",
    tags: ["Damage", "Lawn Care", "Hardscapes"],
    shortAnswer: "Excess water deprives roots of oxygen, leading to root rot and fungal diseases in lawns. For hardscapes, it can wash away the base material, causing pavers to sink or walls to lean.",
    publishMonth: "2026-08",
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"],
    relatedLocationSlugs: ["charlotte", "concord"],
    relatedGuideSlugs: ["drainage-learning-center"],
    imageBrief: { alt: "Cracked patio and dying grass due to water issues", filename: "drainage-damage.jpg" }
  },
  {
    slug: "french-drain-cost-charlotte",
    title: "French Drain Cost Factors in Charlotte NC",
    metaDescription: "Budgeting for a drainage project? We break down the costs of French drain installation in Charlotte, from materials to labor and site access.",
    h1: "French Drain Cost Factors in Charlotte NC",
    category: "Drainage",
    tags: ["Cost", "Pricing", "French Drain"],
    shortAnswer: "French drain costs depend on the length of the trench, the depth required, the type of aggregate used, and whether the discharge point requires a sump pump or pop-up emitter.",
    publishMonth: "2026-04",
    relatedServiceSlugs: ["french-drain-installation"],
    relatedLocationSlugs: ["charlotte", "harrisburg", "concord"],
    relatedGuideSlugs: ["french-drain-guide-center"],
    imageBrief: { alt: "Technician measuring a yard for a French drain", filename: "french-drain-cost.jpg" }
  },
  {
    slug: "yard-drainage-soggy-backyard",
    title: "Yard Drainage Solutions for Soggy Backyards",
    metaDescription: "Turn your swamp back into a yard. Explore the best drainage solutions for soggy backyards in the Charlotte metro area.",
    h1: "Yard Drainage Solutions for Soggy Backyards",
    category: "Drainage",
    tags: ["Solutions", "Backyard", "Soggy Soil"],
    shortAnswer: "Solutions range from simple regrading and downspout extensions to more complex systems like French drains, dry creek beds, or rain gardens that manage water naturally.",
    publishMonth: "2026-03",
    relatedServiceSlugs: ["drainage-assessment", "french-drain-installation"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["drainage-learning-center"],
    imageBrief: { alt: "Beautifully landscaped yard with integrated drainage", filename: "soggy-backyard-fix.jpg" }
  },
  {
    slug: "pool-area-drainage-problems",
    title: "Pool-Area Drainage Problems and Fixes",
    metaDescription: "Keep your pool water where it belongs. Learn how to manage runoff around pool decks to prevent erosion and equipment damage.",
    h1: "Pool-Area Drainage Problems and Fixes",
    category: "Drainage",
    tags: ["Pool", "Solutions", "Runoff"],
    shortAnswer: "Pool areas often need deck drains or perimeter French drains to prevent chlorinated water from killing nearby plants and to stop yard runoff from entering the pool during heavy rain.",
    publishMonth: "2026-05",
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"],
    relatedLocationSlugs: ["charlotte", "cornelius"],
    relatedGuideSlugs: ["pool-landscaping-guide"],
    imageBrief: { alt: "Drainage channel installed next to a pool deck", filename: "pool-drainage-fix.jpg" }
  },
  {
    slug: "drainage-after-heavy-rain",
    title: "Drainage Issues After Heavy Rain",
    metaDescription: "Does your yard become a lake after a Charlotte thunderstorm? Learn how to evaluate your drainage performance during and after heavy rain.",
    h1: "Drainage Issues After Heavy Rain",
    category: "Drainage",
    tags: ["Stormwater", "Weather", "Evaluation"],
    shortAnswer: "If water remains for more than 24-48 hours after a heavy rain, your yard has a drainage failure. This is the best time to document the flow patterns to help a professional design a solution.",
    publishMonth: "2026-07",
    relatedServiceSlugs: ["drainage-assessment"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["drainage-learning-center"],
    imageBrief: { alt: "Heavy rain falling on a flooded backyard", filename: "heavy-rain-drainage.jpg" }
  },
  {
    slug: "regrading-vs-french-drain",
    title: "When Regrading Is Better Than a French Drain",
    metaDescription: "Sometimes the simplest solution is best. Learn when changing the slope of your yard is more effective than installing an underground drain.",
    h1: "When Regrading Is Better Than a French Drain",
    category: "Drainage",
    tags: ["Grading", "Comparison", "Solutions"],
    shortAnswer: "Regrading is preferred when there is enough fall to move water away naturally using gravity. French drains are used when the terrain is flat or when water must be moved through a specific narrow path.",
    publishMonth: "2026-09",
    relatedServiceSlugs: ["drainage-assessment", "french-drain-installation"],
    relatedLocationSlugs: ["charlotte", "concord"],
    relatedGuideSlugs: ["drainage-learning-center"],
    imageBrief: { alt: "Skid steer loader regrading a backyard", filename: "regrading-vs-drain.jpg" }
  },
  {
    slug: "drainage-around-retaining-walls",
    title: "Drainage Problems Around Retaining Walls",
    metaDescription: "Prevent wall failure. Learn why drainage is the most important part of any retaining wall and how to spot signs of hydrostatic pressure.",
    h1: "Drainage Problems Around Retaining Walls",
    category: "Drainage",
    tags: ["Retaining Walls", "Safety", "Engineering"],
    shortAnswer: "Retaining walls fail most often due to water buildup behind the wall. Proper drainage involves gravel backfill, perforated pipe (weep holes), and redirecting surface water away from the wall's top.",
    publishMonth: "2026-10",
    relatedServiceSlugs: ["drainage-assessment", "french-drain-installation"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["hardscape-patio-guide"],
    imageBrief: { alt: "Retaining wall with visible weep holes for drainage", filename: "retaining-wall-drainage.jpg" }
  },
  {
    slug: "spot-erosion-early",
    title: "How to Spot Erosion Before It Gets Worse",
    metaDescription: "Is your soil washing away? Learn the early signs of erosion and how to stabilize your landscape with plants, mulch, or drainage systems.",
    h1: "How to Spot Erosion Before It Gets Worse",
    category: "Drainage",
    tags: ["Erosion", "Prevention", "Soil Health"],
    shortAnswer: "Look for exposed tree roots, small gullies forming in mulch beds, and sediment deposits on your driveway or sidewalk after rain. These indicate that water is moving too fast across your soil.",
    publishMonth: "2026-11",
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["drainage-learning-center"],
    imageBrief: { alt: "Exposed roots on a hillside due to soil erosion", filename: "spot-erosion.jpg" }
  },
  {
    slug: "hiring-drainage-contractor",
    title: "Questions to Ask Before Hiring a Drainage Contractor",
    metaDescription: "Don't hire the wrong pro. Use our checklist of essential questions to ensure your drainage contractor has the expertise to fix your yard right.",
    h1: "Questions to Ask Before Hiring a Drainage Contractor",
    category: "Drainage",
    tags: ["Hiring", "Checklist", "Professionalism"],
    shortAnswer: "Ask about their experience with Charlotte's clay soil, if they provide a detailed site plan, how they handle utility marking, and what kind of warranty they offer on their work.",
    publishMonth: "2026-01",
    relatedServiceSlugs: ["drainage-assessment"],
    relatedLocationSlugs: ["charlotte", "concord", "harrisburg"],
    relatedGuideSlugs: ["drainage-learning-center"],
    imageBrief: { alt: "Homeowner talking to a drainage expert in their yard", filename: "hiring-contractor.jpg" }
  },
  {
    slug: "paver-patio-cost-charlotte",
    title: "Paver Patio Cost Factors in Charlotte NC",
    metaDescription: "Planning a new patio? Learn what influences the price of a paver patio in Charlotte, from material choice to site preparation.",
    h1: "Paver Patio Cost Factors in Charlotte NC",
    category: "Hardscapes",
    tags: ["Cost", "Pricing", "Patio"],
    shortAnswer: "Costs are determined by the square footage, the type of pavers (concrete vs natural stone), the complexity of the pattern, and the amount of excavation and base material required.",
    publishMonth: "2026-02",
    relatedServiceSlugs: ["paver-patio-installation"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["hardscape-patio-guide"],
    imageBrief: { alt: "Beautifully finished paver patio with outdoor furniture", filename: "paver-patio-cost.jpg" }
  },
  {
    slug: "paver-vs-concrete-patio",
    title: "Paver Patio vs Concrete Patio",
    metaDescription: "Which is better for your backyard? We compare pavers and poured concrete on durability, aesthetics, and long-term value.",
    h1: "Paver Patio vs Concrete Patio",
    category: "Hardscapes",
    tags: ["Comparison", "Patio", "Investment"],
    shortAnswer: "Pavers offer superior durability and aesthetics, as they won't crack like large concrete slabs and are easier to repair. While concrete has a lower initial cost, pavers provide better long-term value.",
    publishMonth: "2026-03",
    relatedServiceSlugs: ["paver-patio-installation"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["hardscape-patio-guide"],
    imageBrief: { alt: "Side-by-side comparison of a paver patio and a concrete slab", filename: "paver-vs-concrete.jpg" }
  },
  {
    slug: "why-patio-drainage-matters",
    title: "Why Patio Drainage Matters",
    metaDescription: "Don't let your new patio flood. Learn why integrated drainage is essential for the longevity and safety of your hardscape project.",
    h1: "Why Patio Drainage Matters",
    category: "Hardscapes",
    tags: ["Drainage", "Construction", "Longevity"],
    shortAnswer: "Proper drainage prevents water from sitting on the surface, which can cause slippery algae growth, and stops water from undermining the base, which leads to sinking and shifting pavers.",
    publishMonth: "2026-04",
    relatedServiceSlugs: ["paver-patio-installation", "drainage-assessment"],
    relatedLocationSlugs: ["charlotte", "concord"],
    relatedGuideSlugs: ["hardscape-patio-guide"],
    imageBrief: { alt: "Integrated drain line being installed under a patio", filename: "patio-drainage.jpg" }
  },
  {
    slug: "fire-pit-planning-guide",
    title: "Fire Pit Patio Planning Guide",
    metaDescription: "Create the perfect gathering spot. Learn about fire pit placement, safety considerations, and material options for your Charlotte home.",
    h1: "Fire Pit Patio Planning Guide",
    category: "Hardscapes",
    tags: ["Fire Pit", "Planning", "Outdoor Living"],
    shortAnswer: "When planning a fire pit, consider wind direction, local fire codes, and ensure there is at least 7-10 feet of clearance for seating around the fire feature.",
    publishMonth: "2026-09",
    relatedServiceSlugs: ["fire-pit-installation", "paver-patio-installation"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["outdoor-living-guide"],
    imageBrief: { alt: "Cozy fire pit area with stone seating", filename: "fire-pit-planning.jpg" }
  },
  {
    slug: "common-hardscape-mistakes",
    title: "Common Hardscape Mistakes to Avoid",
    metaDescription: "Avoid a backyard disaster. Learn the most common hardscape errors, from poor base preparation to ignoring drainage.",
    h1: "Common Hardscape Mistakes to Avoid",
    category: "Hardscapes",
    tags: ["Mistakes", "Construction", "Quality"],
    shortAnswer: "The biggest mistakes are insufficient base compaction, using the wrong type of sand, and failing to plan for water runoff, all of which lead to premature project failure.",
    publishMonth: "2026-05",
    relatedServiceSlugs: ["paver-patio-installation"],
    relatedLocationSlugs: ["charlotte", "cornelius"],
    relatedGuideSlugs: ["hardscape-patio-guide"],
    imageBrief: { alt: "Example of a failing patio with uneven pavers", filename: "hardscape-mistakes.jpg" }
  },
  {
    slug: "backyard-transformation-charlotte",
    title: "Backyard Transformation Ideas for Charlotte Homes",
    metaDescription: "Get inspired! Explore stunning backyard makeovers in the Charlotte area that combine patios, kitchens, and lighting.",
    h1: "Backyard Transformation Ideas for Charlotte Homes",
    category: "OutdoorLiving",
    tags: ["Inspiration", "Design", "Transformation"],
    shortAnswer: "Transformations often focus on creating 'outdoor rooms' with defined areas for dining, lounging, and cooking, tied together with consistent materials and professional lighting.",
    publishMonth: "2026-03",
    relatedServiceSlugs: ["paver-patio-installation", "outdoor-kitchen", "landscape-lighting-installation"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["outdoor-living-guide"],
    imageBrief: { alt: "Before and after photo of a backyard renovation", filename: "backyard-transformation.jpg" }
  },
  {
    slug: "outdoor-kitchen-planning-guide",
    title: "Outdoor Kitchen Planning Guide",
    metaDescription: "Cook like a pro outdoors. Learn about layout, appliance selection, and utility requirements for your new outdoor kitchen.",
    h1: "Outdoor Kitchen Planning Guide",
    category: "OutdoorLiving",
    tags: ["Outdoor Kitchen", "Planning", "Luxury"],
    shortAnswer: "A successful outdoor kitchen requires careful planning of the 'work triangle,' durable weather-resistant materials, and proper placement of gas, water, and electrical lines.",
    publishMonth: "2026-04",
    relatedServiceSlugs: ["outdoor-kitchen"],
    relatedLocationSlugs: ["charlotte", "cornelius"],
    relatedGuideSlugs: ["outdoor-living-guide"],
    imageBrief: { alt: "Modern outdoor kitchen with stainless steel appliances", filename: "outdoor-kitchen-guide.jpg" }
  },
  {
    slug: "outdoor-fireplace-vs-fire-pit",
    title: "Outdoor Fireplace vs Fire Pit",
    metaDescription: "Which fire feature is right for you? We compare fireplaces and fire pits on cost, ambiance, and space requirements.",
    h1: "Outdoor Fireplace vs Fire Pit",
    category: "OutdoorLiving",
    tags: ["Comparison", "Fire Feature", "Design"],
    shortAnswer: "Fireplaces offer a grand focal point and wind protection, while fire pits are more social, allowing people to gather all the way around the flames at a lower price point.",
    publishMonth: "2026-10",
    relatedServiceSlugs: ["fire-pit-installation"],
    relatedLocationSlugs: ["charlotte", "concord"],
    relatedGuideSlugs: ["outdoor-living-guide"],
    imageBrief: { alt: "Outdoor fireplace and fire pit shown in different settings", filename: "fireplace-vs-firepit.jpg" }
  },
  {
    slug: "how-to-phase-backyard-project",
    title: "How to Phase a Backyard Project",
    metaDescription: "Dream big, build smart. Learn how to break your large outdoor living project into manageable phases over several years.",
    h1: "How to Phase a Backyard Project",
    category: "OutdoorLiving",
    tags: ["Budgeting", "Planning", "Phasing"],
    shortAnswer: "Phase 1 should always include underground infrastructure like drainage and utility lines. Subsequent phases can add the patio, then the kitchen, and finally lighting and landscaping.",
    publishMonth: "2026-01",
    relatedServiceSlugs: ["paver-patio-installation", "drainage-assessment"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["outdoor-living-guide"],
    imageBrief: { alt: "Master plan drawing showing different project phases", filename: "phasing-project.jpg" }
  },
  {
    slug: "outdoor-living-mistakes",
    title: "Outdoor Living Mistakes to Avoid",
    metaDescription: "Don't regret your design. Learn the top outdoor living errors, from undersized patios to poor traffic flow.",
    h1: "Outdoor Living Mistakes to Avoid",
    category: "OutdoorLiving",
    tags: ["Mistakes", "Design", "Planning"],
    shortAnswer: "Common mistakes include making the patio too small for furniture, ignoring the sun's path, and failing to integrate the indoor and outdoor living spaces seamlessly.",
    publishMonth: "2026-05",
    relatedServiceSlugs: ["paver-patio-installation", "outdoor-kitchen"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["outdoor-living-guide"],
    imageBrief: { alt: "Cramped patio with furniture that doesn't fit", filename: "outdoor-living-mistakes.jpg" }
  },
  {
    slug: "pool-landscaping-ideas-charlotte",
    title: "Pool Landscaping Ideas for Charlotte Homes",
    metaDescription: "Create a private oasis. Discover the best plants and hardscape features for pool areas in the Charlotte climate.",
    h1: "Pool Landscaping Ideas for Charlotte Homes",
    category: "PoolArea",
    tags: ["Pool", "Design", "Plants"],
    shortAnswer: "Focus on low-debris plants to keep the pool clean, use non-slip pavers for safety, and add privacy screening with evergreens or decorative fencing.",
    publishMonth: "2026-05",
    relatedServiceSlugs: ["paver-patio-installation", "landscape-lighting-installation"],
    relatedLocationSlugs: ["charlotte", "cornelius"],
    relatedGuideSlugs: ["pool-landscaping-guide"],
    imageBrief: { alt: "Tropical-style landscaping around a backyard pool", filename: "pool-landscaping-ideas.jpg" }
  },
  {
    slug: "pool-area-drainage-guide",
    title: "Pool Area Drainage Problems and Fixes",
    metaDescription: "Protect your pool and yard. Learn how to manage water flow around pool decks to prevent flooding and erosion.",
    h1: "Pool Area Drainage Problems and Fixes",
    category: "PoolArea",
    tags: ["Pool", "Drainage", "Maintenance"],
    shortAnswer: "Effective pool drainage uses channel drains and strategic grading to ensure splash-out and rainwater move away from the pool and the home's foundation.",
    publishMonth: "2026-06",
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["pool-landscaping-guide"],
    imageBrief: { alt: "Technician installing a deck drain near a pool", filename: "pool-drainage-guide.jpg" }
  },
  {
    slug: "hot-tub-patio-planning",
    title: "Hot Tub Patio Planning Guide",
    metaDescription: "Relax in style. Learn about the structural and utility requirements for adding a hot tub to your paver patio.",
    h1: "Hot Tub Patio Planning Guide",
    category: "PoolArea",
    tags: ["Hot Tub", "Patio", "Planning"],
    shortAnswer: "A hot tub requires a reinforced base to handle the weight, dedicated electrical service, and should be placed for easy access while maintaining privacy.",
    publishMonth: "2026-09",
    relatedServiceSlugs: ["paver-patio-installation"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["hardscape-patio-guide"],
    imageBrief: { alt: "Luxury hot tub integrated into a stone patio", filename: "hot-tub-patio.jpg" }
  },
  {
    slug: "landscape-lighting-ideas-charlotte",
    title: "Landscape Lighting Ideas for Charlotte Homes",
    metaDescription: "Light up the night. Explore creative landscape lighting techniques to enhance your home's beauty and security.",
    h1: "Landscape Lighting Ideas for Charlotte Homes",
    category: "Lighting",
    tags: ["Lighting", "Design", "Security"],
    shortAnswer: "Use a mix of uplighting for trees, path lighting for safety, and silhouetting to create depth and drama in your nighttime landscape.",
    publishMonth: "2026-08",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["landscape-lighting-guide"],
    imageBrief: { alt: "House illuminated with professional landscape lighting", filename: "lighting-ideas.jpg" }
  },
  {
    slug: "pathway-lighting-guide",
    title: "Pathway Lighting Guide",
    metaDescription: "Safety meets style. Learn how to properly space and place path lights to guide guests safely through your property.",
    h1: "Pathway Lighting Guide",
    category: "Lighting",
    tags: ["Lighting", "Safety", "Pathways"],
    shortAnswer: "Avoid the 'runway' look by staggering lights on both sides of the path and choosing fixtures that cast light downward to prevent glare.",
    publishMonth: "2026-09",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    relatedLocationSlugs: ["charlotte", "concord"],
    relatedGuideSlugs: ["landscape-lighting-guide"],
    imageBrief: { alt: "Staggered path lights along a stone walkway", filename: "pathway-lighting.jpg" }
  },
  {
    slug: "outdoor-lighting-mistakes",
    title: "Common Outdoor Lighting Mistakes",
    metaDescription: "Don't be left in the dark. Learn the top landscape lighting errors, from over-lighting to using poor quality fixtures.",
    h1: "Common Outdoor Lighting Mistakes",
    category: "Lighting",
    tags: ["Lighting", "Mistakes", "Quality"],
    shortAnswer: "The most common mistakes are using too many lights, poor fixture placement that causes glare, and choosing cheap solar lights that fail quickly.",
    publishMonth: "2026-11",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["landscape-lighting-guide"],
    imageBrief: { alt: "Example of poorly placed, glaring outdoor lights", filename: "lighting-mistakes.jpg" }
  },
  {
    slug: "hoa-irrigation-checklist",
    title: "HOA Irrigation Maintenance Checklist",
    metaDescription: "Keep your community green. A comprehensive irrigation maintenance guide for HOA boards and property managers.",
    h1: "HOA Irrigation Maintenance Checklist",
    category: "Commercial",
    tags: ["HOA", "Maintenance", "Checklist"],
    shortAnswer: "HOA systems require regular inspections of common areas, monitoring for leaks that drive up dues, and ensuring backflow preventers are tested annually as required by law.",
    publishMonth: "2026-03",
    relatedServiceSlugs: ["hoa-grounds-contract", "commercial-irrigation-maintenance"],
    relatedLocationSlugs: ["charlotte", "concord"],
    relatedGuideSlugs: ["commercial-hoa-guide"],
    imageBrief: { alt: "Large irrigation system in a community common area", filename: "hoa-irrigation.jpg" }
  },
  {
    slug: "commercial-irrigation-guide",
    title: "Commercial Irrigation Maintenance Guide",
    metaDescription: "Protect your commercial property. Learn the best practices for managing large-scale irrigation systems for business and retail sites.",
    h1: "Commercial Irrigation Maintenance Guide",
    category: "Commercial",
    tags: ["Commercial", "Maintenance", "Efficiency"],
    shortAnswer: "Commercial systems focus on high-durability components, water budget management, and minimizing liability by preventing water from spraying on sidewalks or parking lots.",
    publishMonth: "2026-04",
    relatedServiceSlugs: ["commercial-irrigation-maintenance"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    relatedGuideSlugs: ["commercial-hoa-guide"],
    imageBrief: { alt: "Commercial building with lush, well-watered landscaping", filename: "commercial-irrigation.jpg" }
  },
  {
    slug: "property-manager-outdoor-issues",
    title: "Common Property Manager Outdoor Issues",
    metaDescription: "Solve your outdoor headaches. We address the most frequent landscape and irrigation problems faced by property managers.",
    h1: "Common Property Manager Outdoor Issues",
    category: "Commercial",
    tags: ["Property Management", "Solutions", "Maintenance"],
    shortAnswer: "Property managers often deal with drainage complaints from tenants, high water bills from undetected leaks, and the need for reliable contractors who can handle large-scale repairs.",
    publishMonth: "2026-02",
    relatedServiceSlugs: ["hoa-grounds-contract", "drainage-assessment"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    relatedGuideSlugs: ["commercial-hoa-guide"],
    imageBrief: { alt: "Property manager inspecting a drainage issue", filename: "property-manager-issues.jpg" }
  },
  {
    slug: "luxury-backyard-design-charlotte",
    title: "Luxury Backyard Design Ideas in Charlotte",
    metaDescription: "Elevate your outdoor living. Explore high-end design trends for luxury estates in Ballantyne, SouthPark, and Myers Park.",
    h1: "Luxury Backyard Design Ideas in Charlotte",
    category: "Luxury",
    tags: ["Luxury", "Design", "Estate"],
    shortAnswer: "Luxury designs feature premium natural stone, custom water features, integrated smart technology, and multi-level living spaces designed for large-scale entertaining.",
    publishMonth: "2026-05",
    relatedServiceSlugs: ["paver-patio-installation", "outdoor-kitchen", "landscape-lighting-installation"],
    relatedLocationSlugs: ["charlotte"],
    relatedGuideSlugs: ["luxury-outdoor-guide"],
    imageBrief: { alt: "Stunning luxury backyard with pool and outdoor kitchen", filename: "luxury-design.jpg" }
  },
  {
    slug: "estate-drainage-planning",
    title: "Estate Drainage Planning Guide",
    metaDescription: "Protect your large property. Learn the complexities of drainage planning for expansive estates and multi-acre lots.",
    h1: "Estate Drainage Planning Guide",
    category: "Luxury",
    tags: ["Luxury", "Drainage", "Engineering"],
    shortAnswer: "Estate drainage requires a holistic approach, managing large volumes of runoff from multiple structures and expansive hardscapes while preserving the natural beauty of the land.",
    publishMonth: "2026-06",
    relatedServiceSlugs: ["drainage-assessment", "french-drain-installation"],
    relatedLocationSlugs: ["charlotte", "cornelius"],
    relatedGuideSlugs: ["luxury-outdoor-guide"],
    imageBrief: { alt: "Large estate with complex, hidden drainage systems", filename: "estate-drainage.jpg" }
  }
];

export const contentHubs: ContentHub[] = [
  {
    slug: "irrigation-learning-center",
    title: "Irrigation Learning Center",
    metaDescription: "Master your sprinkler system. Our comprehensive guide to irrigation repair, maintenance, and upgrades for Charlotte homeowners.",
    h1: "Irrigation Learning Center",
    category: "Irrigation",
    introCopy: "Welcome to the Elite Irrigation Learning Center. Whether you're troubleshooting a dry spot or planning a full system upgrade, our expert guides help you maintain a healthy, water-efficient lawn in the Charlotte metro area.",
    featuredPostSlugs: ["why-sprinkler-zone-not-working", "how-to-tell-if-irrigation-leak", "spring-irrigation-startup-checklist"],
    relatedServiceSlugs: ["sprinkler-repair", "irrigation-system-installation", "smart-controller-upgrade"],
    relatedLocationSlugs: ["charlotte", "harrisburg", "concord"],
    faqSlugs: ["do-you-repair-sprinkler-systems", "why-is-my-sprinkler-system-not-turning-on"]
  },
  {
    slug: "drainage-learning-center",
    title: "Drainage Learning Center",
    metaDescription: "Solve your yard water problems. Expert advice on French drains, catch basins, and grading for a dry, usable backyard.",
    h1: "Drainage Learning Center",
    category: "Drainage",
    introCopy: "Don't let standing water ruin your landscape. Our Drainage Learning Center provides the knowledge you need to identify issues and choose the right solutions for Charlotte's unique clay soil and heavy rain patterns.",
    featuredPostSlugs: ["why-yard-holds-water", "signs-yard-needs-drainage", "yard-drainage-soggy-backyard"],
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions", "french-drain-installation"],
    relatedLocationSlugs: ["charlotte", "harrisburg", "concord"],
    faqSlugs: ["do-you-install-french-drains", "what-causes-standing-water"]
  },
  {
    slug: "french-drain-guide-center",
    title: "French Drain Guide Center",
    metaDescription: "Everything you need to know about French drains. Learn how they work, what they cost, and if they're right for your Charlotte yard.",
    h1: "French Drain Guide Center",
    category: "Drainage",
    introCopy: "French drains are one of the most effective ways to manage groundwater. This specialized guide center dives deep into the engineering, installation, and maintenance of French drain systems in North Carolina.",
    featuredPostSlugs: ["french-drain-vs-catch-basin", "french-drain-cost-charlotte", "regrading-vs-french-drain"],
    relatedServiceSlugs: ["french-drain-installation", "drainage-assessment"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    faqSlugs: ["do-you-install-french-drains"]
  },
  {
    slug: "smart-irrigation-guide",
    title: "Smart Irrigation Guide Center",
    metaDescription: "Upgrade to the future of lawn care. Learn how smart controllers and high-efficiency nozzles save water and money.",
    h1: "Smart Irrigation Guide Center",
    category: "Irrigation",
    introCopy: "Technology is changing how we water our lawns. Explore the benefits of smart irrigation, from smartphone control to weather-based scheduling that automatically adjusts for Charlotte's climate.",
    featuredPostSlugs: ["smart-irrigation-controllers-worth-it", "smart-controllers-reduce-water-waste", "sprinkler-controller-needs-replacement"],
    relatedServiceSlugs: ["smart-controller-upgrade", "irrigation-system-installation"],
    relatedLocationSlugs: ["charlotte", "cornelius"],
    faqSlugs: ["why-is-my-sprinkler-system-not-turning-on"]
  },
  {
    slug: "landscape-design-guide",
    title: "Landscape Design Guide Center",
    metaDescription: "Plan your dream outdoor space. Expert tips on layout, plant selection, and creating cohesive backyard designs in Charlotte.",
    h1: "Landscape Design Guide Center",
    category: "OutdoorLiving",
    introCopy: "Great landscapes start with great design. Our guide center helps you navigate the planning process, from initial concepts to material selection for your Charlotte area home.",
    featuredPostSlugs: ["backyard-transformation-charlotte", "how-to-phase-backyard-project", "common-hardscape-mistakes"],
    relatedServiceSlugs: ["paver-patio-installation", "landscape-lighting-installation"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    faqSlugs: ["do-you-install-paver-patios"]
  },
  {
    slug: "lawn-maintenance-guide",
    title: "Lawn & Property Maintenance Guide Center",
    metaDescription: "Keep your property pristine year-round. Professional maintenance tips for lawns, irrigation, and drainage systems.",
    h1: "Lawn & Property Maintenance Guide Center",
    category: "Maintenance",
    introCopy: "A beautiful property requires consistent care. Learn the professional secrets to maintaining your lawn, irrigation system, and drainage infrastructure throughout the changing North Carolina seasons.",
    featuredPostSlugs: ["how-often-irrigation-inspection", "spring-irrigation-startup-checklist", "irrigation-winterization-guide"],
    relatedServiceSlugs: ["sprinkler-repair", "hoa-grounds-contract"],
    relatedLocationSlugs: ["charlotte", "concord"],
    faqSlugs: ["do-you-repair-sprinkler-systems"]
  },
  {
    slug: "hardscape-patio-guide",
    title: "Hardscape & Patio Guide Center",
    metaDescription: "Build a patio that lasts. Your resource for paver selection, installation best practices, and integrated drainage solutions.",
    h1: "Hardscape & Patio Guide Center",
    category: "Hardscapes",
    introCopy: "Patios are the foundation of outdoor living. Explore our guides on paver materials, construction techniques, and how to ensure your new hardscape stands the test of time.",
    featuredPostSlugs: ["paver-patio-cost-charlotte", "paver-vs-concrete-patio", "why-patio-drainage-matters"],
    relatedServiceSlugs: ["paver-patio-installation", "drainage-assessment"],
    relatedLocationSlugs: ["charlotte", "harrisburg"],
    faqSlugs: ["do-you-install-paver-patios", "do-paver-patios-need-drainage"]
  },
  {
    slug: "outdoor-living-guide",
    title: "Outdoor Living Guide Center",
    metaDescription: "Live your best life outdoors. Expert advice on outdoor kitchens, fire pits, and creating functional backyard rooms.",
    h1: "Outdoor Living Guide Center",
    category: "OutdoorLiving",
    introCopy: "Extend your home's living space into the great outdoors. From gourmet kitchens to cozy fire pits, we help you design and build the ultimate backyard retreat in Charlotte.",
    featuredPostSlugs: ["outdoor-kitchen-planning-guide", "outdoor-fireplace-vs-fire-pit", "outdoor-living-mistakes"],
    relatedServiceSlugs: ["outdoor-kitchen", "fire-pit-installation"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    faqSlugs: ["do-you-build-outdoor-kitchens", "can-outdoor-living-projects-be-phased"]
  },
  {
    slug: "pool-landscaping-guide",
    title: "Pool-Area Landscaping Guide Center",
    metaDescription: "Enhance your pool experience. Learn about pool-safe plants, non-slip decking, and essential drainage for pool areas.",
    h1: "Pool-Area Landscaping Guide Center",
    category: "PoolArea",
    introCopy: "A pool is a major investment. Our guides help you surround it with beautiful, functional landscaping and drainage that protects your pool and enhances your summer fun.",
    featuredPostSlugs: ["pool-landscaping-ideas-charlotte", "pool-area-drainage-guide", "hot-tub-patio-planning"],
    relatedServiceSlugs: ["paver-patio-installation", "drainage-assessment"],
    relatedLocationSlugs: ["charlotte", "cornelius"],
    faqSlugs: ["do-you-do-pool-landscaping", "can-you-improve-drainage-around-a-pool"]
  },
  {
    slug: "landscape-lighting-guide",
    title: "Landscape Lighting Guide Center",
    metaDescription: "Illuminate your landscape. Expert tips on lighting design, fixture selection, and enhancing home security with light.",
    h1: "Landscape Lighting Guide Center",
    category: "Lighting",
    introCopy: "Don't let your beautiful landscape disappear at night. Learn how professional lighting can transform your property's nighttime curb appeal and provide essential safety and security.",
    featuredPostSlugs: ["landscape-lighting-ideas-charlotte", "pathway-lighting-guide", "outdoor-lighting-mistakes"],
    relatedServiceSlugs: ["landscape-lighting-installation"],
    relatedLocationSlugs: ["charlotte", "huntersville"],
    faqSlugs: ["do-you-install-landscape-lighting", "what-is-low-voltage-lighting"]
  },
  {
    slug: "commercial-hoa-guide",
    title: "Commercial / HOA Outdoor Service Guide Center",
    metaDescription: "Professional solutions for properties. Our guide to irrigation and landscape management for HOAs and commercial sites.",
    h1: "Commercial / HOA Outdoor Service Guide Center",
    category: "Commercial",
    introCopy: "Managing large-scale properties comes with unique challenges. We provide specialized resources for HOA boards and property managers to keep their communities and businesses looking their best.",
    featuredPostSlugs: ["hoa-irrigation-checklist", "commercial-irrigation-guide", "property-manager-outdoor-issues"],
    relatedServiceSlugs: ["hoa-grounds-contract", "commercial-irrigation-maintenance"],
    relatedLocationSlugs: ["charlotte", "concord"],
    faqSlugs: ["do-you-work-with-hoas", "do-you-provide-commercial-irrigation-maintenance"]
  },
  {
    slug: "luxury-outdoor-guide",
    title: "Luxury Outdoor Property Guide Center",
    metaDescription: "High-end solutions for elite estates. Expert advice on premium materials, custom designs, and complex property management.",
    h1: "Luxury Outdoor Property Guide Center",
    category: "Luxury",
    introCopy: "For the most discerning homeowners, we offer specialized guides on luxury backyard design, premium material selection, and the engineering required for large-scale estate projects.",
    featuredPostSlugs: ["luxury-backyard-design-charlotte", "estate-drainage-planning"],
    relatedServiceSlugs: ["paver-patio-installation", "outdoor-kitchen", "landscape-lighting-installation"],
    relatedLocationSlugs: ["charlotte"],
    faqSlugs: ["do-you-install-paver-patios", "do-you-build-outdoor-kitchens"]
  },
  {
    slug: "seasonal-maintenance-guide",
    title: "Seasonal Outdoor Maintenance Center",
    metaDescription: "Your year-round outdoor checklist. Learn what your property needs each month to stay healthy and beautiful in Charlotte.",
    h1: "Seasonal Outdoor Maintenance Center",
    category: "Seasonal",
    introCopy: "North Carolina weather is dynamic. Our seasonal guides ensure you're always prepared, from spring startups and summer heat management to fall winterization and winter protection.",
    featuredPostSlugs: ["spring-irrigation-startup-checklist", "irrigation-winterization-guide", "drainage-after-heavy-rain"],
    relatedServiceSlugs: ["sprinkler-repair", "standing-water-solutions"],
    relatedLocationSlugs: ["charlotte", "harrisburg", "concord"],
    faqSlugs: ["do-you-repair-sprinkler-systems", "what-causes-standing-water"]
  },
  {
    slug: "charlotte-outdoor-services",
    title: "Charlotte Outdoor Services Local Guide",
    metaDescription: "Your local resource for outdoor services. Learn about the specific challenges and solutions for homes in the Charlotte metro area.",
    h1: "Charlotte Outdoor Services Local Guide",
    category: "Local",
    introCopy: "We know Charlotte. This local guide addresses the specific soil conditions, weather patterns, and community standards that influence outdoor projects in our region.",
    featuredPostSlugs: ["backyard-transformation-charlotte", "sprinkler-repair-cost-charlotte", "french-drain-cost-charlotte"],
    relatedServiceSlugs: ["sprinkler-repair", "drainage-assessment", "paver-patio-installation"],
    relatedLocationSlugs: ["charlotte", "harrisburg", "concord", "huntersville", "cornelius"],
    faqSlugs: ["do-you-repair-sprinkler-systems", "do-you-install-french-drains"]
  }
];

export const localGuides: LocalGuide[] = [
  {
    slug: "harrisburg-outdoor-services",
    title: "Outdoor Services Guide for Harrisburg NC",
    metaDescription: "Expert irrigation, drainage, and hardscape solutions for Harrisburg homeowners. Learn about local soil and service standards.",
    h1: "Outdoor Services Guide for Harrisburg NC",
    locationSlug: "harrisburg",
    category: "Local",
    introCopy: "Harrisburg homeowners face unique challenges with heavy clay soil and rapid community growth. We provide tailored solutions for your outdoor space.",
    commonProblems: ["Heavy clay soil drainage", "New construction irrigation needs", "Soggy backyards after storms"],
    seasonalNotes: ["Early spring startup is key for new lawns", "Winterization should be done by mid-November"],
    relatedServiceSlugs: ["sprinkler-repair", "drainage-assessment", "paver-patio-installation"]
  },
  {
    slug: "harrisburg-sprinkler-repair",
    title: "Sprinkler Repair in Harrisburg NC",
    metaDescription: "Reliable irrigation repair services in Harrisburg. We fix leaks, valves, and controllers to keep your lawn green.",
    h1: "Sprinkler Repair in Harrisburg NC",
    locationSlug: "harrisburg",
    category: "Irrigation",
    introCopy: "Keep your Harrisburg lawn thriving with professional sprinkler repair. We specialize in diagnosing and fixing all irrigation issues quickly.",
    commonProblems: ["Broken heads from mowers", "Stuck valves", "Controller programming issues"],
    seasonalNotes: ["Check for leaks during the first spring run", "Adjust run times for July heat"],
    relatedServiceSlugs: ["sprinkler-repair", "smart-controller-upgrade"]
  },
  {
    slug: "harrisburg-drainage",
    title: "Yard Drainage Solutions in Harrisburg NC",
    metaDescription: "Stop the swamp. Expert drainage assessments and solutions for Harrisburg properties struggling with standing water.",
    h1: "Yard Drainage Solutions in Harrisburg NC",
    locationSlug: "harrisburg",
    category: "Drainage",
    introCopy: "Harrisburg's terrain can lead to significant water issues. We design custom drainage systems to protect your home and landscape.",
    commonProblems: ["Standing water in low spots", "Runoff from neighboring lots", "Soggy turf areas"],
    seasonalNotes: ["Clean catch basins before fall leaves drop", "Monitor flow during spring rains"],
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"]
  },
  {
    slug: "harrisburg-french-drains",
    title: "French Drain Installation in Harrisburg NC",
    metaDescription: "Professional French drain installation to manage groundwater and protect your Harrisburg home's foundation.",
    h1: "French Drain Installation in Harrisburg NC",
    locationSlug: "harrisburg",
    category: "Drainage",
    introCopy: "Manage groundwater effectively with a custom French drain. We use high-quality materials to ensure long-term performance in Harrisburg soil.",
    commonProblems: ["Persistent soggy soil", "Water near foundation", "Basement dampness"],
    seasonalNotes: ["Ensure discharge points are clear of debris", "Check for soil settling after installation"],
    relatedServiceSlugs: ["french-drain-installation", "drainage-assessment"]
  },
  {
    slug: "harrisburg-paver-patios",
    title: "Paver Patio Installation in Harrisburg NC",
    metaDescription: "Create your dream backyard in Harrisburg with a custom paver patio. Durable, beautiful, and expertly installed.",
    h1: "Paver Patio Installation in Harrisburg NC",
    locationSlug: "harrisburg",
    category: "Hardscapes",
    introCopy: "Enhance your Harrisburg home with a stunning paver patio. We focus on proper base preparation and integrated drainage for lasting beauty.",
    commonProblems: ["Uneven old concrete slabs", "Poor patio drainage", "Lack of functional outdoor space"],
    seasonalNotes: ["Seal pavers every 3-5 years", "Keep joints filled with polymeric sand"],
    relatedServiceSlugs: ["paver-patio-installation", "fire-pit-installation"]
  },
  {
    slug: "harrisburg-landscape-lighting",
    title: "Landscape Lighting in Harrisburg NC",
    metaDescription: "Illuminate your Harrisburg home. Professional landscape lighting for beauty, safety, and security.",
    h1: "Landscape Lighting in Harrisburg NC",
    locationSlug: "harrisburg",
    category: "Lighting",
    introCopy: "Show off your Harrisburg property after dark. Our lighting designs highlight your home's best features while providing essential safety.",
    commonProblems: ["Dark walkways", "Lack of nighttime curb appeal", "Security concerns"],
    seasonalNotes: ["Adjust timers for daylight savings", "Clean fixture lenses in spring"],
    relatedServiceSlugs: ["landscape-lighting-installation"]
  },
  {
    slug: "harrisburg-lawn-maintenance",
    title: "Lawn & Property Maintenance in Harrisburg NC",
    metaDescription: "Keep your Harrisburg property looking its best year-round with professional maintenance services.",
    h1: "Lawn & Property Maintenance in Harrisburg NC",
    locationSlug: "harrisburg",
    category: "Maintenance",
    introCopy: "Reliable property maintenance for Harrisburg homeowners. We handle the details so you can enjoy your beautiful outdoor space.",
    commonProblems: ["Overgrown common areas", "Irrigation system neglect", "Drainage system clogs"],
    seasonalNotes: ["Aeration and seeding in fall", "Pre-emergent application in early spring"],
    relatedServiceSlugs: ["hoa-grounds-contract", "sprinkler-repair"]
  },
  {
    slug: "concord-outdoor-services",
    title: "Outdoor Services Guide for Concord NC",
    metaDescription: "Comprehensive irrigation, drainage, and hardscape solutions for Concord homes and businesses.",
    h1: "Outdoor Services Guide for Concord NC",
    locationSlug: "concord",
    category: "Local",
    introCopy: "From historic downtown to new developments, we provide expert outdoor services tailored to the diverse needs of Concord properties.",
    commonProblems: ["Old irrigation system failures", "Erosion on sloped lots", "Commercial property maintenance"],
    seasonalNotes: ["Schedule winterization early in Concord", "Spring inspections prevent summer dry spots"],
    relatedServiceSlugs: ["sprinkler-repair", "drainage-assessment", "paver-patio-installation"]
  },
  {
    slug: "concord-sprinkler-repair",
    title: "Sprinkler Repair in Concord NC",
    metaDescription: "Expert irrigation repair in Concord. We fix all brands and models to ensure efficient watering for your lawn.",
    h1: "Sprinkler Repair in Concord NC",
    locationSlug: "concord",
    category: "Irrigation",
    introCopy: "Don't let a broken sprinkler ruin your Concord landscape. Our technicians provide fast, reliable repairs for all irrigation issues.",
    commonProblems: ["Main line leaks", "Faulty solenoids", "Clogged nozzles"],
    seasonalNotes: ["Test backflow preventers annually", "Update controller for seasonal weather"],
    relatedServiceSlugs: ["sprinkler-repair", "smart-controller-upgrade"]
  },
  {
    slug: "concord-drainage",
    title: "Yard Drainage Solutions in Concord NC",
    metaDescription: "Professional drainage assessments and installations in Concord. Protect your property from water damage.",
    h1: "Yard Drainage Solutions in Concord NC",
    locationSlug: "concord",
    category: "Drainage",
    introCopy: "Concord's varied terrain requires expert drainage planning. We offer custom solutions to manage runoff and keep your yard dry.",
    commonProblems: ["Basement water intrusion", "Soil erosion on hillsides", "Soggy backyard areas"],
    seasonalNotes: ["Check downspout extensions after heavy storms", "Monitor grading for signs of settling"],
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"]
  },
  {
    slug: "concord-french-drains",
    title: "French Drain Installation in Concord NC",
    metaDescription: "Effective groundwater management for Concord homes. Professional French drain design and installation.",
    h1: "French Drain Installation in Concord NC",
    locationSlug: "concord",
    category: "Drainage",
    introCopy: "Protect your Concord property with a professionally installed French drain. We specialize in managing groundwater in NC clay.",
    commonProblems: ["Persistent wet spots", "Crawlspace moisture", "Foundation pressure"],
    seasonalNotes: ["Inspect discharge outlets for blockages", "Ensure surface water is directed to the drain"],
    relatedServiceSlugs: ["french-drain-installation", "drainage-assessment"]
  },
  {
    slug: "concord-hardscapes",
    title: "Hardscape & Patio Design in Concord NC",
    metaDescription: "Transform your Concord backyard with custom hardscapes. Patios, walls, and fire pits built to last.",
    h1: "Hardscape & Patio Design in Concord NC",
    locationSlug: "concord",
    category: "Hardscapes",
    introCopy: "Create a beautiful outdoor retreat in Concord. Our hardscape designs combine aesthetics with structural integrity and proper drainage.",
    commonProblems: ["Lack of usable outdoor space", "Failing retaining walls", "Cracked concrete patios"],
    seasonalNotes: ["Clean pavers in spring to remove winter debris", "Check wall drainage after heavy rains"],
    relatedServiceSlugs: ["paver-patio-installation", "fire-pit-installation"]
  },
  {
    slug: "concord-commercial-irrigation",
    title: "Commercial Irrigation Services in Concord NC",
    metaDescription: "Professional irrigation maintenance and repair for Concord businesses and retail centers.",
    h1: "Commercial Irrigation Services in Concord NC",
    locationSlug: "concord",
    category: "Commercial",
    introCopy: "Keep your Concord business looking professional. We provide reliable irrigation services for commercial properties of all sizes.",
    commonProblems: ["High water bills", "Liability from wet sidewalks", "System neglect"],
    seasonalNotes: ["Monthly wet checks are essential for commercial sites", "Winterize early to protect large systems"],
    relatedServiceSlugs: ["commercial-irrigation-maintenance", "sprinkler-repair"]
  },
  {
    slug: "concord-hoa-landscape",
    title: "HOA Landscape & Irrigation in Concord NC",
    metaDescription: "Reliable outdoor services for Concord HOAs. We help boards maintain community value and beauty.",
    h1: "HOA Landscape & Irrigation in Concord NC",
    locationSlug: "concord",
    category: "Commercial",
    introCopy: "Partner with Elite for your Concord HOA needs. We provide transparent, professional services for community common areas.",
    commonProblems: ["Budget overruns from leaks", "Drainage issues in common areas", "Inconsistent contractor performance"],
    seasonalNotes: ["Present annual maintenance plans to the board", "Schedule community-wide winterization"],
    relatedServiceSlugs: ["hoa-grounds-contract", "drainage-assessment"]
  },
  {
    slug: "charlotte-outdoor-services",
    title: "Outdoor Services Guide for Charlotte NC",
    metaDescription: "The ultimate resource for irrigation, drainage, and outdoor living in the Charlotte metro area.",
    h1: "Outdoor Services Guide for Charlotte NC",
    locationSlug: "charlotte",
    category: "Local",
    introCopy: "As Charlotte's premier outdoor service provider, we understand the unique needs of Queen City homeowners, from urban lots to suburban estates.",
    commonProblems: ["Urban drainage challenges", "Aging irrigation systems", "Demand for high-end outdoor living"],
    seasonalNotes: ["Charlotte's heat requires precise irrigation in July", "Fall is the best time for major hardscape projects"],
    relatedServiceSlugs: ["sprinkler-repair", "drainage-assessment", "paver-patio-installation"]
  },
  {
    slug: "charlotte-sprinkler-repair",
    title: "Sprinkler Repair in Charlotte NC",
    metaDescription: "Fast, professional irrigation repair across Charlotte. We fix leaks, heads, and smart controllers.",
    h1: "Sprinkler Repair in Charlotte NC",
    locationSlug: "charlotte",
    category: "Irrigation",
    introCopy: "Keep your Charlotte lawn green without wasting water. Our expert technicians provide comprehensive repair services for all irrigation systems.",
    commonProblems: ["Underground leaks", "Controller malfunctions", "Poor coverage/dry spots"],
    seasonalNotes: ["Upgrade to smart controllers to save on Charlotte water rates", "Schedule spring startups in March"],
    relatedServiceSlugs: ["sprinkler-repair", "smart-controller-upgrade"]
  },
  {
    slug: "charlotte-drainage",
    title: "Yard Drainage Solutions in Charlotte NC",
    metaDescription: "Expert drainage assessments and installations for Charlotte properties. Solve standing water and erosion issues.",
    h1: "Yard Drainage Solutions in Charlotte NC",
    locationSlug: "charlotte",
    category: "Drainage",
    introCopy: "Charlotte's heavy rains can overwhelm poorly designed yards. We provide engineered drainage solutions to protect your property.",
    commonProblems: ["Standing water after thunderstorms", "Foundation water issues", "Erosion in mulch beds"],
    seasonalNotes: ["Monitor drainage during hurricane season", "Keep gutters and drains clear of spring pollen and debris"],
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"]
  },
  {
    slug: "charlotte-french-drains",
    title: "French Drain Installation in Charlotte NC",
    metaDescription: "Professional French drain systems for Charlotte homes. Manage groundwater and keep your backyard dry.",
    h1: "French Drain Installation in Charlotte NC",
    locationSlug: "charlotte",
    category: "Drainage",
    introCopy: "Don't let a soggy yard limit your outdoor enjoyment. Our Charlotte French drain installations are designed for maximum performance and longevity.",
    commonProblems: ["Spongy turf", "Water in crawlspaces", "Persistent wet areas"],
    seasonalNotes: ["Check pop-up emitters for clogs", "Ensure proper fall is maintained in the system"],
    relatedServiceSlugs: ["french-drain-installation", "drainage-assessment"]
  },
  {
    slug: "charlotte-outdoor-living",
    title: "Outdoor Living Design in Charlotte NC",
    metaDescription: "Create your dream backyard in Charlotte. Custom patios, kitchens, and fire features for the ultimate retreat.",
    h1: "Outdoor Living Design in Charlotte NC",
    locationSlug: "charlotte",
    category: "OutdoorLiving",
    introCopy: "Elevate your lifestyle with a custom outdoor living space in Charlotte. We design and build functional, beautiful backyards for entertaining and relaxing.",
    commonProblems: ["Small, unusable builder-grade patios", "Lack of shade or privacy", "Poor flow between indoor and outdoor spaces"],
    seasonalNotes: ["Plan your project in winter for spring completion", "Incorporate heating elements for year-round use"],
    relatedServiceSlugs: ["paver-patio-installation", "outdoor-kitchen", "fire-pit-installation"]
  },
  {
    slug: "charlotte-outdoor-kitchens",
    title: "Outdoor Kitchen Installation in Charlotte NC",
    metaDescription: "Gourmet outdoor kitchens for Charlotte homes. Custom designs with premium appliances and durable materials.",
    h1: "Outdoor Kitchen Installation in Charlotte NC",
    locationSlug: "charlotte",
    category: "OutdoorLiving",
    introCopy: "Take your cooking outdoors with a custom kitchen in Charlotte. We handle everything from design to utility installation.",
    commonProblems: ["Limited space for grilling", "Lack of outdoor prep area", "Need for durable outdoor appliances"],
    seasonalNotes: ["Winterize outdoor plumbing in late fall", "Clean stainless steel appliances regularly in humid weather"],
    relatedServiceSlugs: ["outdoor-kitchen", "paver-patio-installation"]
  },
  {
    slug: "charlotte-landscape-lighting",
    title: "Landscape Lighting Design in Charlotte NC",
    metaDescription: "Professional landscape lighting for Charlotte homes. Enhance beauty, safety, and security after dark.",
    h1: "Landscape Lighting Design in Charlotte NC",
    locationSlug: "charlotte",
    category: "Lighting",
    introCopy: "Highlight your Charlotte home's architecture and landscaping. Our custom lighting designs create a stunning nighttime environment.",
    commonProblems: ["Dark entryways", "Tripping hazards on paths", "Flat, uninspired nighttime appearance"],
    seasonalNotes: ["Update timers for seasonal light changes", "Replace bulbs and clean fixtures annually"],
    relatedServiceSlugs: ["landscape-lighting-installation"]
  },
  {
    slug: "charlotte-pool-landscaping",
    title: "Pool Landscaping & Drainage in Charlotte NC",
    metaDescription: "Expert landscaping and drainage for Charlotte pool areas. Create a private, functional oasis.",
    h1: "Pool Landscaping & Drainage in Charlotte NC",
    locationSlug: "charlotte",
    category: "PoolArea",
    introCopy: "Surround your Charlotte pool with beauty and function. We specialize in pool-safe plants, non-slip hardscapes, and essential drainage.",
    commonProblems: ["Runoff entering the pool", "Lack of privacy around the deck", "Plants that drop debris in the water"],
    seasonalNotes: ["Check deck drains before pool season starts", "Prune pool-side plants in late winter"],
    relatedServiceSlugs: ["paver-patio-installation", "drainage-assessment"]
  },
  {
    slug: "charlotte-commercial-outdoor",
    title: "Commercial Outdoor Services in Charlotte NC",
    metaDescription: "Comprehensive irrigation and drainage for Charlotte commercial properties and HOAs.",
    h1: "Commercial Outdoor Services in Charlotte NC",
    locationSlug: "charlotte",
    category: "Commercial",
    introCopy: "Professional property management for Charlotte's businesses and communities. We provide reliable, high-quality outdoor solutions.",
    commonProblems: ["Large-scale drainage failures", "Inefficient irrigation systems", "Need for responsive service"],
    seasonalNotes: ["Schedule annual backflow testing", "Perform monthly system audits for water efficiency"],
    relatedServiceSlugs: ["commercial-irrigation-maintenance", "hoa-grounds-contract"]
  },
  {
    slug: "ballantyne-luxury",
    title: "Luxury Backyard Design in Ballantyne",
    metaDescription: "High-end outdoor living solutions for Ballantyne estates. Custom patios, kitchens, and lighting.",
    h1: "Luxury Backyard Design in Ballantyne",
    locationSlug: "charlotte",
    category: "Luxury",
    introCopy: "Ballantyne estates demand the best. We provide premium design and construction services for the most discerning homeowners.",
    commonProblems: ["Need for large-scale entertaining spaces", "Complex site engineering", "High expectations for material quality"],
    seasonalNotes: ["Incorporate outdoor heating for year-round Ballantyne living", "Premium lighting enhances winter curb appeal"],
    relatedServiceSlugs: ["paver-patio-installation", "outdoor-kitchen", "landscape-lighting-installation"]
  },
  {
    slug: "southpark-estate",
    title: "Estate Management & Design in SouthPark",
    metaDescription: "Comprehensive outdoor services for SouthPark estates. Irrigation, drainage, and luxury hardscapes.",
    h1: "Estate Management & Design in SouthPark",
    locationSlug: "charlotte",
    category: "Luxury",
    introCopy: "Maintain the elegance of your SouthPark estate. We offer specialized services for large properties with complex needs.",
    commonProblems: ["Aging infrastructure on established estates", "Privacy screening needs", "Sophisticated drainage requirements"],
    seasonalNotes: ["Regular irrigation audits protect mature SouthPark landscapes", "Winterization is critical for large estate systems"],
    relatedServiceSlugs: ["sprinkler-repair", "drainage-assessment", "paver-patio-installation"]
  },
  {
    slug: "myers-park-drainage",
    title: "Luxury Drainage Solutions in Myers Park",
    metaDescription: "Discreet, effective drainage for Myers Park homes. Protect your historic property from water damage.",
    h1: "Luxury Drainage Solutions in Myers Park",
    locationSlug: "charlotte",
    category: "Luxury",
    introCopy: "Myers Park's beautiful canopy and historic homes require careful drainage planning. We provide effective solutions that blend seamlessly with your landscape.",
    commonProblems: ["Runoff from mature trees and slopes", "Protecting historic foundations", "Need for aesthetically pleasing drainage"],
    seasonalNotes: ["Keep drains clear of heavy leaf fall in Myers Park", "Monitor soil moisture around old foundations"],
    relatedServiceSlugs: ["drainage-assessment", "french-drain-installation"]
  },
  {
    slug: "dilworth-lighting",
    title: "Architectural Lighting in Dilworth",
    metaDescription: "Highlight the charm of your Dilworth home with professional architectural and landscape lighting.",
    h1: "Architectural Lighting in Dilworth",
    locationSlug: "charlotte",
    category: "Luxury",
    introCopy: "Dilworth's unique architecture deserves to be seen. Our lighting designs enhance the character and safety of your historic home.",
    commonProblems: ["Dark urban lots", "Highlighting architectural details", "Safety on narrow walkways"],
    seasonalNotes: ["Warm lighting tones complement Dilworth's historic aesthetic", "Adjust timers for urban light pollution"],
    relatedServiceSlugs: ["landscape-lighting-installation"]
  },
  {
    slug: "lake-norman-pool",
    title: "Luxury Pool Landscaping in Lake Norman",
    metaDescription: "Create a lakeside oasis. Premium pool landscaping and drainage for Lake Norman waterfront homes.",
    h1: "Luxury Pool Landscaping in Lake Norman",
    locationSlug: "cornelius",
    category: "Luxury",
    introCopy: "Maximize your Lake Norman lifestyle. We design and build stunning pool areas that complement your waterfront views.",
    commonProblems: ["Managing runoff near the lake", "Creating privacy on open lots", "Durable materials for high-use pool areas"],
    seasonalNotes: ["Salt-tolerant plants are best for Lake Norman pool areas", "Ensure drainage doesn't impact lake water quality"],
    relatedServiceSlugs: ["paver-patio-installation", "drainage-assessment", "landscape-lighting-installation"]
  }
];

export const faqEntries: FAQEntry[] = [
  {
    slug: "do-you-repair-sprinkler-systems",
    question: "Do you repair sprinkler systems?",
    shortAnswer: "Yes, we provide comprehensive sprinkler repair services for all major brands. We fix leaks, broken heads, faulty valves, and controller issues in the Charlotte area.",
    category: "Irrigation",
    relatedServiceSlugs: ["sprinkler-repair"],
    aeoKeywords: ["sprinkler repair Charlotte", "irrigation repair near me", "fix sprinkler system"]
  },
  {
    slug: "why-is-my-sprinkler-system-not-turning-on",
    question: "Why is my sprinkler system not turning on?",
    shortAnswer: "Common causes include a tripped circuit breaker, a blown fuse in the controller, a faulty transformer, or a rain sensor that is incorrectly holding the system off.",
    category: "Irrigation",
    relatedServiceSlugs: ["sprinkler-repair", "smart-controller-upgrade"],
    aeoKeywords: ["sprinkler won't turn on", "irrigation controller troubleshooting", "sprinkler system power issues"]
  },
  {
    slug: "how-much-does-sprinkler-repair-cost",
    question: "How much does sprinkler repair cost?",
    shortAnswer: "Repair costs vary by scope. Minor head replacements are inexpensive, while valve or main line repairs require more labor. We provide clear estimates before starting any work.",
    category: "Irrigation",
    relatedServiceSlugs: ["sprinkler-repair"],
    aeoKeywords: ["sprinkler repair cost", "irrigation service price", "sprinkler technician rates"]
  },
  {
    slug: "do-you-install-new-irrigation-systems",
    question: "Do you install new irrigation systems?",
    shortAnswer: "Yes, we design and install custom, water-efficient irrigation systems tailored to your property's specific needs and Charlotte's local climate.",
    category: "Irrigation",
    relatedServiceSlugs: ["irrigation-system-installation"],
    aeoKeywords: ["irrigation installation Charlotte", "new sprinkler system", "sprinkler system contractor"]
  },
  {
    slug: "what-is-a-smart-irrigation-controller",
    question: "What is a smart irrigation controller?",
    shortAnswer: "A smart controller uses local weather data and smartphone connectivity to automatically adjust your watering schedule, saving water and improving lawn health.",
    category: "Irrigation",
    relatedServiceSlugs: ["smart-controller-upgrade"],
    aeoKeywords: ["smart sprinkler controller", "WiFi irrigation timer", "weather-based irrigation"]
  },
  {
    slug: "how-often-should-i-water-my-lawn-in-charlotte",
    question: "How often should I water my lawn in Charlotte?",
    shortAnswer: "Typically, lawns need 1 inch of water per week. In Charlotte's heat, this usually means watering 2-3 times per week in the early morning hours.",
    category: "Irrigation",
    relatedServiceSlugs: ["sprinkler-repair", "smart-controller-upgrade"],
    aeoKeywords: ["lawn watering schedule Charlotte", "how often to water grass NC", "best time to water lawn"]
  },
  {
    slug: "do-you-provide-irrigation-winterization",
    question: "Do you provide irrigation winterization?",
    shortAnswer: "Yes, we offer professional winterization (blow-outs) to protect your system from freeze damage. This should be scheduled in October or November.",
    category: "Irrigation",
    relatedServiceSlugs: ["sprinkler-repair"],
    aeoKeywords: ["sprinkler winterization Charlotte", "irrigation blow out", "winterize sprinkler system"]
  },
  {
    slug: "can-you-fix-low-water-pressure-in-sprinklers",
    question: "Can you fix low water pressure in sprinklers?",
    shortAnswer: "Yes, low pressure is often caused by leaks, clogged filters, or partially closed valves. We can diagnose and restore proper pressure to your system.",
    category: "Irrigation",
    relatedServiceSlugs: ["sprinkler-repair"],
    aeoKeywords: ["low sprinkler pressure fix", "weak sprinkler heads", "irrigation pressure troubleshooting"]
  },
  {
    slug: "do-you-install-french-drains",
    question: "Do you install French drains?",
    shortAnswer: "Yes, we are experts in French drain installation. We use high-quality materials to manage groundwater and keep your yard and foundation dry.",
    category: "Drainage",
    relatedServiceSlugs: ["french-drain-installation", "drainage-assessment"],
    aeoKeywords: ["French drain installation Charlotte", "yard drainage contractor", "fix soggy yard"]
  },
  {
    slug: "what-causes-standing-water",
    question: "What causes standing water in my yard?",
    shortAnswer: "Standing water is typically caused by heavy clay soil, poor grading, or excessive runoff from downspouts and neighboring properties.",
    category: "Drainage",
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"],
    aeoKeywords: ["standing water in yard causes", "why is my yard swampy", "backyard flooding"]
  },
  {
    slug: "how-much-does-a-drainage-assessment-cost",
    question: "How much does a drainage assessment cost?",
    shortAnswer: "We offer professional drainage assessments to identify the root cause of your water issues and provide a detailed plan for a permanent solution.",
    category: "Drainage",
    relatedServiceSlugs: ["drainage-assessment"],
    aeoKeywords: ["drainage inspection cost", "yard water assessment", "drainage expert Charlotte"]
  },
  {
    slug: "can-you-redirect-downspout-water",
    question: "Can you redirect downspout water?",
    shortAnswer: "Yes, we can pipe your downspouts underground to redirect water away from your foundation and into a safe discharge area or dry well.",
    category: "Drainage",
    relatedServiceSlugs: ["standing-water-solutions", "drainage-assessment"],
    aeoKeywords: ["underground downspout piping", "redirect gutter water", "downspout drainage solutions"]
  },
  {
    slug: "what-is-the-difference-between-a-french-drain-and-a-catch-basin",
    question: "What is the difference between a French drain and a catch basin?",
    shortAnswer: "A French drain manages groundwater through a perforated pipe in a gravel trench, while a catch basin collects surface water through a grate in low spots.",
    category: "Drainage",
    relatedServiceSlugs: ["french-drain-installation", "drainage-assessment"],
    aeoKeywords: ["French drain vs catch basin", "surface vs groundwater drainage", "yard drain types"]
  },
  {
    slug: "will-a-french-drain-fix-my-soggy-yard",
    question: "Will a French drain fix my soggy yard?",
    shortAnswer: "In many cases, yes. French drains are excellent for drying out consistently wet, spongy areas by providing a path for groundwater to escape.",
    category: "Drainage",
    relatedServiceSlugs: ["french-drain-installation"],
    aeoKeywords: ["fix soggy lawn", "French drain effectiveness", "dry out wet backyard"]
  },
  {
    slug: "do-you-provide-grading-services",
    question: "Do you provide grading services?",
    shortAnswer: "Yes, we provide light regrading to ensure water flows away from your home and doesn't pool in low spots of your landscape.",
    category: "Drainage",
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"],
    aeoKeywords: ["yard regrading Charlotte", "fix yard slope", "landscape grading contractor"]
  },
  {
    slug: "how-long-does-a-drainage-installation-take",
    question: "How long does a drainage installation take?",
    shortAnswer: "Most residential drainage projects are completed in 1-3 days, depending on the complexity and the amount of excavation required.",
    category: "Drainage",
    relatedServiceSlugs: ["french-drain-installation", "standing-water-solutions"],
    aeoKeywords: ["drainage project timeline", "how long to install French drain", "yard drainage installation time"]
  },
  {
    slug: "do-you-install-paver-patios",
    question: "Do you install paver patios?",
    shortAnswer: "Yes, we design and install custom paver patios using high-quality materials like Belgard and Techo-Bloc for beautiful, durable outdoor spaces.",
    category: "Hardscapes",
    relatedServiceSlugs: ["paver-patio-installation"],
    aeoKeywords: ["paver patio installation Charlotte", "hardscape contractor near me", "custom patio builder"]
  },
  {
    slug: "do-paver-patios-need-drainage",
    question: "Do paver patios need drainage?",
    shortAnswer: "Absolutely. Every patio must be pitched correctly and often requires integrated drains to prevent water from pooling or damaging the base.",
    category: "Hardscapes",
    relatedServiceSlugs: ["paver-patio-installation", "drainage-assessment"],
    aeoKeywords: ["patio drainage requirements", "prevent water on patio", "paver patio pitch"]
  },
  {
    slug: "how-much-does-a-paver-patio-cost",
    question: "How much does a paver patio cost?",
    shortAnswer: "Costs vary based on square footage, material choice, and site prep. We provide detailed, transparent quotes for every hardscape project.",
    category: "Hardscapes",
    relatedServiceSlugs: ["paver-patio-installation"],
    aeoKeywords: ["paver patio cost Charlotte", "patio installation price", "hardscape project budget"]
  },
  {
    slug: "are-pavers-better-than-concrete",
    question: "Are pavers better than concrete?",
    shortAnswer: "Pavers are generally superior because they are more durable, won't crack like large concrete slabs, and offer much better aesthetic options.",
    category: "Hardscapes",
    relatedServiceSlugs: ["paver-patio-installation"],
    aeoKeywords: ["pavers vs concrete patio", "benefits of paver patios", "durable patio materials"]
  },
  {
    slug: "do-you-build-retaining-walls",
    question: "Do you build retaining walls?",
    shortAnswer: "Yes, we build structural and decorative retaining walls designed to manage slopes and create more usable space in your yard.",
    category: "Hardscapes",
    relatedServiceSlugs: ["paver-patio-installation", "drainage-assessment"],
    aeoKeywords: ["retaining wall builder Charlotte", "stone wall installation", "fix sloped yard"]
  },
  {
    slug: "what-is-polymeric-sand",
    question: "What is polymeric sand?",
    shortAnswer: "Polymeric sand is a special material used to fill paver joints. It hardens when wet, preventing weed growth and keeping pavers from shifting.",
    category: "Hardscapes",
    relatedServiceSlugs: ["paver-patio-installation"],
    aeoKeywords: ["polymeric sand benefits", "paver joint sand", "prevent weeds in patio"]
  },
  {
    slug: "can-you-install-a-fire-pit",
    question: "Can you install a fire pit?",
    shortAnswer: "Yes, we can integrate a custom stone fire pit into your new or existing patio for the perfect backyard gathering spot.",
    category: "Hardscapes",
    relatedServiceSlugs: ["fire-pit-installation", "paver-patio-installation"],
    aeoKeywords: ["fire pit installation Charlotte", "outdoor fire feature", "custom stone fire pit"]
  },
  {
    slug: "how-do-i-maintain-my-paver-patio",
    question: "How do I maintain my paver patio?",
    shortAnswer: "Maintenance involves regular sweeping, occasional cleaning with mild soap, and re-applying polymeric sand or sealer every few years.",
    category: "Hardscapes",
    relatedServiceSlugs: ["paver-patio-installation"],
    aeoKeywords: ["paver patio maintenance", "how to clean pavers", "sealing paver patios"]
  },
  {
    slug: "do-you-build-outdoor-kitchens",
    question: "Do you build outdoor kitchens?",
    shortAnswer: "Yes, we design and build custom outdoor kitchens with premium appliances, stone finishes, and durable countertops for the ultimate cooking experience.",
    category: "OutdoorLiving",
    relatedServiceSlugs: ["outdoor-kitchen"],
    aeoKeywords: ["outdoor kitchen builder Charlotte", "custom outdoor grill station", "outdoor kitchen design"]
  },
  {
    slug: "can-outdoor-living-projects-be-phased",
    question: "Can outdoor living projects be phased?",
    shortAnswer: "Yes, we often help homeowners plan large projects in phases, starting with core infrastructure like drainage and patios, then adding kitchens or lighting later.",
    category: "OutdoorLiving",
    relatedServiceSlugs: ["paver-patio-installation", "outdoor-kitchen"],
    aeoKeywords: ["phase backyard project", "outdoor living budget planning", "multi-year landscape plan"]
  },
  {
    slug: "what-appliances-can-i-include-in-an-outdoor-kitchen",
    question: "What appliances can I include in an outdoor kitchen?",
    shortAnswer: "We can include grills, side burners, refrigerators, pizza ovens, sinks, and even outdoor-rated dishwashers and ice makers.",
    category: "OutdoorLiving",
    relatedServiceSlugs: ["outdoor-kitchen"],
    aeoKeywords: ["outdoor kitchen appliances", "best outdoor grills", "outdoor refrigerator installation"]
  },
  {
    slug: "do-you-install-outdoor-fireplaces",
    question: "Do you install outdoor fireplaces?",
    shortAnswer: "Yes, we build custom stone fireplaces that provide a stunning focal point and warmth for your outdoor living area.",
    category: "OutdoorLiving",
    relatedServiceSlugs: ["fire-pit-installation"],
    aeoKeywords: ["outdoor fireplace builder Charlotte", "custom stone fireplace", "outdoor fire feature design"]
  },
  {
    slug: "how-do-i-plan-an-outdoor-living-space",
    question: "How do I plan an outdoor living space?",
    shortAnswer: "Start by identifying how you want to use the space, your budget, and any existing issues like drainage. We provide professional design consultations to help.",
    category: "OutdoorLiving",
    relatedServiceSlugs: ["paver-patio-installation", "outdoor-kitchen"],
    aeoKeywords: ["outdoor living planning", "backyard design consultation", "how to design a patio"]
  },
  {
    slug: "what-are-the-best-materials-for-outdoor-countertops",
    question: "What are the best materials for outdoor countertops?",
    shortAnswer: "Granite and certain types of natural stone or concrete are best for Charlotte's climate due to their durability and resistance to UV rays and heat.",
    category: "OutdoorLiving",
    relatedServiceSlugs: ["outdoor-kitchen"],
    aeoKeywords: ["outdoor kitchen countertops", "durable outdoor surfaces", "granite for outdoor kitchens"]
  },
  {
    slug: "do-you-handle-permits-for-outdoor-projects",
    question: "Do you handle permits for outdoor projects?",
    shortAnswer: "Yes, we manage the permitting process for all our construction projects to ensure everything is built to local Charlotte and county codes.",
    category: "OutdoorLiving",
    relatedServiceSlugs: ["paver-patio-installation", "outdoor-kitchen"],
    aeoKeywords: ["outdoor project permits Charlotte", "building codes for patios", "licensed hardscape contractor"]
  },
  {
    slug: "can-you-add-seating-walls-to-a-patio",
    question: "Can you add seating walls to a patio?",
    shortAnswer: "Yes, built-in stone seating walls are a great way to add functional seating and define the edges of your outdoor living space.",
    category: "OutdoorLiving",
    relatedServiceSlugs: ["paver-patio-installation"],
    aeoKeywords: ["stone seating walls", "built-in patio seating", "hardscape design features"]
  },
  {
    slug: "do-you-do-pool-landscaping",
    question: "Do you do pool landscaping?",
    shortAnswer: "Yes, we specialize in landscaping around pools, focusing on low-debris plants, privacy screening, and beautiful, non-slip hardscapes.",
    category: "PoolArea",
    relatedServiceSlugs: ["paver-patio-installation", "landscape-lighting-installation"],
    aeoKeywords: ["pool landscaping Charlotte", "plants for pool area", "pool deck pavers"]
  },
  {
    slug: "can-you-improve-drainage-around-a-pool",
    question: "Can you improve drainage around a pool?",
    shortAnswer: "Yes, we install deck drains and perimeter drainage systems to prevent yard runoff from entering your pool and to protect your pool deck.",
    category: "PoolArea",
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"],
    aeoKeywords: ["pool deck drainage fix", "prevent pool flooding", "yard runoff near pool"]
  },
  {
    slug: "what-are-the-best-plants-for-charlotte-pool-areas",
    question: "What are the best plants for Charlotte pool areas?",
    shortAnswer: "We recommend evergreens like Windmill Palms or Skip Laurels for privacy, and ornamental grasses that thrive in our heat with minimal debris.",
    category: "PoolArea",
    relatedServiceSlugs: ["paver-patio-installation"],
    aeoKeywords: ["pool safe plants NC", "privacy plants for pools", "low maintenance pool landscaping"]
  },
  {
    slug: "can-you-install-a-paver-pool-deck",
    question: "Can you install a paver pool deck?",
    shortAnswer: "Yes, pavers are an excellent choice for pool decks as they are cooler than concrete, slip-resistant, and won't crack over time.",
    category: "PoolArea",
    relatedServiceSlugs: ["paver-patio-installation"],
    aeoKeywords: ["paver pool deck Charlotte", "slip resistant pool deck", "pool deck renovation"]
  },
  {
    slug: "how-do-i-prevent-chlorine-from-killing-my-plants",
    question: "How do I prevent chlorine from killing my plants?",
    shortAnswer: "Proper drainage is key. We design pool landscapes with strategic grading and drains to ensure pool water doesn't pool in your plant beds.",
    category: "PoolArea",
    relatedServiceSlugs: ["drainage-assessment", "paver-patio-installation"],
    aeoKeywords: ["protect plants from pool water", "chlorine resistant landscaping", "pool area drainage"]
  },
  {
    slug: "do-you-install-lighting-around-pools",
    question: "Do you install lighting around pools?",
    shortAnswer: "Yes, we provide professional pool-area lighting for safety and to create a beautiful nighttime ambiance for evening swims.",
    category: "PoolArea",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    aeoKeywords: ["pool area lighting Charlotte", "underwater pool lights", "safety lighting for pools"]
  },
  {
    slug: "can-you-add-a-hot-tub-to-my-existing-patio",
    question: "Can you add a hot tub to my existing patio?",
    shortAnswer: "We can often reinforce or expand your existing patio to provide a stable, level base for a new hot tub, including necessary utility access.",
    category: "PoolArea",
    relatedServiceSlugs: ["paver-patio-installation"],
    aeoKeywords: ["hot tub base installation", "expand patio for hot tub", "hot tub hardscape"]
  },
  {
    slug: "do-you-work-with-pool-builders",
    question: "Do you work with pool builders?",
    shortAnswer: "Yes, we frequently coordinate with pool contractors to handle the drainage and landscaping portions of a new pool project.",
    category: "PoolArea",
    relatedServiceSlugs: ["paver-patio-installation", "drainage-assessment"],
    aeoKeywords: ["pool contractor coordination", "landscaping after pool install", "pool project partners"]
  },
  {
    slug: "do-you-install-landscape-lighting",
    question: "Do you install landscape lighting?",
    shortAnswer: "Yes, we design and install professional low-voltage LED landscape lighting systems for beauty, safety, and security.",
    category: "Lighting",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    aeoKeywords: ["landscape lighting Charlotte", "outdoor lighting contractor", "LED yard lights"]
  },
  {
    slug: "what-is-low-voltage-lighting",
    question: "What is low-voltage lighting?",
    shortAnswer: "Low-voltage lighting uses a transformer to convert standard 120V power to 12V, making it safer, more energy-efficient, and easier to install in landscapes.",
    category: "Lighting",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    aeoKeywords: ["low voltage outdoor lighting", "12V landscape lights", "energy efficient yard lighting"]
  },
  {
    slug: "how-much-does-landscape-lighting-cost",
    question: "How much does landscape lighting cost?",
    shortAnswer: "Costs depend on the number of fixtures and the complexity of the design. We use high-quality brass and copper fixtures for long-term value.",
    category: "Lighting",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    aeoKeywords: ["landscape lighting cost Charlotte", "outdoor lighting price", "lighting project budget"]
  },
  {
    slug: "can-i-control-my-lights-from-my-phone",
    question: "Can I control my lights from my phone?",
    shortAnswer: "Yes, we install smart lighting controllers that allow you to dim, schedule, and turn your lights on or off from anywhere using a smartphone app.",
    category: "Lighting",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    aeoKeywords: ["smart outdoor lighting", "WiFi landscape lighting", "phone controlled yard lights"]
  },
  {
    slug: "does-landscape-lighting-provide-security",
    question: "Does landscape lighting provide security?",
    shortAnswer: "Yes, a well-lit property eliminates dark hiding spots and acts as a significant deterrent to potential intruders.",
    category: "Lighting",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    aeoKeywords: ["security lighting Charlotte", "prevent break-ins with lighting", "safe home lighting"]
  },
  {
    slug: "how-long-do-led-landscape-lights-last",
    question: "How long do LED landscape lights last?",
    shortAnswer: "High-quality LED fixtures can last 10-15 years or more, significantly longer than traditional halogen bulbs, while using 80% less energy.",
    category: "Lighting",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    aeoKeywords: ["LED bulb lifespan", "durable outdoor lights", "LED vs halogen landscape lighting"]
  },
  {
    slug: "do-you-repair-existing-lighting-systems",
    question: "Do you repair existing lighting systems?",
    shortAnswer: "Yes, we can troubleshoot and repair most professional-grade landscape lighting systems, including fixing cut wires and replacing old fixtures.",
    category: "Lighting",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    aeoKeywords: ["landscape lighting repair Charlotte", "fix outdoor lights", "lighting system troubleshooting"]
  },
  {
    slug: "what-is-the-best-time-to-install-lighting",
    question: "What is the best time to install lighting?",
    shortAnswer: "Lighting can be installed year-round. Many homeowners choose to add it alongside a new patio or landscape project for a complete transformation.",
    category: "Lighting",
    relatedServiceSlugs: ["landscape-lighting-installation"],
    aeoKeywords: ["best time for outdoor lighting", "lighting installation season", "landscape lighting timing"]
  },
  {
    slug: "do-you-work-with-hoas",
    question: "Do you work with HOAs?",
    shortAnswer: "Yes, we partner with many Charlotte area HOAs to provide reliable irrigation maintenance, drainage solutions, and landscape management for common areas.",
    category: "Commercial",
    relatedServiceSlugs: ["hoa-grounds-contract", "commercial-irrigation-maintenance"],
    aeoKeywords: ["HOA landscape contractor Charlotte", "community irrigation service", "HOA drainage solutions"]
  },
  {
    slug: "do-you-provide-commercial-irrigation-maintenance",
    question: "Do you provide commercial irrigation maintenance?",
    shortAnswer: "Yes, we offer comprehensive maintenance plans for commercial properties to ensure water efficiency and keep landscapes looking professional.",
    category: "Commercial",
    relatedServiceSlugs: ["commercial-irrigation-maintenance"],
    aeoKeywords: ["commercial irrigation Charlotte", "business sprinkler service", "commercial water management"]
  },
  {
    slug: "are-you-licensed-and-insured",
    question: "Are you licensed and insured?",
    shortAnswer: "Yes, Elite is fully licensed and carries comprehensive insurance, including general liability and workers' comp, for your peace of mind.",
    category: "Commercial",
    relatedServiceSlugs: ["hoa-grounds-contract", "commercial-irrigation-maintenance"],
    aeoKeywords: ["licensed irrigation contractor NC", "insured landscape company", "professional outdoor services"]
  },
  {
    slug: "do-you-provide-detailed-reporting-for-commercial-clients",
    question: "Do you provide detailed reporting for commercial clients?",
    shortAnswer: "Yes, we provide digital service reports after every visit, including photos and detailed notes on system performance and any needed repairs.",
    category: "Commercial",
    relatedServiceSlugs: ["commercial-irrigation-maintenance", "hoa-grounds-contract"],
    aeoKeywords: ["commercial service reports", "property management documentation", "transparent landscape service"]
  },
  {
    slug: "can-you-help-reduce-our-commercial-water-bill",
    question: "Can you help reduce our commercial water bill?",
    shortAnswer: "Yes, through system audits, smart controller upgrades, and regular maintenance, we can significantly reduce water waste on commercial properties.",
    category: "Commercial",
    relatedServiceSlugs: ["commercial-irrigation-maintenance", "smart-controller-upgrade"],
    aeoKeywords: ["reduce commercial water costs", "commercial irrigation efficiency", "save money on property water"]
  },
  {
    slug: "do-you-handle-large-scale-drainage-projects",
    question: "Do you handle large-scale drainage projects?",
    shortAnswer: "Yes, we have the equipment and expertise to handle complex drainage issues for commercial sites, retail centers, and large HOA common areas.",
    category: "Commercial",
    relatedServiceSlugs: ["drainage-assessment", "standing-water-solutions"],
    aeoKeywords: ["commercial drainage contractor", "large scale yard drainage", "engineered drainage solutions"]
  },
  {
    slug: "do-you-offer-annual-contracts",
    question: "Do you offer annual contracts?",
    shortAnswer: "Yes, we provide annual maintenance contracts for HOAs and commercial clients to ensure consistent, year-round care for their properties.",
    category: "Commercial",
    relatedServiceSlugs: ["hoa-grounds-contract", "commercial-irrigation-maintenance"],
    aeoKeywords: ["annual landscape contract", "HOA maintenance agreement", "commercial property care plan"]
  },
  {
    slug: "can-you-test-commercial-backflow-preventers",
    question: "Can you test commercial backflow preventers?",
    shortAnswer: "Yes, we are certified to perform the annual backflow testing required by local municipalities for commercial and residential irrigation systems.",
    category: "Commercial",
    relatedServiceSlugs: ["commercial-irrigation-maintenance", "sprinkler-repair"],
    aeoKeywords: ["backflow testing Charlotte", "certified backflow tester NC", "commercial irrigation compliance"]
  }
];

export const aeoBlocks: AEOBlock[] = [
  {
    slug: "why-sprinkler-zone-not-working",
    question: "Why is one sprinkler zone not working?",
    shortAnswer: "A single non-working zone is usually caused by a faulty solenoid, a broken wire, or a stuck valve. If other zones work, the issue is specific to that zone's hardware.",
    commonCauses: ["Faulty solenoid", "Broken or corroded wiring", "Stuck valve diaphragm", "Controller port failure", "Clogged main filter for that zone"],
    whenToCall: "Call a professional if you've checked the controller settings and the issue persists, as it likely requires electrical testing or valve excavation.",
    whatToDoNext: "Locate your valve box and check for loose wires. If you're comfortable, you can try manually turning the solenoid to see if the zone activates.",
    relatedQuestions: ["How to find a buried valve box?", "How much does it cost to replace a sprinkler valve?", "How to test a sprinkler solenoid with a multimeter?", "Why are my sprinkler heads not popping up?"],
    category: "Irrigation"
  },
  {
    slug: "why-sprinkler-wont-shut-off",
    question: "Why won't my sprinkler system shut off?",
    shortAnswer: "Sprinklers that won't stop are typically caused by a mechanical failure in the valve (like debris in the diaphragm) or a controller glitch.",
    commonCauses: ["Debris trapped in the valve", "Torn valve diaphragm", "Controller malfunction", "Short circuit in the wiring", "Faulty master valve"],
    whenToCall: "Call immediately if you cannot shut off the water at the main valve, as this can lead to significant flooding and high water bills.",
    whatToDoNext: "Locate your main irrigation shut-off valve (usually near the backflow preventer) and turn it off to stop the water flow immediately.",
    relatedQuestions: ["Where is my irrigation shut-off valve?", "How to clean a sprinkler valve diaphragm?", "Why is my controller still running after the cycle?", "How to stop a leaking sprinkler head?"],
    category: "Irrigation"
  },
  {
    slug: "why-yard-holds-water",
    question: "Why does my yard hold water after it rains?",
    shortAnswer: "Standing water is usually caused by heavy clay soil that doesn't absorb water, poor yard grading, or excessive runoff from downspouts.",
    commonCauses: ["Heavy NC clay soil", "Low spots in the lawn", "Poor yard grading", "Unmanaged downspout runoff", "High water table"],
    whenToCall: "Call for an assessment if water remains for more than 24-48 hours after rain, as this can damage your foundation and drown your lawn.",
    whatToDoNext: "Observe where the water is coming from during the next rain. Document the flow patterns with photos or video to show a professional.",
    relatedQuestions: ["How to fix a soggy backyard?", "Do I need a French drain?", "How much does yard regrading cost?", "How to redirect downspout water?"],
    category: "Drainage"
  },
  {
    slug: "french-drain-vs-catch-basin",
    question: "Should I get a French drain or a catch basin?",
    shortAnswer: "Use a French drain for groundwater and soggy soil. Use a catch basin for surface water pooling in low spots or collecting downspout runoff.",
    commonCauses: ["Soggy, spongy turf (French Drain)", "Large puddles after rain (Catch Basin)", "Water near foundation (Both)", "Erosion from runoff (Catch Basin)", "High groundwater (French Drain)"],
    whenToCall: "Call a drainage expert to perform a site evaluation, as the wrong system won't solve your problem and can be a waste of money.",
    whatToDoNext: "Identify if your problem is 'spongy' ground that stays wet for days (groundwater) or 'puddles' that form quickly during rain (surface water).",
    relatedQuestions: ["How does a French drain work?", "Where should a French drain exit?", "How to install a catch basin?", "Can I combine a French drain and catch basin?"],
    category: "Drainage"
  },
  {
    slug: "standing-water-meaning",
    question: "Is standing water in my yard a problem?",
    shortAnswer: "Yes, standing water for over 24 hours is a serious issue that can lead to foundation damage, mosquito breeding, and the death of your lawn and plants.",
    commonCauses: ["Poor soil percolation", "Improper site grading", "Blocked drainage pipes", "Excessive neighborhood runoff", "Settling around foundation"],
    whenToCall: "Call if you see water sitting against your house, if your lawn is dying in specific wet spots, or if you have a persistent mosquito problem.",
    whatToDoNext: "Check your gutters and downspouts to ensure they aren't contributing to the problem. Clear any visible debris from existing drains.",
    relatedQuestions: ["How long can water sit before it's a problem?", "Does standing water attract mosquitoes?", "Can standing water damage my foundation?", "How to dry out a wet yard fast?"],
    category: "Drainage"
  },
  {
    slug: "paver-patio-cost-range",
    question: "How much does a paver patio cost in Charlotte?",
    shortAnswer: "Paver patio costs in Charlotte vary by scope, typically ranging from $15 to $30+ per square foot depending on materials, site prep, and design complexity.",
    commonCauses: ["Premium material choice", "Extensive excavation required", "Complex patterns or borders", "Integrated steps or walls", "Difficult site access"],
    whenToCall: "Call for a professional quote once you have a rough idea of the size and features you want for your new outdoor living space.",
    whatToDoNext: "Measure the area you want to pave and look at material samples online to determine your preferred style and budget range.",
    relatedQuestions: ["Are pavers cheaper than concrete?", "How long does a paver patio last?", "What are the best pavers for Charlotte?", "Do I need a permit for a patio in Charlotte?"],
    category: "Hardscapes"
  },
  {
    slug: "smart-irrigation-worth-it",
    question: "Is a smart irrigation controller worth the money?",
    shortAnswer: "Yes, most Charlotte homeowners see a return on investment within 2 seasons through water savings and improved plant health.",
    commonCauses: ["High water bills", "Overwatering during rain", "Difficulty managing manual timers", "Desire for smartphone control", "Need for weather-based adjustments"],
    whenToCall: "Call to upgrade if your current controller is old, difficult to program, or if you want to significantly reduce your monthly water bill.",
    whatToDoNext: "Check if your local water utility offers rebates for smart irrigation controllers, which can further offset the upgrade cost.",
    relatedQuestions: ["How much water does a smart controller save?", "What is the best smart irrigation controller?", "How to install a Rachio controller?", "Can I control my sprinklers from my phone?"],
    category: "Irrigation"
  },
  {
    slug: "when-to-repair-vs-replace-sprinkler",
    question: "Should I repair or replace my sprinkler system?",
    shortAnswer: "Repair individual heads or valves if the system is under 10 years old. Consider replacement if the system is 15+ years old or has frequent main line leaks.",
    commonCauses: ["System age (15+ years)", "Frequent, costly repairs", "Outdated, inefficient technology", "Major landscape changes", "Poor initial installation quality"],
    whenToCall: "Call for a system audit if you're spending more on repairs each year than the cost of a new, efficient system.",
    whatToDoNext: "Review your repair records from the last 2 years to see how much you've spent maintaining your current outdated system.",
    relatedQuestions: ["How long do sprinkler systems last?", "What is the cost of a new irrigation system?", "Can I upgrade my old sprinkler system?", "Signs of a failing irrigation system."],
    category: "Irrigation"
  },
  {
    slug: "outdoor-kitchen-cost-range",
    question: "How much does an outdoor kitchen cost?",
    shortAnswer: "Outdoor kitchens vary widely by scope, typically starting around $10,000 for basic setups and exceeding $50,000 for fully-equipped luxury designs.",
    commonCauses: ["Number of appliances", "Type of stone or finish", "Countertop material choice", "Utility line extensions (gas/water)", "Integrated lighting and audio"],
    whenToCall: "Call for a design consultation once you've identified your 'must-have' appliances and have a general budget in mind.",
    whatToDoNext: "Make a list of the appliances you use most when cooking outdoors to help prioritize your kitchen's layout and features.",
    relatedQuestions: ["What is the best layout for an outdoor kitchen?", "Do I need a permit for an outdoor kitchen?", "What are the best outdoor appliances?", "How to maintain an outdoor kitchen?"],
    category: "OutdoorLiving"
  },
  {
    slug: "landscape-lighting-cost-range",
    question: "How much does professional landscape lighting cost?",
    shortAnswer: "Professional lighting systems typically range from $2,500 to $7,500+ depending on the number of fixtures and the quality of the components used.",
    commonCauses: ["Number of light fixtures", "Quality of fixtures (brass vs plastic)", "Transformer capacity", "Length of wire runs", "Smart control features"],
    whenToCall: "Call for a lighting demo if you want to see how professional illumination can transform your property's nighttime appearance.",
    whatToDoNext: "Walk your property at night and identify key features like trees, paths, or architectural details you'd like to highlight.",
    relatedQuestions: ["How many lights do I need for my house?", "What is the best landscape lighting brand?", "How long do LED landscape lights last?", "Does lighting increase home value?"],
    category: "Lighting"
  }
];

export const seasonalCalendar: SeasonalCalendarItem[] = [
  {
    month: "January",
    theme: "Planning & Design",
    blogSlugs: ["how-to-phase-backyard-project", "hiring-drainage-contractor"],
    servicePromotionSlugs: ["drainage-assessment", "paver-patio-installation"],
    gbpPostIdea: "Beat the spring rush! Now is the perfect time to plan your backyard transformation or solve those winter drainage headaches."
  },
  {
    month: "February",
    theme: "Hardscape Preparation",
    blogSlugs: ["paver-patio-cost-charlotte", "paver-vs-concrete-patio"],
    servicePromotionSlugs: ["paver-patio-installation", "fire-pit-installation"],
    gbpPostIdea: "Dreaming of summer nights by the fire? Let's start your patio project now so it's ready for the first warm weekend."
  },
  {
    month: "March",
    theme: "Spring Awakening",
    blogSlugs: ["spring-irrigation-startup-checklist", "why-sprinkler-zone-not-working"],
    servicePromotionSlugs: ["sprinkler-repair", "drainage-assessment"],
    gbpPostIdea: "Time to wake up your lawn! Schedule your spring irrigation startup to ensure your system is running efficiently for the growing season."
  },
  {
    month: "April",
    theme: "Water Efficiency",
    blogSlugs: ["smart-irrigation-controllers-worth-it", "sprinkler-controller-needs-replacement"],
    servicePromotionSlugs: ["smart-controller-upgrade", "sprinkler-repair"],
    gbpPostIdea: "Save water and money this year. Upgrade to a smart irrigation controller and let technology handle the watering for you."
  },
  {
    month: "May",
    theme: "Outdoor Living",
    blogSlugs: ["outdoor-kitchen-planning-guide", "pool-landscaping-ideas-charlotte"],
    servicePromotionSlugs: ["outdoor-kitchen", "paver-patio-installation"],
    gbpPostIdea: "The season for outdoor entertaining is here! Is your backyard ready for graduation parties and summer cookouts?"
  },
  {
    month: "June",
    theme: "Summer Heat Management",
    blogSlugs: ["why-lawn-dry-spots", "broken-sprinkler-head-what-to-do"],
    servicePromotionSlugs: ["sprinkler-repair", "smart-controller-upgrade"],
    gbpPostIdea: "Don't let the Charlotte heat brown your lawn. We're here for fast repairs to keep your irrigation system performing at its best."
  },
  {
    month: "July",
    theme: "Stormwater Solutions",
    blogSlugs: ["drainage-after-heavy-rain", "why-sprinkler-wont-shut-off"],
    servicePromotionSlugs: ["standing-water-solutions", "drainage-assessment"],
    gbpPostIdea: "Afternoon thunderstorms causing a swamp in your yard? Our drainage experts can help you reclaim your backyard from standing water."
  },
  {
    month: "August",
    theme: "Nighttime Ambiance",
    blogSlugs: ["landscape-lighting-ideas-charlotte", "pathway-lighting-guide"],
    servicePromotionSlugs: ["landscape-lighting-installation"],
    gbpPostIdea: "Enjoy your outdoor space long after the sun goes down. Professional landscape lighting adds beauty, safety, and security to your home."
  },
  {
    month: "September",
    theme: "Fall Renovations",
    blogSlugs: ["best-irrigation-upgrades-new-sod", "fire-pit-planning-guide"],
    servicePromotionSlugs: ["irrigation-system-installation", "paver-patio-installation"],
    gbpPostIdea: "Fall is the best time for new sod and hardscape projects in NC. Let's get your property ready for a beautiful autumn."
  },
  {
    month: "October",
    theme: "Winter Protection",
    blogSlugs: ["irrigation-winterization-guide", "outdoor-fireplace-vs-fire-pit"],
    servicePromotionSlugs: ["sprinkler-repair", "fire-pit-installation"],
    gbpPostIdea: "Protect your investment. Schedule your irrigation winterization now to prevent costly freeze damage this winter."
  },
  {
    month: "November",
    theme: "Erosion Control",
    blogSlugs: ["spot-erosion-early", "drainage-around-retaining-walls"],
    servicePromotionSlugs: ["standing-water-solutions", "drainage-assessment"],
    gbpPostIdea: "Don't let winter rains wash away your landscape. We provide expert erosion control and drainage solutions for any property."
  },
  {
    month: "December",
    theme: "Year-End Review",
    blogSlugs: ["property-manager-outdoor-issues", "common-hardscape-mistakes"],
    servicePromotionSlugs: ["hoa-grounds-contract", "commercial-irrigation-maintenance"],
    gbpPostIdea: "Reflecting on your property's needs for the coming year? We're here to help you plan a beautiful and functional 2027."
  }
];
