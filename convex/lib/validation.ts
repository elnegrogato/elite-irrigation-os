// convex/lib/validation.ts
/**
 * Environment validation utilities
 * Provides comprehensive validation for all environment variables
 */

import { config, integrations } from "./config";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missing: string[];
}

/**
 * Validate all required environment variables are present
 */
export function validateEnvVars(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    missing: [],
  };

  // Required vars
  const requiredVars = [
    "CONVEX_DEPLOYMENT",
    "AUTH_SESSION_SECRET",
    "STRIPE_SECRET_KEY",
    "SITE_URL",
  ];

  for (const key of requiredVars) {
    if (!process.env[key]) {
      result.valid = false;
      result.missing.push(key);
    }
  }

  // Recommended but optional vars
  const recommendedVars = [
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
    "RESEND_API_KEY",
    "GEMINI_API_KEY",
  ];

  for (const key of recommendedVars) {
    if (!process.env[key]) {
      result.warnings.push(`Recommended variable not set: ${key}`);
    }
  }

  return result;
}

/**
 * Validate feature flags are correctly configured
 */
export function validateFeatureFlags(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    missing: [],
  };

  const flags = [
    { key: "ENABLE_AI_COPILOT", name: "AI Copilot" },
    { key: "ENABLE_EMAIL_SENDING", name: "Email Sending" },
    { key: "ENABLE_SMS_SENDING", name: "SMS Sending" },
  ];

  for (const flag of flags) {
    const value = process.env[flag.key];
    if (value && !["true", "false", "1", "0", "yes", "no"].includes(value.toLowerCase())) {
      result.warnings.push(
        `Feature flag ${flag.key} has invalid value: ${value} (expected: true/false)`
      );
    }
  }

  // Check for feature flag dependencies
  const enableSms = process.env["ENABLE_SMS_SENDING"]?.toLowerCase() === "true";
  if (enableSms && !integrations.hasTwilio()) {
    result.errors.push(
      "SMS sending is enabled but Twilio is not configured (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)"
    );
    result.valid = false;
  }

  const enableEmail = process.env["ENABLE_EMAIL_SENDING"]?.toLowerCase() === "true";
  if (enableEmail && !integrations.hasResend()) {
    result.warnings.push(
      "Email sending is enabled but Resend is not configured (RESEND_API_KEY)"
    );
  }

  return result;
}

/**
 * Validate API keys are properly formatted
 * This does basic format validation, not actual API testing
 */
export function validateApiKeys(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    missing: [],
  };

  // Stripe key format
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && !stripeKey.startsWith("sk_")) {
    result.errors.push(`Invalid STRIPE_SECRET_KEY format: should start with "sk_"`);
    result.valid = false;
  }

  const stripePublishable = process.env.STRIPE_PUBLISHABLE_KEY;
  if (stripePublishable && !stripePublishable.startsWith("pk_")) {
    result.errors.push(
      `Invalid STRIPE_PUBLISHABLE_KEY format: should start with "pk_"`
    );
    result.valid = false;
  }

  // Twilio SID format
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  if (twilioSid && !twilioSid.startsWith("AC")) {
    result.errors.push(`Invalid TWILIO_ACCOUNT_SID format: should start with "AC"`);
    result.valid = false;
  }

  // Resend API key format
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && !resendKey.startsWith("re_")) {
    result.errors.push(`Invalid RESEND_API_KEY format: should start with "re_"`);
    result.valid = false;
  }

  // Phone number format
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
  if (phoneNumber && !phoneNumber.match(/^\+\d{10,15}$/)) {
    result.errors.push(
      `Invalid TWILIO_PHONE_NUMBER format: ${phoneNumber} (expected E.164 format like +1234567890)`
    );
    result.valid = false;
  }

  // URL validation
  const urlVars = ["APP_URL", "SITE_URL", "CONVEX_DEPLOYMENT"];
  for (const urlVar of urlVars) {
    const url = process.env[urlVar];
    if (url) {
      try {
        new URL(url);
      } catch {
        result.errors.push(`Invalid ${urlVar} format: ${url} is not a valid URL`);
        result.valid = false;
      }
    }
  }

  return result;
}

