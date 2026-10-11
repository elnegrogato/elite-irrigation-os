// convex/leads.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import {
  defaultSla,
  inferEntityType,
  inferIntent,
  inferUrgencyFromText,
  normalizePhone,
  normalizeSurface,
} from "./lib/normalize";
import { requireRoleQuery } from "./lib/authMiddleware";

const STAGES = [
  "awareness","interest","consideration","intent","lead","contacted","inspected","estimated",
  "booked","inProgress","completed","reviewed","member_referrer",
] as const;

export const createLead = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    surfaceHint: v.optional(v.string()),
    referrer: v.optional(v.string()),
    utm: v.optional(v.any()),
    entityType: v.optional(v.string()),
    intent: v.optional(v.string()),
    urgency: v.optional(v.string()),
    serviceSlug: v.optional(v.string()),
    locationSlug: v.optional(v.string()),
    addressText: v.optional(v.string()),
    message: v.optional(v.string()),
    photos: v.optional(v.array(v.object({ url: v.string(), caption: v.optional(v.string()) }))),
  },
  handler: async (ctx, a) => {
    const now = Date.now();
    const phone = normalizePhone(a.phone);
    const surface = normalizeSurface(a.surfaceHint, a.referrer);
    const urgency = a.urgency ?? inferUrgencyFromText(a.message);
    const intent = (a.intent as any) ?? inferIntent(a.serviceSlug, a.message);
    const entityType = (a.entityType as any) ?? inferEntityType(a.message);

    const sla = defaultSla(urgency, now);

    const leadId = await ctx.db.insert("leads", {
      createdAt: now,
      updatedAt: now,
      name: a.name,
      phone,
      email: a.email,
      surface,
      sourceHint: a.surfaceHint,
      referrer: a.referrer,
      utm: a.utm,
      entityType,
      intent,
      urgency,
      serviceSlug: a.serviceSlug,
      locationSlug: a.locationSlug,
      addressText: a.addressText,
      message: a.message,
      photos: a.photos,
      stage: "lead",
      respondBy: sla.respondBy,
      estimateBy: sla.estimateBy,
      lastInboundAt: now,
    });

    await ctx.db.insert("events", {
      ts: now,
      leadId,
      type: "stage_change",
      direction: "system",
      payload: { from: "intent", to: "lead" },
    });

    if (a.message) {
      await ctx.db.insert("events", {
        ts: now,
        leadId,
        type: "form_submit",
        direction: "in",
        payload: { message: a.message, raw: { ...a } },
      });
    }

    return leadId;
  },
});

export const setStage = mutation({
  args: { leadId: v.id("leads"), to: v.string(), by: v.optional(v.string()) },
  handler: async (ctx, { leadId, to, by }) => {
    if (!STAGES.includes(to as any)) throw new Error(`Invalid stage: ${to}`);
    const lead = await ctx.db.get(leadId);
    if (!lead) throw new Error("Lead not found");

    const now = Date.now();
    await ctx.db.patch(leadId, { stage: to, updatedAt: now });

    await ctx.db.insert("events", {
      ts: now,
      leadId,
      type: "stage_change",
      direction: by ?? "human",
      payload: { from: lead.stage, to },
    });

    return true;
  },
});

export const assignLead = mutation({
  args: { leadId: v.id("leads"), assignedTo: v.optional(v.string()) },
  handler: async (ctx, { leadId, assignedTo }) => {
    const now = Date.now();
    await ctx.db.patch(leadId, { assignedTo, updatedAt: now });
    await ctx.db.insert("events", {
      ts: now,
      leadId,
      type: "note",
      direction: "system",
      payload: { message: assignedTo ? `Assigned to ${assignedTo}` : "Unassigned" },
    });
    return true;
  },
});

export const addNote = mutation({
  args: { leadId: v.id("leads"), note: v.string() },
  handler: async (ctx, { leadId, note }) => {
    const now = Date.now();
    await ctx.db.insert("events", { ts: now, leadId, type: "note", direction: "in", payload: { note } });
    await ctx.db.patch(leadId, { updatedAt: now });
    return true;
  },
});

export const get = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => await ctx.db.get(leadId),
});

export const listByStage = query({
  args: { stage: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { stage, limit }) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_stage", q => q.eq("stage", stage))
      .order("desc")
      .take(limit ?? 200);
  },
});

export const listRecent = query({
  args: { token: v.string(), limit: v.optional(v.number()) },
  handler: requireRoleQuery(["admin", "manager", "foreman"], async (ctx, { limit }) => {
    return await ctx.db.query("leads").withIndex("by_createdAt").order("desc").take(limit ?? 200);
  }),
});

export const listRecentInternal = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db.query("leads").withIndex("by_createdAt").order("desc").take(limit ?? 200);
  },
});

export const listBySurface = query({
  args: { surface: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { surface, limit }) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_surface", q => q.eq("surface", surface))
      .order("desc")
      .take(limit ?? 200);
  },
});

/**
 * Paginated list with cursor support for better performance
 */
export const listPaginated = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, { paginationOpts }) => {
    const results = await ctx.db
      .query("leads")
      .withIndex("by_createdAt")
      .order("desc")
      .paginate(paginationOpts);

    return {
      page: results.page,
      continueCursor: results.continueCursor,
      isDone: results.isDone,
    };
  },
});

/**
 * Get count without loading full data
 */
export const getCount = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").collect();
    return leads.length;
  },
});

/**
 * Get count by stage
 */
export const getCountByStage = query({
  args: { stage: v.string() },
  handler: async (ctx, { stage }) => {
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_stage", q => q.eq("stage", stage))
      .collect();
    return leads.length;
  },
});
