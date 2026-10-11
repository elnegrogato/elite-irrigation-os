// convex/sessions.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Session duration: 24 hours in milliseconds
const SESSION_DURATION = 24 * 60 * 60 * 1000;
const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_CONCURRENT_SESSIONS = 3;

async function logSecurityEvent(
  ctx: { db: any },
  args: { action: string; userId?: any; details?: Record<string, any>; severity?: string }
) {
  await ctx.db.insert("auditLogs", {
    action: args.action,
    userId: args.userId,
    details: args.details ?? {},
    severity: args.severity ?? "info",
    timestamp: Date.now(),
  });
}

// Create a new session with IP and user agent tracking
export const createSession = mutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    rememberMe: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + (args.rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION);

    // Check concurrent session limit
    const existingSessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const activeSessions = existingSessions.filter((s) => s.expiresAt > now);

    if (activeSessions.length >= MAX_CONCURRENT_SESSIONS) {
      // Invalidate the oldest session
      activeSessions.sort((a, b) => a.createdAt - b.createdAt);
      await ctx.db.delete(activeSessions[0]._id);
    }

    const sessionId = await ctx.db.insert("sessions", {
      userId: args.userId,
      token: args.token,
      expiresAt,
      createdAt: now,
      lastActiveAt: now,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
    });

    // Log session creation
    await logSecurityEvent(ctx, {
      action: "session_created",
      userId: args.userId,
      details: {
        ip: args.ipAddress,
        userAgent: args.userAgent,
        rememberMe: args.rememberMe,
      },
      severity: "info",
    });

    return { sessionId, expiresAt };
  },
});

// Validate session and return user with security checks
export const validateSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return null;
    }

    // Check if session is expired
    const now = Date.now();
    if (now > session.expiresAt) {
      return null;
    }

    // Get user
    const user = await ctx.db.get(session.userId);
    if (!user) {
      return null;
    }

    // Check if user is active
    if (user.status !== "active") {
      return null;
    }

    // Check if user is locked
    if (user.lockedUntil && user.lockedUntil > now) {
      return null;
    }

    // Don't expose password hash or salt
    const { passwordHash, passwordSalt, ...userWithoutPassword } = user;

    return {
      session: {
        id: session._id,
        expiresAt: session.expiresAt,
        lastActiveAt: session.lastActiveAt,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
      },
      user: userWithoutPassword,
    };
  },
});

// Invalidate (logout) a session
export const invalidateSession = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return { success: false, message: "Session not found" };
    }

    await ctx.db.delete(session._id);
    return { success: true };
  },
});

// Invalidate all sessions for a user
export const invalidateAllUserSessions = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    return { success: true, deleted: sessions.length };
  },
});

// Get all active sessions for a user
export const getUserSessions = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter out expired sessions
    const activeSessions = sessions.filter((s) => s.expiresAt > now);

    // Don't expose tokens
    return activeSessions.map((s) => ({
      id: s._id,
      createdAt: s.createdAt,
      lastActiveAt: s.lastActiveAt,
      expiresAt: s.expiresAt,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
    }));
  },
});

// Update session last active time
export const updateLastActive = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return { success: false };
    }

    await ctx.db.patch(session._id, {
      lastActiveAt: Date.now(),
    });

    return { success: true };
  },
});

// Cleanup expired sessions (can be called periodically or manually)
export const cleanupExpiredSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_expiresAt")
      .collect();

    let deleted = 0;
    for (const session of sessions) {
      if (now > session.expiresAt) {
        await ctx.db.delete(session._id);
        deleted++;
      }
    }

    return { deleted };
  },
});

// Invalidate a specific session (for session management)
export const invalidateSpecificSession = mutation({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);

    if (!session) {
      return { success: false, message: "Session not found" };
    }

    await ctx.db.delete(args.sessionId);

    // Log session invalidation
    await logSecurityEvent(ctx, {
      action: "session_invalidated",
      userId: session.userId,
      details: { sessionId: args.sessionId },
      severity: "info",
    });

    return { success: true };
  },
});

// Detect session hijacking attempts
export const detectSuspiciousSession = query({
  args: {
    token: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return { suspicious: false, reason: "Session not found" };
    }

    // Check if IP address changed
    if (session.ipAddress && args.ipAddress && session.ipAddress !== args.ipAddress) {
      return {
        suspicious: true,
        reason: "IP address changed",
        previousIP: session.ipAddress,
        currentIP: args.ipAddress,
      };
    }

    // Check if user agent changed significantly
    if (session.userAgent && args.userAgent && session.userAgent !== args.userAgent) {
      return {
        suspicious: true,
        reason: "User agent changed",
        previousUserAgent: session.userAgent,
        currentUserAgent: args.userAgent,
      };
    }

    return { suspicious: false };
  },
});
