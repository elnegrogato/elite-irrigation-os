// convex/lib/rateLimiter.ts
import { MutationBuilder, QueryBuilder } from "./_generated/server";

// Rate limit configuration
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Default rate limit configurations
export const DEFAULT_RATE_LIMITS = {
  // Authentication
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  register: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  passwordReset: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour

  // API endpoints
  api: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  mutations: { maxRequests: 50, windowMs: 60 * 1000 }, // 50 mutations per minute

  // File uploads
  fileUpload: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 uploads per hour

  // Messages
  sendMessage: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 messages per minute

  // Search
  search: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 searches per minute
} as const;

/**
 * Check if a user has exceeded their rate limit
 * Uses a sliding window algorithm
 */
export async function checkRateLimit(
  ctx: { db: any },
  identifier: string,
  action: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMITS.api
): Promise<{ allowed: boolean; remaining: number; resetAt?: number }> {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Get existing rate limit records for this identifier and action
  const records = await ctx.db
    .query("rateLimits")
    .withIndex("by_identifier_action", (q: any) =>
      q.eq("identifier", identifier).eq("action", action)
    )
    .collect();

  // Filter records within the current window
  const validRecords = records.filter((record: any) => record.timestamp > windowStart);

  // Count requests in the current window
  const requestCount = validRecords.length;

  // Calculate remaining requests
  const remaining = Math.max(0, config.maxRequests - requestCount);
  const allowed = requestCount < config.maxRequests;

  // Calculate when the oldest request will expire
  let resetAt: number | undefined;
  if (validRecords.length > 0) {
    const oldestRecord = validRecords.sort((a: any, b: any) => a.timestamp - b.timestamp)[0];
    resetAt = oldestRecord.timestamp + config.windowMs;
  }

  return { allowed, remaining, resetAt };
}

/**
 * Record a rate limit hit
 */
export async function recordRateLimitHit(
  ctx: { db: any },
  identifier: string,
  action: string,
  metadata?: Record<string, any>
): Promise<void> {
  await ctx.db.insert("rateLimits", {
    identifier,
    action,
    timestamp: Date.now(),
    metadata,
  });
}

/**
 * Rate limit middleware for mutations
 * Automatically checks and records rate limits
 */
export function rateLimitMutation(action: string, config?: RateLimitConfig) {
  return async (
    ctx: any,
    args: any,
    getIdentifier: (ctx: any, args: any) => string | Promise<string>
  ): Promise<{ allowed: boolean; error?: string }> => {
    // Get the identifier (userId, IP, etc.)
    const identifier = await getIdentifier(ctx, args);

    // Check rate limit
    const limitConfig = config || DEFAULT_RATE_LIMITS[action] || DEFAULT_RATE_LIMITS.api;
    const result = await checkRateLimit(ctx, identifier, action, limitConfig);

    if (!result.allowed) {
      return {
        allowed: false,
        error: `Rate limit exceeded. Please try again later.`,
      };
    }

    // Record this hit
    await recordRateLimitHit(ctx, identifier, action);

    return { allowed: true };
  };
}

/**
 * Cleanup old rate limit records
 * Should be called periodically (e.g., via cron job)
 */
export async function cleanupOldRateLimits(ctx: { db: any }): Promise<number> {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // Keep records for 24 hours

  const records = await ctx.db.query("rateLimits").collect();

  let deleted = 0;
  for (const record of records) {
    if (now - record.timestamp > maxAge) {
      await ctx.db.delete(record._id);
      deleted++;
    }
  }

  return deleted;
}

/**
 * Get rate limit status for a user
 */
export async function getRateLimitStatus(
  ctx: { db: any },
  identifier: string,
  action: string
): Promise<{
  used: number;
  remaining: number;
  resetAt?: number;
  limit: number;
}> {
  const config = DEFAULT_RATE_LIMITS[action as keyof typeof DEFAULT_RATE_LIMITS] || DEFAULT_RATE_LIMITS.api;
  const result = await checkRateLimit(ctx, identifier, action, config);

  return {
    used: config.maxRequests - result.remaining,
    remaining: result.remaining,
    resetAt: result.resetAt,
    limit: config.maxRequests,
  };
}

/**
 * Check if an IP is blocked
 */
export async function isIPBlocked(ctx: { db: any }, ip: string): Promise<boolean> {
  const block = await ctx.db
    .query("blockedIPs")
    .withIndex("by_ip", (q: any) => q.eq("ip", ip))
    .first();

  if (!block) return false;

  // Check if block has expired
  if (block.expiresAt && block.expiresAt < Date.now()) {
    await ctx.db.delete(block._id);
    return false;
  }

  return true;
}

/**
 * Block an IP address
 */
export async function blockIP(
  ctx: { db: any },
  ip: string,
  reason: string,
  durationMs?: number
): Promise<void> {
  const expiresAt = durationMs ? Date.now() + durationMs : undefined;

  // Check if already blocked
  const existing = await ctx.db
    .query("blockedIPs")
    .withIndex("by_ip", (q: any) => q.eq("ip", ip))
    .first();

  if (existing) {
    // Update existing block
    await ctx.db.patch(existing._id, {
      reason,
      expiresAt,
      updatedAt: Date.now(),
    });
  } else {
    // Create new block
    await ctx.db.insert("blockedIPs", {
      ip,
      reason,
      expiresAt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
}

/**
 * Unblock an IP address
 */
export async function unblockIP(ctx: { db: any }, ip: string): Promise<void> {
  const block = await ctx.db
    .query("blockedIPs")
    .withIndex("by_ip", (q: any) => q.eq("ip", ip))
    .first();

  if (block) {
    await ctx.db.delete(block._id);
  }
}

/**
 * Get all blocked IPs
 */
export async function getBlockedIPs(ctx: { db: any }): Promise<any[]> {
  const now = Date.now();
  const blocks = await ctx.db.query("blockedIPs").collect();

  // Filter out expired blocks
  const activeBlocks = blocks.filter((block: any) => !block.expiresAt || block.expiresAt > now);

  return activeBlocks;
}

/**
 * Check rate limit for login attempts
 * Special handling for IP-based blocking after too many failed attempts
 */
export async function checkLoginRateLimit(
  ctx: { db: any },
  identifier: string,
  ip: string
): Promise<{ allowed: boolean; error?: string }> {
  // First check if IP is blocked
  const ipBlocked = await isIPBlocked(ctx, ip);
  if (ipBlocked) {
    return {
      allowed: false,
      error: "Too many failed login attempts. Please try again later.",
    };
  }

  // Check rate limit
  const result = await checkRateLimit(ctx, identifier, "login", DEFAULT_RATE_LIMITS.login);

  if (!result.allowed) {
    // Block the IP for 15 minutes if rate limit is exceeded
    await blockIP(ctx, ip, "Too many failed login attempts", 15 * 60 * 1000);
    return {
      allowed: false,
      error: "Too many failed login attempts. Please try again later.",
    };
  }

  return { allowed: true };
}
