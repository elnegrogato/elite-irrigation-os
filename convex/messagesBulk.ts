// convex/messagesBulk.ts
import { mutation } from "convex/server";
import { v } from "convex/values";

export const bulkQueueSms = mutation({
  args: {
    leadIds: v.array(v.id("leads")),
    bodyTemplate: v.string(), // supports tokens like {name} {service} {location}
    scheduledFor: v.optional(v.number()),
    meta: v.optional(v.any()),
  },
  handler: async (ctx, { leadIds, bodyTemplate, scheduledFor, meta }) => {
    const now = Date.now();
    let queued = 0;

    for (const id of leadIds) {
      const lead = await ctx.db.get(id);
      if (!lead?.phone) continue;

      const body = bodyTemplate
        .replaceAll("{name}", lead.name ?? "there")
        .replaceAll("{service}", lead.serviceSlug ?? "your service")
        .replaceAll("{location}", lead.locationSlug ?? "your area");

      await ctx.db.insert("outboundMessages", {
        createdAt: now,
        updatedAt: now,
        leadId: id,
        channel: "sms",
        to: lead.phone,
        body,
        status: "pending",
        attempts: 0,
        scheduledFor,
        meta,
      });

      queued++;
    }

    return { ok: true, queued };
  },
});