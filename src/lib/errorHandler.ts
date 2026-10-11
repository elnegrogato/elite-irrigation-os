// src/lib/errorHandler.ts

// Custom Error Classes
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace?.(this, AppError);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0, true);
    this.name = 'NetworkError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401, false);
    this.name = 'AuthError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message, 'VALIDATION_ERROR', 400, false);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 'CONFLICT_ERROR', 409, false);
    this.name = 'ConflictError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404, false);
    this.name = 'NotFoundError';
  }
}

// Error Handler Functions
export interface ErrorContext {
  context?: string;
  userId?: string;
  [key: string]: any;
}

let toastHandler: ((type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void) | null = null;

export function setToastHandler(handler: (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => void) {
  toastHandler = handler;
}

export function handleError(error: unknown, context: ErrorContext = {}): void {
  const errorInfo = parseError(error);
  const userMessage = getUserMessage(errorInfo);

  // Log error
  logError(errorInfo, context);

  // Show user-friendly message via toast
  if (toastHandler) {
    toastHandler('error', 'Error', userMessage);
  } else {
    console.error('Toast handler not set, falling back to console:', userMessage);
  }

  // TODO: Send to error reporting service (Sentry)
  // Sentry.captureException(errorInfo, { extra: context });
}

export function parseError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Try to identify error type from error message or name
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new NetworkError(error.message);
    }
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      return new AuthError(error.message);
    }
    if (error.message.includes('validation')) {
      return new ValidationError(error.message);
    }
    if (error.message.includes('conflict')) {
      return new ConflictError(error.message);
    }

    // Generic AppError for standard Errors
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }

  if (typeof error === 'string') {
    return new AppError(error, 'UNKNOWN_ERROR');
  }

  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
}

export function getUserMessage(error: AppError | Error): string {
  if (error instanceof AppError) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect. Please check your internet connection and try again.';
      case 'AUTH_ERROR':
        return 'You need to sign in to perform this action.';
      case 'VALIDATION_ERROR':
        return error.message;
      case 'CONFLICT_ERROR':
        return 'This action conflicts with existing data. Please refresh and try again.';
      case 'NOT_FOUND':
        return error.message;
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  }

  return error.message || 'An unexpected error occurred.';
}

export function logError(error: AppError | Error, context: ErrorContext = {}): void {
  const logData = {
    name: error.name,
    message: error.message,
    code: error instanceof AppError ? error.code : 'UNKNOWN',
    stack: error.stack,
    context,
  };

  console.error('Error logged:', logData);

  // TODO: Send to error reporting service
  // Sentry.captureException(error, { extra: context });
}

export function showErrorToast(error: unknown): void {
  const errorInfo = parseError(error);
  const userMessage = getUserMessage(errorInfo);

  if (toastHandler) {
    toastHandler('error', 'Error', userMessage);
  } else {
    console.error('Toast handler not set:', userMessage);
  }
}

export function isRetryable(error: unknown): boolean {
  const errorInfo = parseError(error);
  return errorInfo instanceof AppError ? errorInfo.retryable : false;
}

// Success/Error toast helpers
export function showSuccessToast(title: string, message?: string): void {
  if (toastHandler) {
    toastHandler('success', title, message);
  }
}

export function showWarningToast(title: string, message?: string): void {
  if (toastHandler) {
    toastHandler('warning', title, message);
  }
}

export function showInfoToast(title: string, message?: string): void {
  if (toastHandler) {
    toastHandler('info', title, message);
  }
}
