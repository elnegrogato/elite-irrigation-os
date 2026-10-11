// convex/invoices.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import { requireRoleQuery } from "./lib/authMiddleware";

export const createDraft = mutation({
  args: {
    workOrderId: v.id("workOrders"),
    subtotal: v.number(),
    tax: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, a) => {
    const wo = await ctx.db.get(a.workOrderId);
    if (!wo) throw new Error("Work order not found");

    const now = Date.now();
    const total = a.subtotal + a.tax;

    const id = await ctx.db.insert("invoices", {
      createdAt: now,
      updatedAt: now,
      leadId: wo.leadId,
      workOrderId: a.workOrderId,
      status: "draft",
      subtotal: a.subtotal,
      tax: a.tax,
      total,
      amountPaid: 0,
      balanceDue: total,
      notes: a.notes,
      stripeSessionId: undefined,
      stripePaymentIntentId: undefined,
      paidAt: undefined,
    });

    // Move work order to invoiced state
    await ctx.db.patch(a.workOrderId, { status: "invoiced", updatedAt: now });

    if (wo.leadId) {
      await ctx.db.insert("events", {
        ts: now,
        leadId: wo.leadId,
        type: "invoice_created",
        direction: "system",
        payload: { invoiceId: id, total },
      });
    }

    return id;
  },
});

export const setStatus = mutation({
  args: { invoiceId: v.id("invoices"), status: v.string() },
  handler: async (ctx, { invoiceId, status }) => {
    const inv = await ctx.db.get(invoiceId);
    if (!inv) throw new Error("Invoice not found");
    await ctx.db.patch(invoiceId, { status, updatedAt: Date.now() });
    return true;
  },
});

// Deprecated in favor of payments.recordStripePayment, but kept for legacy calls
export const markPaid = mutation({
  args: {
    invoiceId: v.id("invoices"),
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, { invoiceId, stripeSessionId, stripePaymentIntentId }) => {
    const inv = await ctx.db.get(invoiceId);
    if (!inv) throw new Error("Invoice not found");

    const now = Date.now();
    await ctx.db.patch(invoiceId, {
      status: "paid",
      updatedAt: now,
      paidAt: now,
      amountPaid: inv.total,
      balanceDue: 0,
      stripeSessionId: stripeSessionId ?? inv.stripeSessionId,
      stripePaymentIntentId: stripePaymentIntentId ?? inv.stripePaymentIntentId,
    });

    if (inv.workOrderId) {
      await ctx.db.patch(inv.workOrderId, { status: "closed", closedAt: now, updatedAt: now });
    }

    if (inv.leadId) {
      await ctx.db.insert("events", {
        ts: now,
        leadId: inv.leadId,
        type: "invoice_paid",
        direction: "system",
        payload: { invoiceId, total: inv.total },
      });
    }

    return true;
  },
});

export const listByStatus = query({
  args: { token: v.string(), status: v.string(), limit: v.optional(v.number()) },
  handler: requireRoleQuery(["admin", "manager", "foreman"], async (ctx, { status, limit }) => {
    return await ctx.db.query("invoices").withIndex("by_status", q => q.eq("status", status)).order("desc").take(limit ?? 200);
  }),
});

export const listByStatusInternal = internalQuery({
  args: { status: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { status, limit }) => {
    return await ctx.db.query("invoices").withIndex("by_status", q => q.eq("status", status)).order("desc").take(limit ?? 200);
  },
});

export const get = query({
  args: { invoiceId: v.id("invoices") },
  handler: async (ctx, { invoiceId }) => await ctx.db.get(invoiceId),
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
      .query("invoices")
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
    const invoices = await ctx.db.query("invoices").collect();
    return invoices.length;
  },
});

/**
 * Get count by status
 */
export const getCountByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, { status }) => {
    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_status", q => q.eq("status", status))
      .collect();
    return invoices.length;
  },
});
