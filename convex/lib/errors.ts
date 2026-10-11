// convex/lib/errors.ts
import { v } from 'convex/values';

// Custom Convex Error class
export class ConvexError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ConvexError';
  }
}

// Error throwing helpers
export function throwAuthError(message: string = 'Authentication required'): never {
  throw new ConvexError(message, 'AUTH_ERROR', 401);
}

export function throwValidationError(message: string, field?: string): never {
  const fullMessage = field ? `${field}: ${message}` : message;
  throw new ConvexError(fullMessage, 'VALIDATION_ERROR', 400);
}

export function throwConflictError(message: string = 'Resource conflict'): never {
  throw new ConvexError(message, 'CONFLICT_ERROR', 409);
}

export function throwNotFoundError(resource: string = 'Resource'): never {
  throw new ConvexError(`${resource} not found`, 'NOT_FOUND', 404);
}

export function throwBadRequestError(message: string = 'Bad request'): never {
  throw new ConvexError(message, 'BAD_REQUEST', 400);
}

export function throwForbiddenError(message: string = 'Access forbidden'): never {
  throw new ConvexError(message, 'FORBIDDEN', 403);
}

export function throwInternalError(message: string = 'Internal server error'): never {
  throw new ConvexError(message, 'INTERNAL_ERROR', 500);
}

// Map Convex errors to app-friendly format
export function mapConvexError(error: any): { message: string; code: string; statusCode: number; retryable: boolean } {
  if (error instanceof ConvexError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      retryable: error.statusCode === 0 || error.statusCode >= 500,
    };
  }

  // Handle standard Convex errors
  if (error?.data) {
    const data = error.data as any;
    return {
      message: data.message || 'An error occurred',
      code: data.code || 'UNKNOWN_ERROR',
      statusCode: data.statusCode || 500,
      retryable: (data.statusCode || 500) >= 500,
    };
  }

  // Generic error fallback
  return {
    message: error?.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
    retryable: false,
  };
}

// Validation helpers
export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throwValidationError(`${fieldName} is required`, fieldName);
  }
}

export function validateEmail(email: string, fieldName: string = 'email'): void {
  validateRequired(email, fieldName);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throwValidationError('Invalid email format', fieldName);
  }
}

export function validatePhone(phone: string, fieldName: string = 'phone'): void {
  validateRequired(phone, fieldName);
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
    throwValidationError('Invalid phone number format', fieldName);
  }
}

export function validateLength(value: string, min: number, max: number, fieldName: string): void {
  validateRequired(value, fieldName);
  if (value.length < min || value.length > max) {
    throwValidationError(`${fieldName} must be between ${min} and ${max} characters`, fieldName);
  }
}

export function validateMin(value: number, min: number, fieldName: string): void {
  if (value < min) {
    throwValidationError(`${fieldName} must be at least ${min}`, fieldName);
  }
}

export function validateMax(value: number, max: number, fieldName: string): void {
  if (value > max) {
    throwValidationError(`${fieldName} must be at most ${max}`, fieldName);
  }
}

export function validateEnum(value: any, allowedValues: string[], fieldName: string): void {
  if (!allowedValues.includes(value)) {
    throwValidationError(`${fieldName} must be one of: ${allowedValues.join(', ')}`, fieldName);
  }
}
