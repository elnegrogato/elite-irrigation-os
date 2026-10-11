// src/lib/security.ts

/**
 * Sanitize user input on the client side
 */
export function sanitizeInput(input: string): string {
  if (!input) return input;

  // Remove potentially dangerous HTML
  let sanitized = input;

  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

  // Remove dangerous URL-bearing attributes and CSS payloads.
  sanitized = sanitized.replace(/\s*(href|src)\s*=\s*["']\s*(javascript|vbscript|data):[^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*style\s*=\s*["'][^"']*(javascript\s*:|expression\s*\(|vbscript\s*:)[^"']*["']/gi, "");
  sanitized = sanitized.replace(/javascript\s*:|vbscript\s*:|data\s*:\s*text\/html/gi, "");

  // Remove dangerous tags
  const dangerousTags = ["iframe", "object", "embed", "form", "input", "button"];
  dangerousTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, "gi");
    sanitized = sanitized.replace(regex, "");
  });

  return sanitized;
}

/**
 * Validate password strength on the client side
 */
export function validatePassword(password: string): {
  isValid: boolean;
  strength: "weak" | "fair" | "good" | "strong";
  errors: string[];
  score: number;
} {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  // Lowercase
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    errors.push("Password must contain a lowercase letter");
  }

  // Uppercase
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    errors.push("Password must contain an uppercase letter");
  }

  // Number
  if (/\d/.test(password)) {
    score += 1;
  } else {
    errors.push("Password must contain a number");
  }

  // Special character
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 1;
  } else {
    errors.push("Password must contain a special character");
  }

  // Determine strength
  let strength: "weak" | "fair" | "good" | "strong" = "weak";
  if (score >= 6) strength = "strong";
  else if (score >= 5) strength = "good";
  else if (score >= 4) strength = "fair";
  else strength = "weak";

  return {
    isValid: errors.length === 0,
    strength,
    errors,
    score,
  };
}

/**
 * Detect XSS attempts in input
 */
export function detectXSS(input: string): boolean {
  if (!input) return false;

  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHTML(unsafe: string): string {
  if (!unsafe) return unsafe;

  const escapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
    "/": "&#x2F;",
  };

  return unsafe.replace(/[&<>"'/]/g, (char) => escapeMap[char] || char);
}

/**
 * Validate URL
 */
export function validateURL(url: string): { isValid: boolean; error?: string } {
  if (!url || url.trim() === "") {
    return { isValid: true }; // URLs are often optional
  }

  try {
    const parsed = new URL(url);

    // Only allow http and https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { isValid: false, error: "Only HTTP and HTTPS URLs are allowed" };
    }

    // Check for javascript: protocol
    if (url.toLowerCase().startsWith("javascript:")) {
      return { isValid: false, error: "Invalid URL protocol" };
    }

    return { isValid: true };
  } catch (e) {
    return { isValid: false, error: "Invalid URL format" };
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || email.trim() === "") {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }

  return { isValid: true };
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return filename;

  // Remove path separators
  let sanitized = filename.replace(/[\/\\]/g, "");

  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*]/g, "");

  // Remove leading dots and spaces
  sanitized = sanitized.replace(/^[\.\s]+/, "");

  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }

  return sanitized || "file";
}

/**
 * Generate a random string
 */
export function generateRandomString(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Check if the connection is secure (HTTPS)
 */
export function isSecureConnection(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

/**
 * Get client IP address (from request headers if available)
 */
export async function getClientIP(): Promise<string> {
  try {
    // In a real implementation, you'd make a request to your backend
    // which can extract the IP from request headers
    const response = await fetch("/api/ip");
    const data = await response.json();
    return data.ip || "unknown";
  } catch (e) {
    return "unknown";
  }
}

/**
 * Get user agent string
 */
export function getUserAgent(): string {
  if (typeof window === "undefined") return "unknown";

  return window.navigator.userAgent;
}

/**
 * Check if the browser is supported
 */
export function isBrowserSupported(): boolean {
  if (typeof window === "undefined") return false;

  // Check for basic features
  const hasCrypto = "crypto" in window && "getRandomValues" in window.crypto;
  const hasLocalStorage = (function () {
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      return true;
    } catch (e) {
      return false;
    }
  })();

  return hasCrypto && hasLocalStorage;
}

/**
 * Store data securely in localStorage (with basic obfuscation)
 * Note: This is NOT truly secure, just prevents casual inspection
 */
export function secureStorageSet(key: string, value: any): void {
  try {
    const encoded = btoa(JSON.stringify(value));
    localStorage.setItem(key, encoded);
  } catch (e) {
    console.error("Failed to store data securely:", e);
  }
}

/**
 * Retrieve data from secure storage
 */
export function secureStorageGet<T>(key: string): T | null {
  try {
    const encoded = localStorage.getItem(key);
    if (!encoded) return null;

    const decoded = atob(encoded);
    return JSON.parse(decoded) as T;
  } catch (e) {
    console.error("Failed to retrieve secure data:", e);
    return null;
  }
}

/**
 * Remove data from secure storage
 */
export function secureStorageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Failed to remove secure data:", e);
  }
}

/**
 * Clear all secure storage
 */
export function secureStorageClear(): void {
  try {
    localStorage.clear();
  } catch (e) {
    console.error("Failed to clear secure storage:", e);
  }
}

/**
 * Security utilities for file uploads
 */
export const fileSecurity = {
  /**
   * Validate file before upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    // Check size
    if (file.size > maxSize) {
      return { valid: false, error: "File size exceeds 10MB limit" };
    }

    // Check type
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "File type not allowed" };
    }

    // Check extension
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return { valid: false, error: "File extension not allowed" };
    }

    return { valid: true };
  },

  /**
   * Generate safe filename
   */
  generateSafeFilename(original: string): string {
    const sanitized = sanitizeFilename(original);
    const random = generateRandomString(8);
    const extensionStart = sanitized.lastIndexOf(".");
    const hasExtension = extensionStart > 0 && extensionStart < sanitized.length - 1;
    const basename = hasExtension ? sanitized.slice(0, extensionStart) : sanitized;
    const extension = hasExtension ? sanitized.slice(extensionStart) : "";

    return `${random}_${basename}${extension}`;
  },
};

/**
 * Password strength calculator (returns 0-100)
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;

  let strength = 0;

  // Length (up to 40 points)
  if (password.length >= 8) strength += 10;
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;
  if (password.length >= 20) strength += 10;

  // Character variety (up to 40 points)
  if (/[a-z]/.test(password)) strength += 10;
  if (/[A-Z]/.test(password)) strength += 10;
  if (/\d/.test(password)) strength += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) strength += 10;

  // Complexity (up to 20 points)
  if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(password)) strength += 5; // Mixed case
  if (/\d.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]|[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?].*\d/.test(password)) {
    strength += 5; // Number + special
  }
  if (!/\s/.test(password)) strength += 10; // No spaces

  return Math.min(strength, 100);
}
