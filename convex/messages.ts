// convex/messages.ts
import { action, mutation, query } from "convex/server";
import { v } from "convex/values";
import { twilioSendSms } from "./lib/twilioSend";
import { api } from "./_generated/api";
import { ensureNoBlockingApprovals } from "./lib/secEnforce";

export const queueSms = mutation({
  args: {
    leadId: v.optional(v.id("leads")),
    to: v.string(),
    body: v.string(),
    scheduledFor: v.optional(v.number()),
    meta: v.optional(v.any()),
  },
  handler: async (ctx, a) => {
    const now = Date.now();
    const id = await ctx.db.insert("outboundMessages", {
      createdAt: now,
      updatedAt: now,
      leadId: a.leadId,
      channel: "sms",
      to: a.to,
      body: a.body,
      status: "pending",
      attempts: 0,
      scheduledFor: a.scheduledFor,
      meta: a.meta,
    });
    return id;
  },
});

export const listPending = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db.query("outboundMessages").withIndex("by_status", q => q.eq("status", "pending")).order("asc").take(limit ?? 50);
  },
});

// Direct send (for admin quick action)
export const sendSmsNow = action({
  args: { to: v.string(), body: v.string(), leadId: v.optional(v.id("leads")) },
  handler: async (ctx, { to, body, leadId }) => {
    if (leadId) {
      // if this SMS is about estimates/contracts, gate it:
      const actionHint = body.toLowerCase().includes("estimate") || body.toLowerCase().includes("contract")
        ? "send_sms_estimate"
        : "send_sms_contract";
      await ensureNoBlockingApprovals(ctx, leadId, actionHint);
    }

    const result = await twilioSendSms(to, body);

    // Log as event if leadId is present
    if (leadId) {
      await ctx.runMutation(api.events.logEvent, {
        leadId,
        type: "sms",
        direction: "out",
        payload: { to, body, provider: "twilio", result },
      });
    }

    return { ok: true, result };
  },
});

// Update outbound message status
export const updateStatus = mutation({
  args: {
    messageId: v.id("outboundMessages"),
    status: v.string(),
    lastError: v.optional(v.string()),
    messageIdProvider: v.optional(v.string()),
    deliveredAt: v.optional(v.number()),
  },
  handler: async (ctx, { messageId, status, lastError, messageIdProvider, deliveredAt }) => {
    const now = Date.now();
    const updates: any = {
      status,
      updatedAt: now,
      lastError,
      attempts: await ctx.db.get(messageId).then(msg => (msg?.attempts ?? 0) + 1),
    };

    if (messageIdProvider) {
      updates.messageId = messageIdProvider;
    }

    if (deliveredAt) {
      updates.deliveredAt = deliveredAt;
    }

    await ctx.db.patch(messageId, updates);
  },
});

// Get single outbound message
export const get = query({
  args: { id: v.id("outboundMessages") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});