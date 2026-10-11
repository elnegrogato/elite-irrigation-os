// data/locations_full.ts
// Elite — Expanded Service Area for Charlotte + ~200 miles
//
// Notes:
// - "ring" is an ops heuristic: 0 (core), 1 (metro), 2 (regional), 3 (major metro anchors), 4 (edge/satellite).
// - Includes many incorporated towns + key market locations (Charlotte neighborhoods, lake communities).
// - You can prune/expand based on actual coverage and staffing.
//
// Sources used for name universe: NC & SC municipality lists.

export type ServiceRing = 0 | 1 | 2 | 3 | 4;

export type Location = {
  slug: string;
  name: string;
  state: "NC" | "SC" | "GA" | "TN" | "VA";
  ring: ServiceRing;
  countyHint?: string;
  tags?: string[];
  neighbors?: string[];
};

export const homeBase: Location = {
  slug: "harrisburg",
  name: "Harrisburg",
  state: "NC",
  ring: 0,
  countyHint: "Cabarrus",
  tags: ["home-base"],
  neighbors: ["concord", "charlotte", "mint-hill", "midland"],
};

export const locationsFull: Location[] = [
  // ─────────────────────────────────────────
  // RING 0 — Core (Harrisburg / NE Charlotte)
  // ─────────────────────────────────────────
  { slug: "harrisburg", name: "Harrisburg", state: "NC", ring: 0, countyHint: "Cabarrus", tags: ["home-base"], neighbors: ["concord","charlotte","mint-hill","midland"] },
  { slug: "concord", name: "Concord", state: "NC", ring: 0, countyHint: "Cabarrus", tags: ["metro-suburb","builder-heavy"], neighbors: ["harrisburg","kannapolis","charlotte","mount-pleasant-nc"] },
  { slug: "kannapolis", name: "Kannapolis", state: "NC", ring: 0, countyHint: "Cabarrus/Rowan", tags: ["metro-suburb"], neighbors: ["concord","salisbury","landis"] },
  { slug: "midland", name: "Midland", state: "NC", ring: 0, countyHint: "Cabarrus", neighbors: ["harrisburg","mint-hill","locust"] },
  { slug: "mount-pleasant-nc", name: "Mount Pleasant", state: "NC", ring: 0, countyHint: "Cabarrus", neighbors: ["concord","stanfield","locust"] },

  // Charlotte core + close-in towns
  { slug: "charlotte", name: "Charlotte", state: "NC", ring: 0, countyHint: "Mecklenburg", tags: ["metro-core"], neighbors: ["matthews","mint-hill","pineville","huntersville"] },
  { slug: "matthews", name: "Matthews", state: "NC", ring: 0, countyHint: "Mecklenburg", tags: ["hoas"], neighbors: ["charlotte","mint-hill","stallings","pineville"] },
  { slug: "mint-hill", name: "Mint Hill", state: "NC", ring: 0, countyHint: "Mecklenburg/Union", tags: ["hoas"], neighbors: ["charlotte","matthews","indian-trail","midland"] },
  { slug: "pineville", name: "Pineville", state: "NC", ring: 0, countyHint: "Mecklenburg", neighbors: ["charlotte","ballantyne","fort-mill"] },

  // Charlotte neighborhoods as “locations”
  { slug: "ballantyne", name: "Ballantyne", state: "NC", ring: 0, tags: ["charlotte-neighborhood","hoas"], neighbors: ["pineville","waxhaw"] },
  { slug: "southend", name: "South End", state: "NC", ring: 0, tags: ["charlotte-neighborhood"], neighbors: ["charlotte"] },
  { slug: "dilworth", name: "Dilworth", state: "NC", ring: 0, tags: ["charlotte-neighborhood"], neighbors: ["charlotte"] },
  { slug: "south-park", name: "SouthPark", state: "NC", ring: 0, tags: ["charlotte-neighborhood"], neighbors: ["charlotte"] },
  { slug: "plaza-midwood", name: "Plaza Midwood", state: "NC", ring: 0, tags: ["charlotte-neighborhood"], neighbors: ["charlotte"] },
  { slug: "noda", name: "NoDa", state: "NC", ring: 0, tags: ["charlotte-neighborhood"], neighbors: ["charlotte"] },
  { slug: "university-city", name: "University City", state: "NC", ring: 0, tags: ["charlotte-neighborhood","multifamily"], neighbors: ["charlotte","huntersville"] },

  // ─────────────────────────────────────────
  // RING 1 — Metro Expansion (Meck/Union/Gaston/Iredell/Rowan + York SC)
  // ─────────────────────────────────────────
  // Mecklenburg north / lake corridor
  { slug: "huntersville", name: "Huntersville", state: "NC", ring: 1, countyHint: "Mecklenburg", tags: ["lake","hoas"], neighbors: ["cornelius","davidson","mooresville","charlotte"] },
  { slug: "cornelius", name: "Cornelius", state: "NC", ring: 1, countyHint: "Mecklenburg", tags: ["lake"], neighbors: ["huntersville","davidson"] },
  { slug: "davidson", name: "Davidson", state: "NC", ring: 1, countyHint: "Mecklenburg", tags: ["college-town","lake"], neighbors: ["cornelius","mooresville"] },

  // Union County cluster
  { slug: "indian-trail", name: "Indian Trail", state: "NC", ring: 1, countyHint: "Union", tags: ["hoas"], neighbors: ["stallings","monroe","mint-hill"] },
  { slug: "stallings", name: "Stallings", state: "NC", ring: 1, countyHint: "Union/Mecklenburg", tags: ["hoas"], neighbors: ["matthews","indian-trail"] },
  { slug: "monroe", name: "Monroe", state: "NC", ring: 1, countyHint: "Union", neighbors: ["indian-trail","waxhaw","wingate","marshville"] },
  { slug: "waxhaw", name: "Waxhaw", state: "NC", ring: 1, countyHint: "Union", tags: ["luxury","builder-heavy"], neighbors: ["weddington","marvin","monroe","fort-mill"] },
  { slug: "weddington", name: "Weddington", state: "NC", ring: 1, countyHint: "Union", tags: ["luxury"], neighbors: ["waxhaw","matthews"] },
  { slug: "marvin", name: "Marvin", state: "NC", ring: 1, countyHint: "Union", tags: ["luxury","hoas"], neighbors: ["waxhaw","ballantyne"] },
  { slug: "mineral-springs", name: "Mineral Springs", state: "NC", ring: 1, countyHint: "Union", neighbors: ["waxhaw","monroe"] },
  { slug: "fairview-nc", name: "Fairview", state: "NC", ring: 1, countyHint: "Union", neighbors: ["monroe","mint-hill"] },
  { slug: "hemby-bridge", name: "Hemby Bridge", state: "NC", ring: 1, countyHint: "Union", neighbors: ["indian-trail","monroe"] },
  { slug: "unionville", name: "Unionville", state: "NC", ring: 1, countyHint: "Union", neighbors: ["monroe","marshville"] },
  { slug: "wingate", name: "Wingate", state: "NC", ring: 1, countyHint: "Union", neighbors: ["monroe","marshville"] },
  { slug: "marshville", name: "Marshville", state: "NC", ring: 1, countyHint: "Union", neighbors: ["monroe","wadesboro"] },

  // Gaston County
  { slug: "gastonia", name: "Gastonia", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["belmont","mount-holly","dallas-nc","charlotte"] },
  { slug: "belmont", name: "Belmont", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["gastonia","mcadenville","charlotte"] },
  { slug: "mount-holly", name: "Mount Holly", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["belmont","gastonia","charlotte"] },
  { slug: "mcadenville", name: "McAdenville", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["belmont","lowell"] },
  { slug: "cramerton", name: "Cramerton", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["belmont","gastonia"] },
  { slug: "lowell", name: "Lowell", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["gastonia","ranlo"] },
  { slug: "ranlo", name: "Ranlo", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["gastonia","lowell"] },
  { slug: "dallas-nc", name: "Dallas", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["gastonia","stanley-nc"] },
  { slug: "stanley-nc", name: "Stanley", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["dallas-nc","lincolnton"] },
  { slug: "bessemer-city", name: "Bessemer City", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["gastonia","kings-mountain"] },
  { slug: "cherryville", name: "Cherryville", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["lincolnton","shelby"] },
  { slug: "high-shoals", name: "High Shoals", state: "NC", ring: 1, countyHint: "Gaston", neighbors: ["dallas-nc","lincolnton"] },

  // Iredell County / Lake Norman
  { slug: "mooresville", name: "Mooresville", state: "NC", ring: 1, countyHint: "Iredell", tags: ["lake","builder-heavy"], neighbors: ["huntersville","statesville","troutman","davidson"] },
  { slug: "troutman", name: "Troutman", state: "NC", ring: 1, countyHint: "Iredell", neighbors: ["mooresville","statesville"] },
  { slug: "statesville", name: "Statesville", state: "NC", ring: 1, countyHint: "Iredell", neighbors: ["troutman","mooresville","taylorsville","salisbury"] },
  { slug: "harmony", name: "Harmony", state: "NC", ring: 1, countyHint: "Iredell", neighbors: ["statesville"] },
  { slug: "love-valley", name: "Love Valley", state: "NC", ring: 1, countyHint: "Iredell", neighbors: ["statesville"] },

  // Rowan County
  { slug: "salisbury", name: "Salisbury", state: "NC", ring: 1, countyHint: "Rowan", neighbors: ["spencer-nc","china-grove","landis","statesville"] },
  { slug: "spencer-nc", name: "Spencer", state: "NC", ring: 1, countyHint: "Rowan", neighbors: ["salisbury"] },
  { slug: "east-spencer", name: "East Spencer", state: "NC", ring: 1, countyHint: "Rowan", neighbors: ["salisbury"] },
  { slug: "china-grove", name: "China Grove", state: "NC", ring: 1, countyHint: "Rowan", neighbors: ["landis","kannapolis"] },
  { slug: "landis", name: "Landis", state: "NC", ring: 1, countyHint: "Rowan", neighbors: ["china-grove","kannapolis"] },
  { slug: "granite-quarry", name: "Granite Quarry", state: "NC", ring: 1, countyHint: "Rowan", neighbors: ["salisbury"] },
  { slug: "faith", name: "Faith", state: "NC", ring: 1, countyHint: "Rowan", neighbors: ["salisbury"] },
  { slug: "cleveland-nc", name: "Cleveland", state: "NC", ring: 1, countyHint: "Rowan", neighbors: ["salisbury"] },

  // Stanly County
  { slug: "albemarle", name: "Albemarle", state: "NC", ring: 1, countyHint: "Stanly", neighbors: ["locust","oakboro","norwood"] },
  { slug: "locust", name: "Locust", state: "NC", ring: 1, countyHint: "Stanly/Cabarrus", neighbors: ["stanfield","midland","albemarle"] },
  { slug: "stanfield", name: "Stanfield", state: "NC", ring: 1, countyHint: "Stanly/Cabarrus", neighbors: ["locust","mount-pleasant-nc"] },
  { slug: "oakboro", name: "Oakboro", state: "NC", ring: 1, countyHint: "Stanly", neighbors: ["albemarle"] },
  { slug: "norwood", name: "Norwood", state: "NC", ring: 1, countyHint: "Stanly", neighbors: ["albemarle"] },
  { slug: "badin", name: "Badin", state: "NC", ring: 1, countyHint: "Stanly", neighbors: ["albemarle"] },
  { slug: "misenheimer", name: "Misenheimer", state: "NC", ring: 1, countyHint: "Stanly", neighbors: ["albemarle"] },

  // Anson County
  { slug: "wadesboro", name: "Wadesboro", state: "NC", ring: 1, countyHint: "Anson", neighbors: ["polkton","lilesville","marshville"] },
  { slug: "polkton", name: "Polkton", state: "NC", ring: 1, countyHint: "Anson", neighbors: ["wadesboro"] },
  { slug: "lilesville", name: "Lilesville", state: "NC", ring: 1, countyHint: "Anson", neighbors: ["wadesboro"] },
  { slug: "mcfarlan", name: "McFarlan", state: "NC", ring: 1, countyHint: "Anson", neighbors: ["wadesboro"] },
  { slug: "morven", name: "Morven", state: "NC", ring: 1, countyHint: "Anson", neighbors: ["wadesboro"] },
  { slug: "peachland", name: "Peachland", state: "NC", ring: 1, countyHint: "Anson", neighbors: ["wadesboro"] },
  { slug: "ansonville", name: "Ansonville", state: "NC", ring: 1, countyHint: "Anson", neighbors: ["wadesboro"] },

  // York County SC (metro south)
  { slug: "fort-mill", name: "Fort Mill", state: "SC", ring: 1, countyHint: "York", tags: ["metro-suburb","hoas"], neighbors: ["tega-cay","rock-hill","charlotte"] },
  { slug: "tega-cay", name: "Tega Cay", state: "SC", ring: 1, countyHint: "York", tags: ["lake","hoas"], neighbors: ["fort-mill","rock-hill"] },
  { slug: "rock-hill", name: "Rock Hill", state: "SC", ring: 1, countyHint: "York", neighbors: ["fort-mill","york-sc","clover"] },
  { slug: "york-sc", name: "York", state: "SC", ring: 1, countyHint: "York", neighbors: ["rock-hill","clover"] },
  { slug: "clover", name: "Clover", state: "SC", ring: 1, countyHint: "York", neighbors: ["york-sc","rock-hill"] },

  // Lancaster SC
  { slug: "lancaster", name: "Lancaster", state: "SC", ring: 1, countyHint: "Lancaster", neighbors: ["heath-springs","kershaw-sc","waxhaw"] },
  { slug: "heath-springs", name: "Heath Springs", state: "SC", ring: 1, countyHint: "Lancaster", neighbors: ["lancaster"] },
  { slug: "kershaw-sc", name: "Kershaw", state: "SC", ring: 1, countyHint: "Lancaster", neighbors: ["lancaster"] },

  // ─────────────────────────────────────────
  // RING 2 — Regional (Triad / Foothills / Upstate SC)
  // ─────────────────────────────────────────
  // Catawba / Burke / Caldwell / Cleveland / Rutherford / Lincoln
  { slug: "lincolnton", name: "Lincolnton", state: "NC", ring: 2, countyHint: "Lincoln", neighbors: ["stanley-nc","newton","hickory"] },
  { slug: "newton", name: "Newton", state: "NC", ring: 2, countyHint: "Catawba", neighbors: ["conover","hickory","maiden"] },
  { slug: "conover", name: "Conover", state: "NC", ring: 2, countyHint: "Catawba", neighbors: ["newton","hickory"] },
  { slug: "maiden", name: "Maiden", state: "NC", ring: 2, countyHint: "Catawba", neighbors: ["newton","lincolnton"] },
  { slug: "hickory", name: "Hickory", state: "NC", ring: 2, countyHint: "Catawba", tags: ["metro"], neighbors: ["newton","lenoir","morganton"] },
  { slug: "brookford", name: "Brookford", state: "NC", ring: 2, countyHint: "Catawba", neighbors: ["hickory"] },
  { slug: "morganton", name: "Morganton", state: "NC", ring: 2, countyHint: "Burke", neighbors: ["hickory","valdese","lenoir"] },
  { slug: "valdese", name: "Valdese", state: "NC", ring: 2, countyHint: "Burke", neighbors: ["morganton"] },
  { slug: "drexel", name: "Drexel", state: "NC", ring: 2, countyHint: "Burke", neighbors: ["morganton"] },
  { slug: "hildebran", name: "Hildebran", state: "NC", ring: 2, countyHint: "Burke", neighbors: ["morganton"] },
  { slug: "lenoir", name: "Lenoir", state: "NC", ring: 2, countyHint: "Caldwell", neighbors: ["hickory"] },
  { slug: "hudson", name: "Hudson", state: "NC", ring: 2, countyHint: "Caldwell", neighbors: ["lenoir"] },
  { slug: "granite-falls", name: "Granite Falls", state: "NC", ring: 2, countyHint: "Caldwell", neighbors: ["lenoir","hickory"] },

  { slug: "shelby", name: "Shelby", state: "NC", ring: 2, countyHint: "Cleveland", neighbors: ["kings-mountain","boiling-springs-nc","forest-city"] },
  { slug: "kings-mountain", name: "Kings Mountain", state: "NC", ring: 2, countyHint: "Cleveland", neighbors: ["shelby","bessemer-city"] },
  { slug: "boiling-springs-nc", name: "Boiling Springs", state: "NC", ring: 2, countyHint: "Cleveland", neighbors: ["shelby"] },
  { slug: "lawndale", name: "Lawndale", state: "NC", ring: 2, countyHint: "Cleveland", neighbors: ["shelby"] },
  { slug: "polkville", name: "Polkville", state: "NC", ring: 2, countyHint: "Cleveland", neighbors: ["shelby"] },

  { slug: "forest-city", name: "Forest City", state: "NC", ring: 2, countyHint: "Rutherford", neighbors: ["spindale","rutherfordton"] },
  { slug: "spindale", name: "Spindale", state: "NC", ring: 2, countyHint: "Rutherford", neighbors: ["forest-city","rutherfordton"] },
  { slug: "rutherfordton", name: "Rutherfordton", state: "NC", ring: 2, countyHint: "Rutherford", neighbors: ["spindale","lake-lure"] },
  { slug: "lake-lure", name: "Lake Lure", state: "NC", ring: 2, countyHint: "Rutherford", neighbors: ["rutherfordton"] },

  // Triad core
  { slug: "greensboro", name: "Greensboro", state: "NC", ring: 2, countyHint: "Guilford", tags: ["metro"], neighbors: ["high-point","winston-salem"] },
  { slug: "high-point", name: "High Point", state: "NC", ring: 2, countyHint: "Guilford/Randolph/Davidson", tags: ["metro"], neighbors: ["greensboro","thomasville"] },
  { slug: "winston-salem", name: "Winston-Salem", state: "NC", ring: 2, countyHint: "Forsyth", tags: ["metro"], neighbors: ["kernersville","greensboro"] },
  { slug: "kernersville", name: "Kernersville", state: "NC", ring: 2, countyHint: "Forsyth/Guilford", neighbors: ["winston-salem","greensboro"] },
  { slug: "jamestown", name: "Jamestown", state: "NC", ring: 2, countyHint: "Guilford", neighbors: ["greensboro","high-point"] },
  { slug: "oak-ridge", name: "Oak Ridge", state: "NC", ring: 2, countyHint: "Guilford", neighbors: ["summerfield","greensboro"] },
  { slug: "summerfield", name: "Summerfield", state: "NC", ring: 2, countyHint: "Guilford", neighbors: ["oak-ridge","greensboro"] },
  { slug: "asheboro", name: "Asheboro", state: "NC", ring: 2, countyHint: "Randolph", neighbors: ["randleman","archdale"] },
  { slug: "archdale", name: "Archdale", state: "NC", ring: 2, countyHint: "Randolph", neighbors: ["high-point","asheboro"] },
  { slug: "randleman", name: "Randleman", state: "NC", ring: 2, countyHint: "Randolph", neighbors: ["asheboro"] },
  { slug: "thomasville", name: "Thomasville", state: "NC", ring: 2, countyHint: "Davidson", neighbors: ["high-point","lexington"] },
  { slug: "lexington", name: "Lexington", state: "NC", ring: 2, countyHint: "Davidson", neighbors: ["thomasville"] },
  { slug: "burlington", name: "Burlington", state: "NC", ring: 2, countyHint: "Alamance", neighbors: ["graham","mebane"] },
  { slug: "graham", name: "Graham", state: "NC", ring: 2, countyHint: "Alamance", neighbors: ["burlington"] },
  { slug: "mebane", name: "Mebane", state: "NC", ring: 2, countyHint: "Alamance/Orange", neighbors: ["burlington","hillsborough"] },
  { slug: "elon", name: "Elon", state: "NC", ring: 2, countyHint: "Alamance", neighbors: ["burlington"] },

  // Upstate SC (Greenville/Spartanburg corridor)
  { slug: "spartanburg", name: "Spartanburg", state: "SC", ring: 2, countyHint: "Spartanburg", tags: ["metro"], neighbors: ["greer","inman","duncan"] },
  { slug: "greenville", name: "Greenville", state: "SC", ring: 2, countyHint: "Greenville", tags: ["metro"], neighbors: ["mauldin","simpsonville","travelers-rest","greer"] },
  { slug: "greer", name: "Greer", state: "SC", ring: 2, countyHint: "Greenville/Spartanburg", neighbors: ["greenville","spartanburg"] },
  { slug: "simpsonville", name: "Simpsonville", state: "SC", ring: 2, countyHint: "Greenville", neighbors: ["mauldin","greenville"] },
  { slug: "mauldin", name: "Mauldin", state: "SC", ring: 2, countyHint: "Greenville", neighbors: ["greenville","simpsonville"] },
  { slug: "fountain-inn", name: "Fountain Inn", state: "SC", ring: 2, countyHint: "Greenville/Laurens", neighbors: ["simpsonville"] },
  { slug: "travelers-rest", name: "Travelers Rest", state: "SC", ring: 2, countyHint: "Greenville", neighbors: ["greenville"] },
  { slug: "inman", name: "Inman", state: "SC", ring: 2, countyHint: "Spartanburg", neighbors: ["spartanburg"] },
  { slug: "duncan", name: "Duncan", state: "SC", ring: 2, countyHint: "Spartanburg", neighbors: ["spartanburg","greer"] },
  { slug: "lyman", name: "Lyman", state: "SC", ring: 2, countyHint: "Spartanburg", neighbors: ["greer"] },
  { slug: "wellford", name: "Wellford", state: "SC", ring: 2, countyHint: "Spartanburg", neighbors: ["spartanburg"] },
  { slug: "easley", name: "Easley", state: "SC", ring: 2, countyHint: "Pickens", neighbors: ["greenville","pickens-sc"] },
  { slug: "pickens-sc", name: "Pickens", state: "SC", ring: 2, countyHint: "Pickens", neighbors: ["easley"] },
  { slug: "liberty-sc", name: "Liberty", state: "SC", ring: 2, countyHint: "Pickens", neighbors: ["easley"] },
  { slug: "anderson", name: "Anderson", state: "SC", ring: 2, countyHint: "Anderson", neighbors: ["clemson","greenville"] },
  { slug: "clemson", name: "Clemson", state: "SC", ring: 2, countyHint: "Pickens/Anderson", neighbors: ["anderson","seneca"] },
  { slug: "seneca", name: "Seneca", state: "SC", ring: 2, countyHint: "Oconee", neighbors: ["clemson","walhalla"] },
  { slug: "walhalla", name: "Walhalla", state: "SC", ring: 2, countyHint: "Oconee", neighbors: ["seneca"] },

  // ─────────────────────────────────────────
  // RING 3 — Major metro anchors (Triangle + Columbia + Asheville)
  // ─────────────────────────────────────────
  { slug: "raleigh", name: "Raleigh", state: "NC", ring: 3, countyHint: "Wake", tags: ["metro"], neighbors: ["cary","apex","durham"] },
  { slug: "durham", name: "Durham", state: "NC", ring: 3, countyHint: "Durham", tags: ["metro"], neighbors: ["raleigh","chapel-hill","cary"] },
  { slug: "cary", name: "Cary", state: "NC", ring: 3, countyHint: "Wake", tags: ["metro-suburb"], neighbors: ["raleigh","apex"] },
  { slug: "apex", name: "Apex", state: "NC", ring: 3, countyHint: "Wake", neighbors: ["cary","holly-springs"] },
  { slug: "holly-springs", name: "Holly Springs", state: "NC", ring: 3, countyHint: "Wake", neighbors: ["apex","fuquay-varina"] },
  { slug: "fuquay-varina", name: "Fuquay-Varina", state: "NC", ring: 3, countyHint: "Wake", neighbors: ["holly-springs"] },
  { slug: "chapel-hill", name: "Chapel Hill", state: "NC", ring: 3, countyHint: "Orange", neighbors: ["carrboro","durham"] },
  { slug: "carrboro", name: "Carrboro", state: "NC", ring: 3, countyHint: "Orange", neighbors: ["chapel-hill"] },
  { slug: "hillsborough", name: "Hillsborough", state: "NC", ring: 3, countyHint: "Orange", neighbors: ["mebane","durham"] },

  { slug: "columbia", name: "Columbia", state: "SC", ring: 3, countyHint: "Richland", tags: ["metro"], neighbors: ["lexington-sc","cayce","west-columbia"] },
  { slug: "lexington-sc", name: "Lexington", state: "SC", ring: 3, countyHint: "Lexington", neighbors: ["columbia","chapin"] },
  { slug: "west-columbia", name: "West Columbia", state: "SC", ring: 3, countyHint: "Lexington", neighbors: ["columbia"] },
  { slug: "cayce", name: "Cayce", state: "SC", ring: 3, countyHint: "Lexington", neighbors: ["columbia"] },
  { slug: "irmo", name: "Irmo", state: "SC", ring: 3, countyHint: "Lexington/Richland", neighbors: ["columbia","chapin"] },
  { slug: "chapin", name: "Chapin", state: "SC", ring: 3, countyHint: "Lexington", neighbors: ["lexington-sc","irmo"] },

  { slug: "asheville", name: "Asheville", state: "NC", ring: 3, countyHint: "Buncombe", tags: ["metro","mountains"], neighbors: ["hendersonville"] },
  { slug: "hendersonville", name: "Hendersonville", state: "NC", ring: 3, countyHint: "Henderson", tags: ["mountains"], neighbors: ["asheville"] },

  // ─────────────────────────────────────────
  // RING 4 — Edge / Satellite (projects-only / selective)
  // ─────────────────────────────────────────
  { slug: "augusta", name: "Augusta", state: "GA", ring: 4, tags: ["projects-only"], neighbors: [] },
  { slug: "wilmington", name: "Wilmington", state: "NC", ring: 4, tags: ["projects-only","coastal"], neighbors: [] },
  { slug: "charleston", name: "Charleston", state: "SC", ring: 4, tags: ["projects-only","coastal"], neighbors: [] },
  { slug: "knoxville", name: "Knoxville", state: "TN", ring: 4, tags: ["projects-only"], neighbors: [] },
  { slug: "danville", name: "Danville", state: "VA", ring: 4, tags: ["projects-only"], neighbors: [] },
];

export const locationsByRing = locationsFull.reduce<Record<string, Location[]>>((acc, loc) => {
  acc[String(loc.ring)] ||= [];
  acc[String(loc.ring)].push(loc);
  return acc;
}, {});

export const locationSlugSet = new Set(locationsFull.map(l => l.slug));
