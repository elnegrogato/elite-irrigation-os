// convex/lib/config.ts
/**
 * Centralized configuration management for Elite Irrigation & Landscaping OS
 * Provides type-safe environment variable access with validation
 */

interface ConfigSchema {
  // Convex
  convexDeployment: string;
  convexProductionUrl: string;

  // Auth
  authSessionSecret: string;
  authSessionExpiryHours: number;

  // Twilio
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;

  // Stripe
  stripeSecretKey: string;
  stripePublishableKey: string;
  stripeWebhookSecret: string;
  stripePriceId: string;

  // Email
  resendApiKey: string;
  emailFrom: string;
  emailFromName: string;

  // AI
  geminiApiKey: string;

  // App
  appUrl: string;
  appName: string;
  appEnv: "development" | "staging" | "production";
  siteUrl: string;

  // Feature Flags
  enableAiCopilot: boolean;
  enableEmailSending: boolean;
  enableSmsSending: boolean;

  // Rate Limiting
  rateLimitMaxRequests: number;
  rateLimitWindowMs: number;

  // Logging
  logLevel: "debug" | "info" | "warn" | "error";
  sentryDsn?: string;
}

/**
 * Get environment variable with type safety
 * Returns undefined if not found (for optional vars)
 */
function getEnvVar(key: string): string | undefined {
  return process.env[key];
}

/**
 * Get environment variable or throw error if missing
 * Use for required configuration values
 */
function requireEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get environment variable with fallback default
 * Use for optional configuration with sensible defaults
 */
function getEnvVarWithDefault(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Parse boolean from environment variable
 * Accepts: "true", "1", "yes" (case-insensitive)
 */
function parseBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return ["true", "1", "yes"].includes(value.toLowerCase());
}

/**
 * Parse number from environment variable
 * Throws if value is not a valid number
 */
function parseNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${key} must be a valid number, got: ${value}`);
  }
  return num;
}

/**
 * Validate all required environment variables
 * Throws descriptive error if any required vars are missing
 */
function validateConfig(): void {
  const requiredVars: { key: string; description: string }[] = [
    { key: "CONVEX_DEPLOYMENT", description: "Convex deployment URL" },
    { key: "STRIPE_SECRET_KEY", description: "Stripe secret key" },
    { key: "SITE_URL", description: "Site URL for webhooks and checkout" },
  ];

  const missing: string[] = [];

  for (const { key, description } of requiredVars) {
    if (!process.env[key]) {
      missing.push(`${key} (${description})`);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((m) => `  - ${m}`).join("\n")}`
    );
  }

  // Validate specific formats
  const appUrl = getEnvVarWithDefault("APP_URL", "http://localhost:5173");
  try {
    new URL(appUrl);
  } catch {
    throw new Error(`Invalid APP_URL: ${appUrl} must be a valid URL`);
  }

  const siteUrl = requireEnvVar("SITE_URL");
  try {
    new URL(siteUrl);
  } catch {
    throw new Error(`Invalid SITE_URL: ${siteUrl} must be a valid URL`);
  }

  // Validate auth session secret length
  const sessionSecret = getEnvVar("AUTH_SESSION_SECRET");
  if (sessionSecret && sessionSecret.length < 32) {
    throw new Error("AUTH_SESSION_SECRET must be at least 32 characters");
  }

  // Validate phone number format if provided
  const twilioPhone = getEnvVar("TWILIO_PHONE_NUMBER");
  if (twilioPhone && !twilioPhone.match(/^\+\d{10,15}$/)) {
    throw new Error(
      `Invalid TWILIO_PHONE_NUMBER: ${twilioPhone} must be in E.164 format (e.g., +1234567890)`
    );
  }

  // Validate rate limiting
  const maxRequests = parseNumber("RATE_LIMIT_MAX_REQUESTS", 100);
  const windowMs = parseNumber("RATE_LIMIT_WINDOW_MS", 60000);
  if (maxRequests < 1 || windowMs < 1000) {
    throw new Error(
      "Invalid rate limiting: RATE_LIMIT_MAX_REQUESTS must be >= 1 and RATE_LIMIT_WINDOW_MS must be >= 1000"
    );
  }
}

/**
 * Exported configuration object
 * Lazy-loads environment variables on first access
 */
