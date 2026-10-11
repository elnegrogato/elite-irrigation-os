// convex/caseStudies.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    serviceSlug: v.string(),
    locationSlug: v.string(),
    neighborSlugs: v.optional(v.array(v.string())),

    title: v.string(),
    summary: v.string(),
    scopeBullets: v.array(v.string()),
    outcomeBullets: v.array(v.string()),

    media: v.array(v.object({
      url: v.string(),
      kind: v.string(),
      caption: v.optional(v.string()),
    })),

    jobDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),

    publish: v.boolean(),
  },
  handler: async (ctx, a) => {
    const now = Date.now();
    return await ctx.db.insert("caseStudies", {
      createdAt: now,
      updatedAt: now,
      ...a,
      verifiedBy: a.publish ? "admin" : undefined,
      verifiedAt: a.publish ? now : undefined,
    });
  },
});

export const setPublish = mutation({
  args: { id: v.id("caseStudies"), publish: v.boolean(), by: v.optional(v.string()) },
  handler: async (ctx, { id, publish, by }) => {
    const now = Date.now();
    await ctx.db.patch(id, {
      publish,
      updatedAt: now,
      verifiedBy: publish ? (by ?? "admin") : undefined,
      verifiedAt: publish ? now : undefined,
    });
    return true;
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db.query("caseStudies").withIndex("by_publish", q => q.eq("publish", true)).order("desc").take(limit ?? 50);
  },
});

export const listForSpoke = query({
  args: { serviceSlug: v.string(), locationSlug: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { serviceSlug, locationSlug, limit }) => {
    const direct = await ctx.db
      .query("caseStudies")
      .withIndex("by_service_location", q => q.eq("serviceSlug", serviceSlug).eq("locationSlug", locationSlug))
      .order("desc")
      .take(limit ?? 5);

    return direct.filter(x => x.publish);
  },
});

// neighbor amplification: if no direct hits, show nearby
export const listForSpokeOrNeighbors = query({
  args: { serviceSlug: v.string(), locationSlug: v.string(), neighbors: v.array(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, { serviceSlug, locationSlug, neighbors, limit }) => {
    const direct = await ctx.db
      .query("caseStudies")
      .withIndex("by_service_location", q => q.eq("serviceSlug", serviceSlug).eq("locationSlug", locationSlug))
      .order("desc")
      .take(limit ?? 5);

    const directPub = direct.filter(x => x.publish);
    if (directPub.length) return directPub.slice(0, limit ?? 3);

    // fallback: search neighbors by service
    const allService = await ctx.db
      .query("caseStudies")
      .withIndex("by_service", q => q.eq("serviceSlug", serviceSlug))
      .order("desc")
      .take(50);

    const neighborHits = allService.filter(x => x.publish && neighbors.includes(x.locationSlug));
    return neighborHits.slice(0, limit ?? 3);
  },
});

// export to copy into a static file if you want pre-rendered proof (manual step)
export const exportAllPublished = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("caseStudies").withIndex("by_publish", q => q.eq("publish", true)).order("desc").take(5000);
    return rows;
  },
});

export const getById = query({
  args: { id: v.id("caseStudies") },
  handler: async (ctx, { id }) => {
    const row = await ctx.db.get(id);
    if (!row || !row.publish) return null;
    return row;
  },
});

export const listByService = query({
  args: { serviceSlug: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { serviceSlug, limit }) => {
    const rows = await ctx.db.query("caseStudies")
      .withIndex("by_service", q => q.eq("serviceSlug", serviceSlug))
      .order("desc")
      .take(limit ?? 50);
    return rows.filter(r => r.publish);
  },
});