import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  validateEmail,
  validatePasswordStrength,
  validatePhone,
} from "./lib/security";
import { checkLoginRateLimit, recordRateLimitHit } from "./lib/rateLimiter";

const SESSION_DURATION = Number(process.env.AUTH_SESSION_EXPIRY_HOURS ?? 24) * 60 * 60 * 1000;
const MAX_CONCURRENT_SESSIONS = Number(process.env.MAX_CONCURRENT_SESSIONS ?? 3);
const LOCKOUT_MS = Number(process.env.LOGIN_LOCKOUT_MINUTES ?? 15) * 60 * 1000;
const MAX_FAILED_ATTEMPTS = Number(process.env.MAX_LOGIN_ATTEMPTS ?? 5);
const ROLES = ["admin", "manager", "foreman", "tech"] as const;

type Ctx = { db: any };

function authPepper() {
  return process.env.AUTH_SESSION_SECRET || "elite_irrigating_pepper";
}

function safeUser(user: any) {
  const { passwordHash, passwordSalt, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.randomUUID();
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password + authPepper()),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return {
    hash: Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join(""),
    salt,
  };
}

async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password + authPepper()),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const candidate = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  if (candidate.length !== hash.length) return false;

  let diff = 0;
  for (let i = 0; i < candidate.length; i += 1) {
    diff |= candidate.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return diff === 0;
}

async function getUserByEmail(ctx: Ctx, email: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", email.toLowerCase()))
    .first();
}

async function logSecurityEvent(
  ctx: Ctx,
  args: {
    action: string;
    userId?: any;
    details?: Record<string, any>;
    severity?: string;
    ipAddress?: string;
    userAgent?: string;
  }
) {
  await ctx.db.insert("auditLogs", {
    action: args.action,
    userId: args.userId,
    details: args.details ?? {},
    severity: args.severity ?? "info",
    ipAddress: args.ipAddress,
    userAgent: args.userAgent,
    timestamp: Date.now(),
  });
}

async function createSession(ctx: Ctx, args: { userId: any; token: string; ipAddress?: string; userAgent?: string }) {
  const now = Date.now();
  const existingSessions = await ctx.db
    .query("sessions")
    .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
    .collect();

  const activeSessions = existingSessions.filter((session: any) => session.expiresAt > now);
  if (activeSessions.length >= MAX_CONCURRENT_SESSIONS) {
    activeSessions.sort((a: any, b: any) => a.createdAt - b.createdAt);
    await ctx.db.delete(activeSessions[0]._id);
  }

  const expiresAt = now + SESSION_DURATION;
  await ctx.db.insert("sessions", {
    userId: args.userId,
    token: args.token,
    expiresAt,
    createdAt: now,
    lastActiveAt: now,
    ipAddress: args.ipAddress,
    userAgent: args.userAgent,
  });

  return { expiresAt };
}

async function getSessionUser(ctx: Ctx, token: string) {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) return null;

  const user = await ctx.db.get(session.userId);
  if (!user || user.status !== "active") return null;
  if (user.lockedUntil && user.lockedUntil > Date.now()) return null;

  return { session, user };
}

