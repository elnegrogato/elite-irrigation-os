// convex/lib/security.ts
import { v } from "convex/values";

// Validation rules interface
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  allowedValues?: string[];
  sanitize?: boolean;
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: any;
}

/**
 * Validate and sanitize input based on provided rules
 */
export function validateInput(input: any, rules: ValidationRules): ValidationResult {
  const errors: string[] = [];
  let value = input;

  // Check required
  if (rules.required && (value === null || value === undefined || value === "")) {
    errors.push("This field is required");
  }

  // Skip further validation if value is empty and not required
  if ((value === null || value === undefined || value === "") && !rules.required) {
    return { isValid: true, errors: [], sanitized: value };
  }

  // Convert to string for validation
  if (value !== null && value !== undefined) {
    value = String(value);
  }

  // Check minLength
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters`);
  }

  // Check maxLength
  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Must be no more than ${rules.maxLength} characters`);
  }

  // Check pattern
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push("Invalid format");
  }

  // Check allowed values
  if (rules.allowedValues && !rules.allowedValues.includes(value)) {
    errors.push(`Must be one of: ${rules.allowedValues.join(", ")}`);
  }

  // Sanitize if requested
  let sanitized = value;
  if (rules.sanitize) {
    sanitized = sanitizeHTML(value);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Strip dangerous HTML tags and attributes
 */
export function sanitizeHTML(html: string): string {
  if (!html) return html;

  // Remove script tags and content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Remove dangerous event handlers (onclick, onload, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");

  // Remove dangerous tags
  const dangerousTags = ["iframe", "object", "embed", "form", "input", "button"];
  dangerousTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, "gi");
    sanitized = sanitized.replace(regex, "");
  });

  // Remove style tags with javascript:
  sanitized = sanitized.replace(/<style[^>]*>.*?<\/style>/gis, (match) => {
    if (match.includes("javascript:") || match.includes("expression(")) {
      return "";
    }
    return match;
  });

  return sanitized;
}

/**
 * Strict email validation
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email || email.trim() === "") {
    errors.push("Email is required");
    return { isValid: false, errors };
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    errors.push("Invalid email format");
  }

  // Check length
  if (email.length > 254) {
    errors.push("Email is too long");
  }

  // Check for suspicious patterns
  if (email.includes("..") || email.startsWith(".") || email.endsWith(".")) {
    errors.push("Invalid email format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Phone number validation (supports multiple formats)
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];

  if (!phone || phone.trim() === "") {
    return { isValid: true, errors }; // Phone is often optional
  }

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Check length (10-15 digits for international numbers)
  if (cleaned.length < 10 || cleaned.length > 15) {
    errors.push("Phone number must be between 10 and 15 digits");
  }

  // Check if all digits are the same (obviously invalid)
  if (/^(\d)\1+$/.test(cleaned)) {
    errors.push("Invalid phone number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  // Check for common passwords
  const commonPasswords = [
    "password",
    "password123",
    "12345678",
    "qwerty",
    "abc123",
    "letmein",
    "admin",
    "welcome",
  ];
  if (commonPasswords.some((common) => password.toLowerCase().includes(common))) {
    errors.push("Password is too common");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHTML(unsafe: string): string {
  if (!unsafe) return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validate URL
 */
export function validateURL(url: string): ValidationResult {
  const errors: string[] = [];

  if (!url || url.trim() === "") {
    return { isValid: true, errors }; // URL is often optional
  }

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      errors.push("Only HTTP and HTTPS URLs are allowed");
    }

    // Check for javascript: protocol (XSS attempt)
    if (url.toLowerCase().startsWith("javascript:")) {
      errors.push("Invalid URL protocol");
    }
  } catch (e) {
    errors.push("Invalid URL format");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize filename to prevent path traversal
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
 * Detect XSS attempts in input
 */
export function detectXSS(input: string): boolean {
  if (!input) return false;

  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

/**
 * Hash a string using SHA-256
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Constants for security validation
 */
export const SECURITY_LIMITS = {
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 254,
  MAX_PHONE_LENGTH: 20,
  MAX_ADDRESS_LENGTH: 500,
  MAX_NOTE_LENGTH: 5000,
  MAX_FILENAME_LENGTH: 255,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;