/**
 * Run all validations and return combined results
 */
export function validateAll(): ValidationResult {
  const envResult = validateEnvVars();
  const featureResult = validateFeatureFlags();
  const apiResult = validateApiKeys();

  return {
    valid: envResult.valid && featureResult.valid && apiResult.valid,
    errors: [...envResult.errors, ...featureResult.errors, ...apiResult.errors],
    warnings: [...envResult.warnings, ...featureResult.warnings, ...apiResult.warnings],
    missing: envResult.missing,
  };
}

/**
 * Validate configuration and throw if critical errors exist
 * Use this during application startup
 */
export function validateOrThrow(): void {
  const result = validateAll();

  if (!result.valid) {
    const errorMessages = [
      "Configuration validation failed:",
      ...result.errors.map((e) => `  ✗ ${e}`),
      ...result.warnings.map((w) => `  ⚠ ${w}`),
    ].join("\n");

    throw new Error(errorMessages);
  }

  if (result.warnings.length > 0) {
    console.warn(
      "Configuration warnings:\n" + result.warnings.map((w) => `  ⚠ ${w}`).join("\n")
    );
  }
}

/**
 * Validate a specific integration's configuration
 */
export function validateIntegration(name: "twilio" | "stripe" | "resend" | "gemini"): {
  configured: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  switch (name) {
    case "twilio":
      if (!process.env.TWILIO_ACCOUNT_SID) errors.push("Missing TWILIO_ACCOUNT_SID");
      if (!process.env.TWILIO_AUTH_TOKEN) errors.push("Missing TWILIO_AUTH_TOKEN");
      if (!process.env.TWILIO_PHONE_NUMBER) errors.push("Missing TWILIO_PHONE_NUMBER");
      break;

    case "stripe":
      if (!process.env.STRIPE_SECRET_KEY) errors.push("Missing STRIPE_SECRET_KEY");
      break;

    case "resend":
      if (!process.env.RESEND_API_KEY) errors.push("Missing RESEND_API_KEY");
      break;

    case "gemini":
      if (!process.env.GEMINI_API_KEY) errors.push("Missing GEMINI_API_KEY");
      break;
  }

  return {
    configured: errors.length === 0,
    errors,
  };
}

/**
 * Test if API keys are valid by making actual API calls
 * This should be used sparingly (e.g., in admin config test UI)
 */
export async function testApiKeys(): Promise<{
  twilio?: { success: boolean; error?: string };
  stripe?: { success: boolean; error?: string };
  resend?: { success: boolean; error?: string };
}> {
  const results: any = {};

  // Test Twilio
  if (integrations.hasTwilio()) {
    try {
      const sid = process.env.TWILIO_ACCOUNT_SID!;
      const token = process.env.TWILIO_AUTH_TOKEN!;
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}.json`,
        {
          headers: {
            Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
          },
        }
      );
      results.twilio = {
        success: response.ok,
        error: response.ok ? undefined : `HTTP ${response.status}`,
      };
    } catch (error: any) {
      results.twilio = { success: false, error: error.message };
    }
  }

  // Test Stripe
  if (integrations.hasStripe()) {
    try {
      const stripe = (await import("stripe")).default;
      const client = new Stripe(process.env.STRIPE_SECRET_KEY!);
      await client.accounts.retrieve();
      results.stripe = { success: true };
    } catch (error: any) {
      results.stripe = { success: false, error: error.message };
    }
  }

  // Test Resend
  if (integrations.hasResend()) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "test@example.com",
          to: "test@example.com",
          subject: "Test",
          html: "<p>Test</p>",
        }),
      });
      // Resend will return 400/401 for invalid keys, even with invalid email
      // A 200 means the key is valid (email will bounce but that's ok)
      results.resend = {
        success: response.status !== 401,
        error: response.status === 401 ? "Invalid API key" : undefined,
      };
    } catch (error: any) {
      results.resend = { success: false, error: error.message };
    }
  }

  return results;
}
