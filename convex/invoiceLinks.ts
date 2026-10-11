// convex/invoiceLinks.ts
import { mutation, query } from "convex/server";
import { v } from "convex/values";

function randToken(len = 32) {
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export const createToken = mutation({
  args: { invoiceId: v.id("invoices"), expiresAt: v.optional(v.number()) },
  handler: async (ctx, { invoiceId, expiresAt }) => {
    const now = Date.now();
    const token = randToken(36);

    const id = await ctx.db.insert("invoiceTokens", {
      createdAt: now,
      updatedAt: now,
      invoiceId,
      token,
      expiresAt,
      status: "active",
    });

    return { token, id };
  },
});

export const revokeToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const row = await ctx.db.query("invoiceTokens").withIndex("by_token", q => q.eq("token", token)).unique();
    if (!row) return false;
    await ctx.db.patch(row._id, { status: "revoked", updatedAt: Date.now() });
    return true;
  },
});

export const resolveToken = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const row = await ctx.db.query("invoiceTokens").withIndex("by_token", q => q.eq("token", token)).unique();
    if (!row) return null;

    if (row.status !== "active") return null;
    if (row.expiresAt && Date.now() > row.expiresAt) return null;

    const inv = await ctx.db.get(row.invoiceId);
    if (!inv) return null;

    const wo = inv.workOrderId ? await ctx.db.get(inv.workOrderId) : null;
    const lead = inv.leadId ? await ctx.db.get(inv.leadId) : null;

    return { tokenRow: row, invoice: inv, workOrder: wo, lead };
  },
});