export const config: Readonly<ConfigSchema> = (() => {
  // Validate on module load
  try {
    validateConfig();
  } catch (error) {
    console.error("Configuration validation failed:", error);
    throw error;
  }

  return {
    // Convex
    convexDeployment: requireEnvVar("CONVEX_DEPLOYMENT"),
    convexProductionUrl: getEnvVarWithDefault("CONVEX_PRODUCTION_URL", ""),

    // Auth
    authSessionSecret: requireEnvVar("AUTH_SESSION_SECRET"),
    authSessionExpiryHours: parseNumber("AUTH_SESSION_EXPIRY_HOURS", 24),

    // Twilio (optional - may be skipped in dev)
    twilioAccountSid: getEnvVarWithDefault("TWILIO_ACCOUNT_SID", ""),
    twilioAuthToken: getEnvVarWithDefault("TWILIO_AUTH_TOKEN", ""),
    twilioPhoneNumber: getEnvVarWithDefault("TWILIO_PHONE_NUMBER", ""),

    // Stripe
    stripeSecretKey: requireEnvVar("STRIPE_SECRET_KEY"),
    stripePublishableKey: getEnvVarWithDefault("STRIPE_PUBLISHABLE_KEY", ""),
    stripeWebhookSecret: getEnvVarWithDefault("STRIPE_WEBHOOK_SECRET", ""),
    stripePriceId: getEnvVarWithDefault("STRIPE_PRICE_ID", ""),

    // Email
    resendApiKey: getEnvVarWithDefault("RESEND_API_KEY", ""),
    emailFrom: getEnvVarWithDefault("EMAIL_FROM", "noreply@eliteirrigation.com"),
    emailFromName: getEnvVarWithDefault("EMAIL_FROM_NAME", "Elite Irrigation & Landscaping"),

    // AI
    geminiApiKey: getEnvVarWithDefault("GEMINI_API_KEY", ""),

    // App
    appUrl: getEnvVarWithDefault("APP_URL", "http://localhost:5173"),
    appName: getEnvVarWithDefault("APP_NAME", "Elite Irrigation & Landscaping OS"),
    appEnv: (getEnvVarWithDefault("APP_ENV", "development") as any),
    siteUrl: requireEnvVar("SITE_URL"),

    // Feature Flags
    enableAiCopilot: parseBoolean("ENABLE_AI_COPILOT", true),
    enableEmailSending: parseBoolean("ENABLE_EMAIL_SENDING", true),
    enableSmsSending: parseBoolean("ENABLE_SMS_SENDING", true),

    // Rate Limiting
    rateLimitMaxRequests: parseNumber("RATE_LIMIT_MAX_REQUESTS", 100),
    rateLimitWindowMs: parseNumber("RATE_LIMIT_WINDOW_MS", 60000),

    // Logging
    logLevel: (getEnvVarWithDefault("LOG_LEVEL", "info") as any),
    sentryDsn: getEnvVar("SENTRY_DSN"),
  };
})();

/**
 * Helper to check if optional integrations are configured
 */
export const integrations = {
  hasTwilio: () =>
    !!(config.twilioAccountSid && config.twilioAuthToken && config.twilioPhoneNumber),
  hasStripe: () => !!config.stripeSecretKey,
  hasResend: () => !!config.resendApiKey,
  hasGemini: () => !!config.geminiApiKey,
  hasSentry: () => !!config.sentryDsn,
};

/**
 * Get configuration status for health checks
 */
export function getConfigStatus() {
  return {
    valid: true,
    environment: config.appEnv,
    integrations: {
      twilio: integrations.hasTwilio(),
      stripe: integrations.hasStripe(),
      resend: integrations.hasResend(),
      gemini: integrations.hasGemini(),
      sentry: integrations.hasSentry(),
    },
    features: {
      aiCopilot: config.enableAiCopilot,
      emailSending: config.enableEmailSending,
      smsSending: config.enableSmsSending,
    },
  };
}

/**
 * Re-validate configuration (useful for testing)
 */
export function revalidateConfig(): void {
  validateConfig();
}

// Export utility functions for use in other modules
export { getEnvVar, requireEnvVar, getEnvVarWithDefault, validateConfig };
