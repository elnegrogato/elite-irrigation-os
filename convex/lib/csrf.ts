// convex/lib/csrf.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// CSRF Token configuration
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

/**
 * Generate a new CSRF token for a session
 */
export const generateCSRFToken = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const token = crypto.randomUUID();

    // Store the CSRF token
    await ctx.db.insert("csrfTokens", {
      sessionId: args.sessionId,
      token,
      expiresAt: Date.now() + CSRF_TOKEN_EXPIRY,
      createdAt: Date.now(),
    });

    return { token };
  },
});

/**
 * Validate a CSRF token
 */
export const validateCSRFToken = mutation({
  args: {
    token: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const csrfRecord = await ctx.db
      .query("csrfTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!csrfRecord) {
      return { valid: false, error: "Invalid CSRF token" };
    }

    // Check if token belongs to the session
    if (csrfRecord.sessionId !== args.sessionId) {
      return { valid: false, error: "CSRF token mismatch" };
    }

    // Check if token has expired
    if (csrfRecord.expiresAt < Date.now()) {
      // Delete expired token
      await ctx.db.delete(csrfRecord._id);
      return { valid: false, error: "CSRF token expired" };
    }

    // Token is valid
    return { valid: true };
  },
});

/**
 * Invalidate a CSRF token (after use)
 */
export const invalidateCSRFToken = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const csrfRecord = await ctx.db
      .query("csrfTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (csrfRecord) {
      await ctx.db.delete(csrfRecord._id);
    }

    return { success: true };
  },
});

/**
 * Rotate CSRF token (invalidate old, generate new)
 */
export const rotateCSRFToken = mutation({
  args: {
    oldToken: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Invalidate old token
    const csrfRecord = await ctx.db
      .query("csrfTokens")
      .withIndex("by_token", (q) => q.eq("token", args.oldToken))
      .first();

    if (csrfRecord) {
      await ctx.db.delete(csrfRecord._id);
    }

    // Generate new token
    const newToken = crypto.randomUUID();
    await ctx.db.insert("csrfTokens", {
      sessionId: args.sessionId,
      token: newToken,
      expiresAt: Date.now() + CSRF_TOKEN_EXPIRY,
      createdAt: Date.now(),
    });

    return { token: newToken };
  },
});

/**
 * Cleanup expired CSRF tokens
 */
export const cleanupExpiredCSRFTokens = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const tokens = await ctx.db.query("csrfTokens").collect();

    let deleted = 0;
    for (const token of tokens) {
      if (token.expiresAt < now) {
        await ctx.db.delete(token._id);
        deleted++;
      }
    }

    return { deleted };
  },
});
