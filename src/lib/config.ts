// src/lib/config.ts
/**
 * Frontend configuration management
 * Provides safe access to environment variables for client-side code
 */

interface AppConfig {
  appUrl: string;
  appName: string;
  appEnv: "development" | "staging" | "production";
  convexDeployment: string;
  enableAiCopilot: boolean;
  version: string;
}

/**
 * Get configuration from import.meta.env (Vite)
 * Only includes safe, non-sensitive values
 */
function getConfig(): AppConfig {
  return {
    appUrl: import.meta.env.VITE_APP_URL || window.location.origin,
    appName: import.meta.env.VITE_APP_NAME || "Elite Irrigation & Landscaping",
    appEnv: (import.meta.env.VITE_APP_ENV as any) || "development",
    convexDeployment: import.meta.env.VITE_CONVEX_DEPLOYMENT || "",
    enableAiCopilot: import.meta.env.VITE_ENABLE_AI_COPILOT === "true",
    version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  };
}

/**
 * Exported singleton config object
 */
export const config = getConfig();

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: "aiCopilot" | "emailSending" | "smsSending"): boolean {
  switch (feature) {
    case "aiCopilot":
      return config.enableAiCopilot;
    case "emailSending":
      return import.meta.env.VITE_ENABLE_EMAIL_SENDING === "true";
    case "smsSending":
      return import.meta.env.VITE_ENABLE_SMS_SENDING === "true";
    default:
      return false;
  }
}

/**
 * Get the correct API URL for the current environment
 */
export function getApiUrl(): string {
  const env = config.appEnv;

  if (env === "production") {
    return import.meta.env.VITE_PRODUCTION_API_URL || config.appUrl;
  }

  return config.appUrl;
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return config.appEnv === "development";
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return config.appEnv === "production";
}

/**
 * Validate configuration on app load
 * Throws user-friendly error if config is invalid
 */
export function validateClientConfig(): { valid: boolean; error?: string } {
  try {
    // Check for required vars
    if (!config.convexDeployment) {
      return {
        valid: false,
        error:
          "Application configuration is missing. Please ensure VITE_CONVEX_DEPLOYMENT is set.",
      };
    }

    // Validate URL format
    try {
      new URL(config.appUrl);
    } catch {
      return {
        valid: false,
        error: `Invalid APP_URL: ${config.appUrl}`,
      };
    }

    return { valid: true };
  } catch (error: any) {
    return {
      valid: false,
      error: error.message || "Configuration validation failed",
    };
  }
}

/**
 * Show configuration error to user
 * Use this when critical config is missing
 */
export function showConfigError(error: string): void {
  if (isDevelopment()) {
    console.error("Configuration Error:", error);
  }

  // You could show a toast/modal here
  // For now, just log to console
  console.error(
    "⚠️ Configuration Error:\n" +
      error +
      "\n\nPlease check your environment variables and restart the application."
  );
}

/**
 * Get environment display name
 */
export function getEnvironmentLabel(): string {
  switch (config.appEnv) {
    case "production":
      return "Production";
    case "staging":
      return "Staging";
    case "development":
      return "Development";
    default:
      return "Unknown";
  }
}

/**
 * Get environment color for UI indicators
 */
export function getEnvironmentColor(): string {
  switch (config.appEnv) {
    case "production":
      return "red";
    case "staging":
      return "yellow";
    case "development":
      return "green";
    default:
      return "gray";
  }
}

/**
 * Reload configuration (useful for testing or admin actions)
 */
export async function reloadConfig(): Promise<void> {
  // In a real app, this might trigger a reload from server
  // For now, just reload the page
  window.location.reload();
}

// Auto-validate on module load
const validation = validateClientConfig();
if (!validation.valid) {
  showConfigError(validation.error || "Unknown configuration error");
}
