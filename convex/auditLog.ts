// convex/auditLog.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Security event severity levels
export type SecuritySeverity = "info" | "warning" | "error" | "critical";

/**
 * Log a security event
 */
export const logSecurityEvent = mutation({
  args: {
    action: v.string(),
    userId: v.optional(v.id("users")),
    details: v.optional(v.any()),
    severity: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    resourceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("auditLogs", {
      action: args.action,
      userId: args.userId,
      details: args.details || {},
      severity: (args.severity as SecuritySeverity) || "info",
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      resourceId: args.resourceId,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Get all audit logs (admin only)
 */
export const getAuditLogs = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    userId: v.optional(v.id("users")),
    action: v.optional(v.string()),
    severity: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("auditLogs");

    // Filter by user
    if (args.userId) {
      query = query.withIndex("by_user", (q) => q.eq("userId", args.userId!));
    }

    // Get all logs (filtering happens in-memory for now)
    let logs = await query.collect();

    // Filter by action
    if (args.action) {
      logs = logs.filter((log) => log.action === args.action);
    }

    // Filter by severity
    if (args.severity) {
      logs = logs.filter((log) => log.severity === args.severity);
    }

    // Filter by date range
    if (args.startDate) {
      logs = logs.filter((log) => log.timestamp >= args.startDate!);
    }
    if (args.endDate) {
      logs = logs.filter((log) => log.timestamp <= args.endDate!);
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    const offset = args.offset || 0;
    const limit = args.limit || 100;
    const paginatedLogs = logs.slice(offset, offset + limit);

    return {
      logs: paginatedLogs,
      total: logs.length,
      hasMore: offset + limit < logs.length,
    };
  },
});

/**
 * Get audit logs for a specific user
 */
export const getUserAuditLogs = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Sort by timestamp (newest first)
    logs.sort((a, b) => b.timestamp - a.timestamp);

    // Apply limit
    const limit = args.limit || 50;
    return logs.slice(0, limit);
  },
});

/**
 * Get recent security events
 */
export const getRecentSecurityEvents = query({
  args: {
    limit: v.optional(v.number()),
    severity: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("auditLogs").collect();

    // Filter by severity if specified
    let filtered = logs;
    if (args.severity) {
      filtered = logs.filter((log) => log.severity === args.severity);
    }

    // Sort by timestamp (newest first) and limit
    filtered.sort((a, b) => b.timestamp - a.timestamp);
    const limit = args.limit || 20;

    return filtered.slice(0, limit);
  },
});

/**
 * Get security statistics
 */
export const getSecurityStats = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("auditLogs").collect();

    // Filter by date range
    let filtered = logs;
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const startDate = args.startDate || now - 7 * dayMs; // Default to last 7 days
    const endDate = args.endDate || now;

    filtered = logs.filter((log) => log.timestamp >= startDate && log.timestamp <= endDate);

    // Calculate statistics
    const stats = {
      total: filtered.length,
      bySeverity: {
        info: 0,
        warning: 0,
        error: 0,
        critical: 0,
      },
      byAction: {} as Record<string, number>,
      failedLogins: 0,
      successfulLogins: 0,
      passwordChanges: 0,
      accountLockouts: 0,
      suspiciousActivity: 0,
    };

    for (const log of filtered) {
      // Count by severity
      if (stats.bySeverity[log.severity as keyof typeof stats.bySeverity] !== undefined) {
        stats.bySeverity[log.severity as keyof typeof stats.bySeverity]++;
      }

      // Count by action
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;

      // Count specific events
      if (log.action === "login_failed") stats.failedLogins++;
      if (log.action === "login_success") stats.successfulLogins++;
      if (log.action === "password_changed") stats.passwordChanges++;
      if (log.action === "account_locked") stats.accountLockouts++;
      if (log.severity === "warning" || log.severity === "critical") {
        stats.suspiciousActivity++;
      }
    }

    return stats;
  },
});

/**
 * Export audit logs as JSON
 */
export const exportAuditLogs = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    format: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db.query("auditLogs").collect();

    // Filter by date range
    let filtered = logs;
    if (args.startDate || args.endDate) {
      const startDate = args.startDate || 0;
      const endDate = args.endDate || Date.now();
      filtered = logs.filter((log) => log.timestamp >= startDate && log.timestamp <= endDate);
    }

    return {
      logs: filtered,
      exportedAt: Date.now(),
      count: filtered.length,
    };
  },
});

/**
 * Cleanup old audit logs
 * Should be called periodically to keep the database size manageable
 */
export const cleanupOldAuditLogs = mutation({
  args: {
    olderThanDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.olderThanDays || 90; // Default to 90 days
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;

    const logs = await ctx.db.query("auditLogs").collect();

    let deleted = 0;
    for (const log of logs) {
      if (log.timestamp < cutoffTime) {
        // Don't delete critical security events
        if (log.severity !== "critical") {
          await ctx.db.delete(log._id);
          deleted++;
        }
      }
    }

    return { deleted };
  },
});
