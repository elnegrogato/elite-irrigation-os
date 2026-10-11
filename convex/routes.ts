// convex/routes.ts
import { query } from "convex/server";
import { v } from "convex/values";

// Returns density per locationSlug based on recent leads + upcoming appointments
export const density = query({
  args: { daysBack: v.optional(v.number()) },
  handler: async (ctx, { daysBack }) => {
    const since = Date.now() - (daysBack ?? 14) * 24 * 60 * 60 * 1000;

    const leads = await ctx.db.query("leads").withIndex("by_createdAt").order("desc").take(1000);
    const recentLeads = leads.filter(l => l.createdAt >= since && l.locationSlug);

    const appts = await ctx.db.query("appointments").withIndex("by_time").order("desc").take(1000);
    const upcoming = appts.filter(a => a.scheduledFor >= Date.now() && a.locationSlug);

    const score: Record<string, { leads: number; appts: number }> = {};

    for (const l of recentLeads) {
      const k = l.locationSlug!;
      score[k] ||= { leads: 0, appts: 0 };
      score[k].leads += 1;
    }
    for (const a of upcoming) {
      const k = a.locationSlug!;
      score[k] ||= { leads: 0, appts: 0 };
      score[k].appts += 1;
    }

    return score;
  },
});