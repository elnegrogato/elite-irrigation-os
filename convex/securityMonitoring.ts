// convex/securityMonitoring.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Detect brute force attack patterns
 */
export const detectBruteForceAttack = query({
  args: {
    identifier: v.string(),
    action: v.string(),
    threshold: v.optional(v.number()),
    timeWindow: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const threshold = args.threshold || 10;
    const timeWindow = args.timeWindow || 5 * 60 * 1000; // 5 minutes
    const now = Date.now();
    const windowStart = now - timeWindow;

    // Get rate limit records
    const records = await ctx.db
      .query("rateLimits")
      .withIndex("by_identifier_action", (q) =>
        q.eq("identifier", args.identifier).eq("action", args.action)
      )
      .collect();

    // Count attempts in the window
    const recentAttempts = records.filter((r) => r.timestamp > windowStart);

    if (recentAttempts.length >= threshold) {
      return {
        detected: true,
        attemptCount: recentAttempts.length,
        timeWindow,
        threshold,
        severity: recentAttempts.length >= threshold * 2 ? "critical" : "warning",
      };
    }

    return { detected: false };
  },
});

/**
 * Detect unusual activity patterns
 */
export const detectUnusualActivity = query({
  args: {
    userId: v.optional(v.id("users")),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const anomalies: string[] = [];

    // Check for multiple failed logins
    if (args.userId) {
      const logs = await ctx.db
        .query("auditLogs")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();

      const failedLogins = logs.filter(
        (l) => l.action === "login_failed" && l.timestamp > Date.now() - 60 * 60 * 1000
      );

      if (failedLogins.length >= 5) {
        anomalies.push("Multiple failed login attempts detected");
      }
    }

    // Check for login from multiple IPs
    if (args.userId) {
      const sessions = await ctx.db
        .query("sessions")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();

      const uniqueIPs = new Set(
        sessions.filter((s) => s.expiresAt > Date.now()).map((s) => s.ipAddress)
      );

      if (uniqueIPs.size >= 3) {
        anomalies.push("Concurrent logins from multiple IP addresses");
      }
    }

    // Check for rapid successive actions
    if (args.ipAddress) {
      const logs = await ctx.db.query("auditLogs").collect();
      const recentLogs = logs.filter(
        (l) =>
          l.ipAddress === args.ipAddress &&
          l.timestamp > Date.now() - 60 * 1000 // Last minute
      );

      if (recentLogs.length >= 30) {
        anomalies.push("Unusually high activity rate detected");
      }
    }

    return {
      hasAnomalies: anomalies.length > 0,
      anomalies,
    };
  },
});

/**
 * Get security insights
 */
export const getSecurityInsights = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // Get recent audit logs
    const logs = await ctx.db.query("auditLogs").collect();
    const recentLogs = logs.filter((l) => l.timestamp > now - 7 * dayMs);

    // Calculate metrics
    const failedLogins = recentLogs.filter((l) => l.action === "login_failed").length;
    const successfulLogins = recentLogs.filter((l) => l.action === "login_success").length;
    const suspiciousActivity = recentLogs.filter(
      (l) => l.severity === "warning" || l.severity === "critical"
    ).length;

    // Get active sessions
    const sessions = await ctx.db.query("sessions").collect();
    const activeSessions = sessions.filter((s) => s.expiresAt > now);

    // Get blocked IPs
    const blockedIPs = await ctx.db.query("blockedIPs").collect();
    const activeBlockedIPs = blockedIPs.filter((b) => !b.expiresAt || b.expiresAt > now);

    return {
      period: "7 days",
      failedLogins,
      successfulLogins,
      suspiciousActivity,
      activeSessions: activeSessions.length,
      blockedIPs: activeBlockedIPs.length,
      securityScore: calculateSecurityScore({
        failedLogins,
        successfulLogins,
        suspiciousActivity,
      }),
    };
  },
});

/**
 * Auto-block suspicious IPs
 */
export const autoBlockSuspiciousIPs = mutation({
  args: {
    threshold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const threshold = args.threshold || 10;
    const now = Date.now();
    const windowStart = now - 5 * 60 * 1000; // 5 minutes

    // Get all recent failed login attempts
    const logs = await ctx.db.query("auditLogs").collect();
    const failedLogins = logs.filter(
      (l) =>
        l.action === "login_failed" &&
        l.timestamp > windowStart &&
        l.ipAddress
    );

    // Group by IP
    const ipAttempts: Record<string, number> = {};
    for (const log of failedLogins) {
      const ip = log.ipAddress!;
      ipAttempts[ip] = (ipAttempts[ip] || 0) + 1;
    }

    // Block IPs exceeding threshold
    let blocked = 0;
    for (const [ip, attempts] of Object.entries(ipAttempts)) {
      if (attempts >= threshold) {
        const { blockIP } = await import("./lib/rateLimiter");
        await blockIP(ctx, ip, "Automatic block: brute force attack detected", 60 * 60 * 1000); // 1 hour
        blocked++;
      }
    }

    return { blocked };
  },
});

// Helper function to calculate security score
function calculateSecurityScore(metrics: {
  failedLogins: number;
  successfulLogins: number;
  suspiciousActivity: number;
}): number {
  let score = 100;

  // Deduct points for failed logins
  score -= Math.min(metrics.failedLogins * 2, 30);

  // Deduct points for suspicious activity
  score -= Math.min(metrics.suspiciousActivity * 5, 40);

  // Bonus for successful logins
  score += Math.min(metrics.successfulLogins * 0.1, 10);

  return Math.max(0, Math.min(100, score));
}

/**
 * Get security recommendations
 */
export const getSecurityRecommendations = query({
  args: {},
  handler: async (ctx) => {
    const recommendations: string[] = [];
    const now = Date.now();

    // Check for users with weak passwords
    // This would require additional user data analysis

    // Check for old sessions
    const sessions = await ctx.db.query("sessions").collect();
    const oldSessions = sessions.filter((s) => {
      const age = now - s.createdAt;
      return age > 7 * 24 * 60 * 60 * 1000; // 7 days
    });

    if (oldSessions.length > 0) {
      recommendations.push("Consider implementing shorter session expiry times");
    }

    // Check for high failed login rate
    const logs = await ctx.db.query("auditLogs").collect();
    const recentFailedLogins = logs.filter(
      (l) => l.action === "login_failed" && l.timestamp > now - 24 * 60 * 60 * 1000
    );

    if (recentFailedLogins.length > 50) {
      recommendations.push("High number of failed login attempts detected - consider implementing stricter rate limiting");
    }

    // Check for blocked IPs
    const blockedIPs = await ctx.db.query("blockedIPs").collect();
    if (blockedIPs.length > 10) {
      recommendations.push("Multiple IPs are blocked - review security logs");
    }

    return recommendations;
  },
});
