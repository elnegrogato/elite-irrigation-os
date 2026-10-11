// src/lib/weekPlanner.ts
import { locationsFull } from "../../data/locations_full";

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export type WeekCluster = {
  seed: string;         // locationSlug
  members: string[];    // locationSlugs (seed + neighbors)
  score: number;
  ringAvg: number;
};

const DAYS: Weekday[] = ["Mon","Tue","Wed","Thu","Fri"];

export function buildClusters(density: Record<string, { leads: number; appts: number }>) {
  // simple neighborhood clusters: seed + up to 6 neighbors
  const clusters: WeekCluster[] = [];

  for (const [slug, d] of Object.entries(density)) {
    const loc = locationsFull.find(l => l.slug === slug);
    if (!loc) continue;
    const members = [slug, ...(loc.neighbors ?? []).slice(0, 6)];

    const score = members.reduce((sum, m) => {
      const x = density[m];
      return sum + (x ? x.leads + 2 * x.appts : 0);
    }, 0);

    const ringAvg = members.reduce((sum, m) => {
      const l = locationsFull.find(x => x.slug === m);
      return sum + (l?.ring ?? 3);
    }, 0) / members.length;

    clusters.push({ seed: slug, members: Array.from(new Set(members)), score, ringAvg });
  }

  // remove near-duplicates: keep best score per same member set hash
  clusters.sort((a, b) => b.score - a.score);
  const used = new Set<string>();
  const pruned: WeekCluster[] = [];
  for (const c of clusters) {
    const key = c.members.slice().sort().join("|");
    if (used.has(key)) continue;
    used.add(key);
    pruned.push(c);
  }

  return pruned.slice(0, 50);
}

export function assignWeek(clusters: WeekCluster[]) {
  // Greedy balance by score
  const plan: Record<Weekday, WeekCluster[]> = { Mon:[], Tue:[], Wed:[], Thu:[], Fri:[] };
  const totals: Record<Weekday, number> = { Mon:0, Tue:0, Wed:0, Thu:0, Fri:0 };

  for (const c of clusters.sort((a, b) => b.score - a.score)) {
    const day = DAYS.slice().sort((a, b) => totals[a] - totals[b])[0];
    plan[day].push(c);
    totals[day] += c.score;
  }

  return { plan, totals };
}