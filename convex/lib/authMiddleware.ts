// convex/lib/authMiddleware.ts
import { MutationBuilder, QueryBuilder } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

type Role = "admin" | "manager" | "foreman" | "tech";

export type AuthenticatedContext = {
  user: {
    _id: Id<"users">;
    name: string;
    email: string;
    phone?: string;
    role: Role;
    status: string;
    createdAt: number;
  };
  session: {
    id: Id<"sessions">;
    expiresAt: number;
    lastActiveAt: number;
  };
};

/**
 * Check if user is authenticated
 * Throws error if not authenticated
 */
export async function isAuthenticated(
  ctx: any,
  token: string | null
): Promise<AuthenticatedContext> {
  if (!token) {
    throw new Error("Authentication required: No token provided");
  }

  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();

  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Authentication failed: Invalid or expired session");
  }

  const user = await ctx.db.get(session.userId);
  if (!user || user.status !== "active" || (user.lockedUntil && user.lockedUntil > Date.now())) {
    throw new Error("Authentication failed: Invalid or inactive user");
  }

  const { passwordHash, passwordSalt, ...safeUser } = user;

  return {
    user: safeUser,
    session: {
      id: session._id,
      expiresAt: session.expiresAt,
      lastActiveAt: session.lastActiveAt,
    },
  };
}

/**
 * Check if user has required role
 * Throws error if user doesn't have required role
 */
export async function hasRole(
  ctx: any,
  token: string | null,
  roles: Role[]
): Promise<AuthenticatedContext> {
  const authContext = await isAuthenticated(ctx, token);

  if (!roles.includes(authContext.user.role as Role)) {
    throw new Error(
      `Authorization failed: Required role(s): ${roles.join(", ")}`
    );
  }

  return authContext;
}

/**
 * Wrapper for authenticated mutations
 */
export function requireAuth<Args extends { token: string }>(
  mutationFn: (ctx: any, args: Args, auth: AuthenticatedContext) => any
) {
  return async (ctx: any, args: Args) => {
    const auth = await isAuthenticated(ctx, args.token);
    return mutationFn(ctx, args, auth);
  };
}

/**
 * Wrapper for role-based mutations
 */
export function requireRole<Args extends { token: string }>(
  roles: Role[],
  mutationFn: (ctx: any, args: Args, auth: AuthenticatedContext) => any
) {
  return async (ctx: any, args: Args) => {
    const auth = await hasRole(ctx, args.token, roles);
    return mutationFn(ctx, args, auth);
  };
}

/**
 * Wrapper for authenticated queries
 */
export function requireAuthQuery<Args extends { token: string }>(
  queryFn: (ctx: any, args: Args, auth: AuthenticatedContext) => any
) {
  return async (ctx: any, args: Args) => {
    const auth = await isAuthenticated(ctx, args.token);
    return queryFn(ctx, args, auth);
  };
}

/**
 * Wrapper for role-based queries
 */
export function requireRoleQuery<Args extends { token: string }>(
  roles: Role[],
  queryFn: (ctx: any, args: Args, auth: AuthenticatedContext) => any
) {
  return async (ctx: any, args: Args) => {
    const auth = await hasRole(ctx, args.token, roles);
    return queryFn(ctx, args, auth);
  };
}
