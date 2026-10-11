// convex/lib/fileSecurity.ts
import { v } from "convex/values";
import { sanitizeFilename, SECURITY_LIMITS } from "./security";

// Allowed file types
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Allowed file extensions
export const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".pdf",
  ".doc",
  ".docx",
];

// Maximum file size (10MB)
export const MAX_FILE_SIZE = SECURITY_LIMITS.MAX_FILE_SIZE;

// Dangerous file signatures (magic bytes) to detect
export const DANGEROUS_SIGNATURES = [
  // Executables
  { signature: [0x4d, 0x5a], extension: ".exe" }, // PE/Windows executable
  { signature: [0x7f, 0x45, 0x4c, 0x46], extension: ".elf" }, // Linux executable
  { signature: [0xfe, 0xed, 0xfa, 0xce], extension: ".macho" }, // macOS executable

  // Scripts
  { signature: [0x3c, 0x25], extension: ".asp" }, // ASP
  { signature: [0x3c, 0x3f], extension: ".php" }, // PHP
  { signature: [0x23, 0x21], extension: ".sh" }, // Shell script
];

/**
 * Validate file upload
 */
export async function validateFileUpload(file: {
  name: string;
  size: number;
  type: string;
}): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check file extension
  const extension = getFileExtension(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `File type ${extension} is not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  // Check MIME type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File MIME type ${file.type} is not allowed`,
    };
  }

  // Sanitize filename
  const sanitized = sanitizeFilename(file.name);
  if (!sanitized || sanitized === "file") {
    return {
      valid: false,
      error: "Invalid filename",
    };
  }

  return { valid: true };
}

/**
 * Scan file for malicious content (basic check)
 * In production, use a dedicated antivirus/anti-malware service
 */
export async function scanFile(file: {
  name: string;
  size: number;
  buffer?: ArrayBuffer;
}): Promise<{ safe: boolean; threat?: string }> {
  // Check for double extensions (e.g., file.jpg.exe)
  const parts = file.name.split(".");
  if (parts.length > 2) {
    return {
      safe: false,
      threat: "File has multiple extensions - possible disguise attack",
    };
  }

  // Check for suspicious filenames
  const suspiciousPatterns = [/\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.scr$/i, /\.vbs$/i, /\.js$/i];
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return {
        safe: false,
        threat: "Suspicious file extension detected",
      };
    }
  }

  // If buffer is provided, check magic bytes
  if (file.buffer && file.buffer.byteLength > 0) {
    const bytes = new Uint8Array(file.buffer.slice(0, 4));

    for (const dangerous of DANGEROUS_SIGNATURES) {
      let matches = true;
      for (let i = 0; i < dangerous.signature.length; i++) {
        if (bytes[i] !== dangerous.signature[i]) {
          matches = false;
          break;
        }
      }

      if (matches) {
        return {
          safe: false,
          threat: `File signature matches dangerous file type: ${dangerous.extension}`,
        };
      }
    }
  }

  return { safe: true };
}

/**
 * Generate a safe filename
 */
export function generateSafeFilename(originalFilename: string): string {
  // Sanitize the filename
  const sanitized = sanitizeFilename(originalFilename);

  // Get extension
  const extension = getFileExtension(sanitized);

  // Generate random prefix
  const randomPrefix = crypto.randomUUID().split("-")[0];

  // Combine
  const nameWithoutExt = sanitized.replace(extension, "");
  const safeName = `${randomPrefix}_${nameWithoutExt}${extension}`;

  return safeName;
}

/**
 * Verify actual image type by checking magic bytes
 */
export async function validateImageType(file: {
  name: string;
  buffer: ArrayBuffer;
}): Promise<{ valid: boolean; actualType?: string }> {
  const bytes = new Uint8Array(file.buffer.slice(0, 12));

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { valid: true, actualType: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { valid: true, actualType: "image/png" };
  }

  // GIF: 47 49 46 38
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return { valid: true, actualType: "image/gif" };
  }

  // WebP: 52 49 46 46 ... 57 45 42 50
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { valid: true, actualType: "image/webp" };
  }

  return { valid: false };
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? "." + parts.pop()?.toLowerCase() : "";
}

/**
 * Check if file is an image
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
}

/**
 * Check if file is a document
 */
export function isDocumentFile(filename: string): boolean {
  const docExtensions = [".pdf", ".doc", ".docx"];
  const extension = getFileExtension(filename);
  return docExtensions.includes(extension);
}

/**
 * Get human-readable file size
 */
export function getReadableFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
