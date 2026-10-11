// convex/automations.ts
import { action, mutation, query } from "convex/server";
import { v } from "convex/values";
import { twilioSendSms } from "./lib/twilioSend";
import { api } from "./_generated/api";

export const processOutboundQueue = action({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const rows = await ctx.runQuery(api.automations.listDueOutbound, { limit: limit ?? 20 });

    for (const msg of rows as any[]) {
      try {
        if (msg.channel === "sms") {
          await twilioSendSms(msg.to, msg.body);
        }

        await ctx.runMutation(api.automations.markOutboundSent, { id: msg._id });
        if (msg.leadId) {
          await ctx.runMutation(api.events.logEvent, {
            leadId: msg.leadId,
            type: "sms",
            direction: "out",
            payload: { to: msg.to, body: msg.body, via: "queue" },
          });
        }
      } catch (e: any) {
        await ctx.runMutation(api.automations.markOutboundFailed, { id: msg._id, error: String(e?.message ?? e) });
      }
    }

    return { processed: rows.length };
  },
});

export const listDueOutbound = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const now = Date.now();
    const pending = await ctx.db.query("outboundMessages").withIndex("by_status", q => q.eq("status", "pending")).order("asc").take(limit ?? 20);
    return pending.filter(m => !m.scheduledFor || m.scheduledFor <= now);
  },
});

export const markOutboundSent = mutation({
  args: { id: v.id("outboundMessages") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { status: "sent", updatedAt: Date.now() });
  },
});

export const markOutboundFailed = mutation({
  args: { id: v.id("outboundMessages"), error: v.string() },
  handler: async (ctx, { id, error }) => {
    const m = await ctx.db.get(id);
    if (!m) return;
    await ctx.db.patch(id, {
      status: "failed",
      updatedAt: Date.now(),
      attempts: (m.attempts ?? 0) + 1,
      lastError: error,
    });
  },
});