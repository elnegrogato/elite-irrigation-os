// convex/lib/permissions.ts
import { v } from "convex-values";

// Permission format: resource:action
// Examples: users:read, leads:write, invoices:delete
export type Permission = `${string}:${string}`;

// Role definition
export type Role =
  | "admin"
  | "manager"
  | "office"
  | "technician"
  | "customer"
  | "guest";

// Permission matrix: which roles have which permissions
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    // Users
    "users:read",
    "users:write",
    "users:delete",

    // Leads
    "leads:read",
    "leads:write",
    "leads:delete",

    // Estimates
    "estimates:read",
    "estimates:write",
    "estimates:approve",
    "estimates:delete",

    // Invoices
    "invoices:read",
    "invoices:write",
    "invoices:delete",
    "invoices:refund",

    // Payments
    "payments:read",
    "payments:process",
    "payments:refund",

    // Schedule
    "schedule:read",
    "schedule:write",
    "schedule:delete",

    // Messages
    "messages:read",
    "messages:write",
    "messages:delete",

    // Reports
    "reports:read",
    "reports:export",

    // Settings
    "settings:read",
    "settings:write",

    // Security
    "security:read",
    "security:write",
    "audit:read",

    // System
    "system:admin",
  ],

  manager: [
    // Users
    "users:read",

    // Leads
    "leads:read",
    "leads:write",
    "leads:delete",

    // Estimates
    "estimates:read",
    "estimates:write",
    "estimates:approve",

    // Invoices
    "invoices:read",
    "invoices:write",

    // Payments
    "payments:read",
    "payments:process",

    // Schedule
    "schedule:read",
    "schedule:write",

    // Messages
    "messages:read",
    "messages:write",

    // Reports
    "reports:read",
    "reports:export",

    // Settings
    "settings:read",
  ],

  office: [
    // Users
    "users:read",

    // Leads
    "leads:read",
    "leads:write",

    // Estimates
    "estimates:read",
    "estimates:write",

    // Invoices
    "invoices:read",
    "invoices:write",

    // Payments
    "payments:read",

    // Schedule
    "schedule:read",
    "schedule:write",

    // Messages
    "messages:read",
    "messages:write",

    // Reports
    "reports:read",
  ],

  technician: [
    // Leads
    "leads:read",

    // Estimates
    "estimates:read",

    // Invoices
    "invoices:read",

    // Payments
    "payments:read",

    // Schedule
    "schedule:read",

    // Messages
    "messages:read",
    "messages:write",
  ],

  customer: [
    // Estimates
    "estimates:read",

    // Invoices
    "invoices:read",

    // Payments
    "payments:read",

    // Messages
    "messages:read",
    "messages:write",
  ],

  guest: [
    // Limited read access
    "estimates:read",
  ],
};

// Wildcard permissions (e.g., "users:*" means all user permissions)
export function expandPermission(permission: Permission): Permission[] {
  const [resource, action] = permission.split(":");

  if (action === "*") {
    // Return all permissions for this resource
    const allPermissions = Object.values(ROLE_PERMISSIONS).flat();
    return allPermissions.filter((p) => p.startsWith(`${resource}:`)) as Permission[];
  }

  return [permission];
}

// Check if a user has a specific permission
export function hasPermission(userRole: Role, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

  // Check direct permission
  if (rolePermissions.includes(permission)) {
    return true;
  }

  // Check wildcard permissions
  const [resource, action] = permission.split(":");
  const wildcardPermission = `${resource}:*` as Permission;
  if (rolePermissions.includes(wildcardPermission)) {
    return true;
  }

  return false;
}

// Check if a user has any of the specified permissions
export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

// Check if a user has all of the specified permissions
export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}

// Require a permission (throws if not present)
export function requirePermission(userRole: Role, permission: Permission): void {
  if (!hasPermission(userRole, permission)) {
    throw new Error(
      `Permission denied: ${permission} is required for role ${userRole}`
    );
  }
}

// Require any of the specified permissions
export function requireAnyPermission(userRole: Role, permissions: Permission[]): void {
  if (!hasAnyPermission(userRole, permissions)) {
    throw new Error(
      `Permission denied: One of ${permissions.join(", ")} is required for role ${userRole}`
    );
  }
}

// Get all permissions for a role
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Check if a role can access a resource
export function canAccessResource(userRole: Role, resource: string, action: string): boolean {
  const permission = `${resource}:${action}` as Permission;
  return hasPermission(userRole, permission);
}

// Permission middleware for Convex functions
export function withPermission(
  userRole: Role,
  requiredPermission: Permission
): { allowed: boolean; error?: string } {
  if (!hasPermission(userRole, requiredPermission)) {
    return {
      allowed: false,
      error: `You do not have permission to perform this action`,
    };
  }

  return { allowed: true };
}

// Get all available roles
export function getAllRoles(): Role[] {
  return Object.keys(ROLE_PERMISSIONS) as Role[];
}

// Check if a role is valid
export function isValidRole(role: string): role is Role {
  return getAllRoles().includes(role as Role);
}

// Get role display name
export function getRoleDisplayName(role: Role): string {
  const displayNames: Record<Role, string> = {
    admin: "Administrator",
    manager: "Manager",
    office: "Office Staff",
    technician: "Technician",
    customer: "Customer",
    guest: "Guest",
  };

  return displayNames[role] || role;
}

// Permission groups for easier checking
export const PERMISSION_GROUPS = {
  userManagement: ["users:read", "users:write", "users:delete"],
  leadManagement: ["leads:read", "leads:write", "leads:delete"],
  estimateManagement: ["estimates:read", "estimates:write", "estimates:approve", "estimates:delete"],
  invoiceManagement: ["invoices:read", "invoices:write", "invoices:delete", "invoices:refund"],
  paymentProcessing: ["payments:read", "payments:process", "payments:refund"],
  scheduleManagement: ["schedule:read", "schedule:write", "schedule:delete"],
  messaging: ["messages:read", "messages:write", "messages:delete"],
  reporting: ["reports:read", "reports:export"],
  systemAdministration: ["system:admin", "settings:write", "security:write"],
  auditAccess: ["audit:read"],
} as const;

// Check if user has permission group
export function hasPermissionGroup(userRole: Role, groupName: keyof typeof PERMISSION_GROUPS): boolean {
  const permissions = PERMISSION_GROUPS[groupName];
  return hasAnyPermission(userRole, permissions);
}
