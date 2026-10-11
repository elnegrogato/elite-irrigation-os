// src/lib/retry.ts

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  shouldRetry?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    shouldRetry = defaultShouldRetry,
    onRetry,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt or error shouldn't be retried
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );

      // Add some jitter to avoid thundering herd
      const jitter = delay * 0.1 * Math.random();
      const finalDelay = delay + jitter;

      // Call onRetry callback
      if (onRetry) {
        onRetry(attempt + 1, error);
      }

      // Wait before retrying
      await sleep(finalDelay);
    }
  }

  throw lastError;
}

// Default retry logic - retry network errors and 5xx errors
function defaultShouldRetry(error: any): boolean {
  // Network errors (no status code)
  if (!error?.statusCode && error?.message?.includes('network')) {
    return true;
  }

  // 5xx server errors
  const statusCode = error?.statusCode || error?.status;
  if (statusCode && statusCode >= 500 && statusCode < 600) {
    return true;
  }

  // 429 Too Many Requests
  if (statusCode === 429) {
    return true;
  }

  // 408 Request Timeout
  if (statusCode === 408) {
    return true;
  }

  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry decorator for functions
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: RetryOptions
): T {
  return (async (...args: Parameters<T>) => {
    return retryWithBackoff(() => fn(...args), options);
  }) as T;
}

// Retry with custom condition
export async function retryWhile<T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    onRetry,
  } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();

      // If condition is not met, return the result
      if (!condition(result)) {
        return result;
      }

      // If this is the last attempt, return the result anyway
      if (attempt === maxRetries) {
        return result;
      }

      // Wait before retrying
      const delay = baseDelay * Math.pow(2, attempt);
      if (onRetry) {
        onRetry(attempt + 1, result);
      }
      await sleep(delay);
    } catch (error) {
      // If there's an error, throw it immediately
      throw error;
    }
  }

  // Should never reach here, but TypeScript needs it
  throw new Error('Retry loop exhausted');
}

// Circuit breaker pattern
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime?: number;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000, // 1 minute
    private halfOpenAttempts: number = 3
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - (this.lastFailureTime || 0) > this.timeout) {
        this.state = 'half-open';
        this.failureCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();

      if (this.state === 'half-open') {
        this.failureCount = 0;
        this.state = 'closed';
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.threshold) {
        this.state = 'open';
      }

      throw error;
    }
  }

  reset(): void {
    this.failureCount = 0;
    this.state = 'closed';
    this.lastFailureTime = undefined;
  }

  getState(): 'closed' | 'open' | 'half-open' {
    return this.state;
  }
}
