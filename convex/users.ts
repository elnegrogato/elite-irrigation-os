// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export type Role = "admin" | "manager" | "foreman" | "tech";
export type Status = "active" | "inactive" | "suspended";

// Create a new user
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    passwordHash: v.string(),
    passwordSalt: v.string(),
    role: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email.toLowerCase(),
      phone: args.phone,
      passwordHash: args.passwordHash,
      passwordSalt: args.passwordSalt,
      role: args.role as Role,
      status: args.status as Status,
      createdAt: now,
      updatedAt: now,
      failedLoginAttempts: 0,
      googleCalendarConnected: false,
      calendarAutoSync: false,
    });

    return userId;
  },
});

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) {
      return null;
    }

    // Don't expose password hash
    const { passwordHash, passwordSalt, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

// Get current authenticated user (returns user with password hash for validation)
export const getUserWithPasswordByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    return user;
  },
});

// Get user by ID
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      return null;
    }

    // Don't expose password hash
    const { passwordHash, passwordSalt, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(userId, { ...updates, updatedAt: Date.now() });
    return { success: true };
  },
});

// Update user role (admin only)
export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, { role: args.role as Role });
    return { success: true };
  },
});

// Update user status
export const updateStatus = mutation({
  args: {
    userId: v.id("users"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.userId, { status: args.status as Status });
    return { success: true };
  },
});

// List all users (admin only)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    // Don't expose password hashes
    return users.map(({ passwordHash, passwordSalt, ...user }) => user);
  },
});