export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    password: v.string(),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const role = ROLES.includes(args.role as any) ? args.role! : "tech";

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) throw new Error(emailValidation.errors.join(", "));

    if (args.phone) {
      const phoneValidation = validatePhone(args.phone);
      if (!phoneValidation.isValid) throw new Error(phoneValidation.errors.join(", "));
    }

    const passwordValidation = validatePasswordStrength(args.password);
    if (!passwordValidation.isValid) throw new Error(passwordValidation.errors.join(", "));

    const existingUser = await getUserByEmail(ctx, email);
    if (existingUser) throw new Error("Email already registered");

    const { hash, salt } = await hashPassword(args.password);
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      name: args.name.trim(),
      email,
      phone: args.phone,
      passwordHash: hash,
      passwordSalt: salt,
      role,
      status: "active",
      createdAt: now,
      updatedAt: now,
      failedLoginAttempts: 0,
      googleCalendarConnected: false,
      calendarAutoSync: false,
    });

    await logSecurityEvent(ctx, {
      action: "user_registered",
      userId,
      details: { email, role },
      severity: "info",
    });

    return { success: true, userId, message: "Registration successful" };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const ip = args.ipAddress || "unknown";
    const rateLimitCheck = await checkLoginRateLimit(ctx, email, ip);
    if (!rateLimitCheck.allowed) {
      await logSecurityEvent(ctx, {
        action: "login_rate_limited",
        details: { email, ip },
        severity: "warning",
        ipAddress: ip,
        userAgent: args.userAgent,
      });
      throw new Error(rateLimitCheck.error || "Too many login attempts");
    }

    const user = await getUserByEmail(ctx, email);
    if (!user) {
      await recordRateLimitHit(ctx, email, "login", { ip });
      await logSecurityEvent(ctx, {
        action: "login_failed",
        details: { email, reason: "user_not_found", ip },
        severity: "warning",
        ipAddress: ip,
        userAgent: args.userAgent,
      });
      throw new Error("Invalid email or password");
    }

    if (user.status !== "active") throw new Error("Account is not active");
    if (user.lockedUntil && user.lockedUntil > Date.now()) {
      throw new Error("Account is temporarily locked. Please try again later.");
    }

    const isValid = await verifyPassword(args.password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      const failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;
      const updates: Record<string, any> = { failedLoginAttempts, updatedAt: Date.now() };
      if (failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        updates.lockedUntil = Date.now() + LOCKOUT_MS;
      }
      await ctx.db.patch(user._id, updates);
      await recordRateLimitHit(ctx, email, "login", { ip });
      await logSecurityEvent(ctx, {
        action: failedLoginAttempts >= MAX_FAILED_ATTEMPTS ? "account_locked" : "login_failed",
        userId: user._id,
        details: { email, reason: "invalid_password", ip, failedLoginAttempts },
        severity: "warning",
        ipAddress: ip,
        userAgent: args.userAgent,
      });
      throw new Error("Invalid email or password");
    }

    if ((user.failedLoginAttempts ?? 0) > 0 || user.lockedUntil) {
      await ctx.db.patch(user._id, {
        failedLoginAttempts: 0,
        lockedUntil: undefined,
        updatedAt: Date.now(),
      });
    }

    const token = crypto.randomUUID();
    const { expiresAt } = await createSession(ctx, {
      userId: user._id,
      token,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
    });

    await logSecurityEvent(ctx, {
      action: "login_success",
      userId: user._id,
      details: { email, ip },
      severity: "info",
      ipAddress: ip,
      userAgent: args.userAgent,
    });

    return {
      success: true,
      token,
      expiresAt,
      user: safeUser(user),
    };
  },
});

export const logout = mutation({
  args: {
    token: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q: any) => q.eq("token", args.token))
      .first();

    if (!session) return { success: false, message: "Session not found" };

    await ctx.db.delete(session._id);
    await logSecurityEvent(ctx, {
      action: "logout",
      userId: args.userId ?? session.userId,
      severity: "info",
    });

    return { success: true };
  },
});

export const getAuthenticatedUser = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const result = await getSessionUser(ctx, args.token);
    if (!result) return null;

    return {
      session: {
        id: result.session._id,
        expiresAt: result.session.expiresAt,
        lastActiveAt: result.session.lastActiveAt,
        ipAddress: result.session.ipAddress,
        userAgent: result.session.userAgent,
      },
      user: safeUser(result.user),
    };
  },
});

export const changePassword = mutation({
  args: {
    token: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await getSessionUser(ctx, args.token);
    if (!result) throw new Error("Not authenticated");

    const isValid = await verifyPassword(args.currentPassword, result.user.passwordHash, result.user.passwordSalt);
    if (!isValid) throw new Error("Current password is incorrect");

    const passwordValidation = validatePasswordStrength(args.newPassword);
    if (!passwordValidation.isValid) throw new Error(passwordValidation.errors.join(", "));

    const { hash, salt } = await hashPassword(args.newPassword);
    await ctx.db.patch(result.user._id, {
      passwordHash: hash,
      passwordSalt: salt,
      passwordChangedAt: Date.now(),
      updatedAt: Date.now(),
    });

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q: any) => q.eq("userId", result.user._id))
      .collect();
    for (const session of sessions) await ctx.db.delete(session._id);

    await logSecurityEvent(ctx, {
      action: "password_changed",
      userId: result.user._id,
      severity: "info",
    });

    return { success: true, message: "Password changed successfully. Please login again." };
  },
});

export const requestPasswordReset = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    await logSecurityEvent(ctx, {
      action: "password_reset_requested",
      details: { email },
      severity: "info",
    });

    return {
      success: true,
      message: "If an account exists with this email, a password reset link will be sent.",
    };
  },
});

export const resetPassword = mutation({
  args: {
    token: v.string(),
    newPassword: v.string(),
  },
  handler: async () => {
    throw new Error("Password reset token verification is not implemented yet");
  },
});
