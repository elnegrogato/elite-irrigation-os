// convex/inbox.ts
import { query } from "convex/server";
import { v } from "convex/values";

export const listConversations = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    // Return leads sorted by most recent inbound activity
    // In a real production app, you might want a specific "conversations" table
    // or a composite index on lastInboundAt/lastOutboundAt.
    // Here we use lastInboundAt as a proxy for "active conversations".
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_createdAt") // Fallback if no specific activity index, but we sort in memory for now or assume recent
      .order("desc")
      .take(limit ?? 50);

    // Sort by most recent activity (inbound or outbound)
    const sorted = leads.sort((a, b) => {
      const aTime = Math.max(a.lastInboundAt ?? 0, a.lastOutboundAt ?? 0, a.createdAt);
      const bTime = Math.max(b.lastInboundAt ?? 0, b.lastOutboundAt ?? 0, b.createdAt);
      return bTime - aTime;
    });

    return sorted.map(l => ({
      _id: l._id,
      name: l.name ?? "Unknown",
      phone: l.phone,
      stage: l.stage,
      serviceSlug: l.serviceSlug,
      lastActivityAt: Math.max(l.lastInboundAt ?? 0, l.lastOutboundAt ?? 0, l.createdAt),
      unread: false, // You could add an 'unread' flag to schema later
    }));
  },
});

export const getThread = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.db.get(leadId);
    if (!lead) return null;

    // 1. Get Inbound Events (SMS, Notes, Calls)
    const events = await ctx.db
      .query("events")
      .withIndex("by_lead", q => q.eq("leadId", leadId))
      .order("desc")
      .take(100);

    // 2. Get Outbound Messages
    // We don't have a direct index on outboundMessages by leadId (only by status/scheduled),
    // but we can add one or filter. For now, assuming relatively low volume per lead,
    // we can use a custom index or just fetch recent.
    // *Correction*: schema has .index("by_lead", ["leadId", "createdAt"]) for outboundMessages
    const outbound = await ctx.db
      .query("outboundMessages")
      .withIndex("by_lead", q => q.eq("leadId", leadId))
      .order("desc")
      .take(100);

    // Combine and standardize
    const timeline = [
      ...events.map(e => ({
        _id: e._id,
        type: e.type === 'form_submit' ? 'inbound_text' : e.type,
        kind: 'event',
        body: e.payload?.message || e.payload?.body || e.payload?.note || JSON.stringify(e.payload),
        ts: e.ts,
        direction: e.direction ?? 'in',
        user: e.payload?.user ?? 'System',
      })),
      ...outbound.map(m => ({
        _id: m._id,
        type: 'sms',
        kind: 'outbound',
        body: m.body,
        ts: m.createdAt,
        direction: 'out',
        status: m.status,
        user: 'Elite',
      }))
    ];

    // Sort ascending for chat view
    return {
      lead,
      thread: timeline.sort((a, b) => a.ts - b.ts)
    };
  },
});