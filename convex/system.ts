// convex/system.ts
/**
 * System administration functions
 * Configuration validation and health checks
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateAll, validateIntegration } from "./lib/validation";

/**
 * Daily configuration validation
 * Run by cron job to check configuration health
 * Logs warnings for missing/invalid configuration
 */
export const validateConfigDaily = mutation({
  handler: async (ctx) => {
    const validation = validateAll();

    if (!validation.valid) {
      console.error("Configuration validation failed:", validation.errors);
    }

    if (validation.warnings.length > 0) {
      console.warn("Configuration warnings:", validation.warnings);
    }

    if (validation.missing.length > 0) {
      console.error("Missing environment variables:", validation.missing);
    }

    // Store validation result in database for admin visibility
    const systemDoc = await ctx.db
      .query("systemHealth")
      .withIndex("by_type", (q) => q.eq("type", "config_validation"))
      .first();

    const validationRecord = {
      type: "config_validation" as const,
      timestamp: Date.now(),
      valid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings,
      missing: validation.missing,
      environment: process.env.APP_ENV || "unknown",
    };

    if (systemDoc) {
      await ctx.db.patch(systemDoc._id, validationRecord);
    } else {
      await ctx.db.insert("systemHealth", validationRecord);
    }

    return {
      valid: validation.valid,
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length,
      missingCount: validation.missing.length,
    };
  },
});

/**
 * Get current configuration status
 * Used by admin dashboard to display config health
 */
export const getConfigStatus = query({
  handler: async (ctx) => {
    const validation = validateAll();

    // Get latest validation record from database
    const lastValidation = await ctx.db
      .query("systemHealth")
      .withIndex("by_type", (q) => q.eq("type", "config_validation"))
      .order("desc")
      .first();

    return {
      valid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings,
      missing: validation.missing,
      environment: process.env.APP_ENV || "unknown",
      lastValidated: lastValidation?.timestamp || null,
      integrations: {
        twilio: validateIntegration("twilio").configured,
        stripe: validateIntegration("stripe").configured,
        resend: validateIntegration("resend").configured,
        gemini: validateIntegration("gemini").configured,
      },
    };
  },
});

/**
 * Test an integration's API credentials
 * Returns success/error for admin UI feedback
 */
export const testIntegration = mutation({
  args: {
    integration: v.string(),
  },
  handler: async (ctx, args) => {
    const { integration } = args;

    if (!["twilio", "stripe", "resend", "gemini"].includes(integration)) {
      throw new Error(`Unknown integration: ${integration}`);
    }

    const validation = validateIntegration(integration as any);

    if (!validation.configured) {
      return {
        success: false,
        error: `Integration not configured: ${validation.errors.join(", ")}`,
      };
    }

    // For now, return configured status
    // Actual API testing can be added later with async calls
    return {
      success: true,
      message: `${integration} is configured`,
    };
  },
});

/**
 * Get system health overview
 * Includes configuration, database stats, and integration status
 */
export const getHealthOverview = query({
  handler: async (ctx) => {
    const validation = validateAll();

    // Get stats from various tables
    const leadCount = await ctx.db.query("leads").collect().then((leads) => leads.length);
    const workOrderCount = await ctx.db
      .query("workOrders")
      .collect()
      .then((orders) => orders.length);
    const invoiceCount = await ctx.db
      .query("invoices")
      .collect()
      .then((invoices) => invoices.length);

    return {
      status: validation.valid ? "healthy" : "degraded",
      version: "1.0.0",
      timestamp: Date.now(),
      config: {
        valid: validation.valid,
        errorCount: validation.errors.length,
        warningCount: validation.warnings.length,
      },
      database: {
        leads: leadCount,
        workOrders: workOrderCount,
        invoices: invoiceCount,
      },
      integrations: {
        twilio: validateIntegration("twilio").configured,
        stripe: validateIntegration("stripe").configured,
        resend: validateIntegration("resend").configured,
        gemini: validateIntegration("gemini").configured,
      },
    };
  },
});
