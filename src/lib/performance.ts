// src/lib/performance.ts
// Performance optimization utilities

/**
 * Debounce function calls - delays execution until after wait milliseconds have elapsed
 * since the last time the debounced function was called.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls - ensures execution at most once per wait milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Measure execution time of a function
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();

  const duration = endTime - startTime;
  console.log(`[Performance] ${name}: ${formatDuration(duration)}`);

  // Log slow operations
  if (duration > 100) {
    console.warn(`[Performance Warning] ${name} took ${duration.toFixed(2)}ms`);
  }

  return result;
}

/**
 * Measure execution time of an async function
 */
export async function measurePerformanceAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();

  const duration = endTime - startTime;
  console.log(`[Performance] ${name}: ${formatDuration(duration)}`);

  // Log slow operations
  if (duration > 500) {
    console.warn(`[Performance Warning] ${name} took ${duration.toFixed(2)}ms`);
  }

  return result;
}

/**
 * Format duration in milliseconds to human readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1) {
    return `${(ms * 1000).toFixed(2)}μs`;
  } else if (ms < 1000) {
    return `${ms.toFixed(2)}ms`;
  } else {
    return `${(ms / 1000).toFixed(2)}s`;
  }
}

/**
 * Log large component renders
 */
export function logLargeRender(componentName: string, renderTime: number): void {
  const threshold = 16; // 60fps = 16.67ms per frame

  if (renderTime > threshold) {
    console.warn(
      `[Performance] Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`
    );
  }
}

/**
 * Batch DOM updates to avoid layout thrashing
 */
export function batchDOMUpdates(updates: Array<() => void>): void {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

/**
 * Schedule low priority work
 */
export function scheduleLowPriorityWork(callback: () => void): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, 1);
  }
}

/**
 * Create a memoized selector with custom comparison
 */
export function createSelector<T, R>(
  selector: () => T,
  comparer: (prev: T, next: T) => boolean = (prev, next) => prev === next
): () => T {
  let cachedValue: T | null = null;

  return () => {
    const newValue = selector();
    if (cachedValue === null || !comparer(cachedValue, newValue)) {
      cachedValue = newValue;
    }
    return cachedValue as T;
  };
}

/**
 * Performance monitor class for tracking metrics
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number[]> = new Map();

  /**
   * Mark a performance timestamp
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark: string): number {
    const startTime = this.marks.get(startMark);
    const endTime = this.marks.get(endMark);

    if (startTime === undefined || endTime === undefined) {
      console.warn(`[Performance] Marks not found: ${startMark} -> ${endMark}`);
      return 0;
    }

    const duration = endTime - startTime;

    if (!this.measures.has(name)) {
      this.measures.set(name, []);
    }
    this.measures.get(name)!.push(duration);

    return duration;
  }

  /**
   * Get statistics for a measure
   */
  getStats(name: string) {
    const measures = this.measures.get(name);
    if (!measures || measures.length === 0) {
      return null;
    }

    const avg = measures.reduce((a, b) => a + b, 0) / measures.length;
    const min = Math.min(...measures);
    const max = Math.max(...measures);
    const sorted = [...measures].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];

    return {
      count: measures.length,
      avg,
      min,
      max,
      median,
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * Log all statistics
   */
  logStats(): void {
    console.log('[Performance] Statistics:');
    this.measures.forEach((_, name) => {
      const stats = this.getStats(name);
      if (stats) {
        console.log(`  ${name}:`, {
          avg: formatDuration(stats.avg),
          min: formatDuration(stats.min),
          max: formatDuration(stats.max),
          median: formatDuration(stats.median),
          p95: formatDuration(stats.p95),
          p99: formatDuration(stats.p99),
        });
      }
    });
  }

  /**
   * Clear all marks and measures
   */
  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }
}

// Global performance monitor instance
export const perfMonitor = new PerformanceMonitor();

/**
 * React render time measurement hook helper
 */
export function measureRender(componentName: string) {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    logLargeRender(componentName, renderTime);
    return renderTime;
  };
}

/**
 * Optimize scroll event handling with passive listeners
 */
export function getPassiveScrollListener(
  callback: (event: Event) => void
): { listener: (event: Event) => void; options: boolean | AddEventListenerOptions } {
  return {
    listener: callback,
    options: { passive: true } as AddEventListenerOptions,
  };
}

/**
 * Create a debounced search handler
 */
export function createDebouncedSearch<T>(
  searchFn: (query: string) => T | Promise<T>,
  delay: number = 300
): (query: string) => void {
  return debounce(searchFn, delay);
}

/**
 * Measure First Contentful Paint
 */
export function measureFCP(): void {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log(`[Performance] FCP: ${formatDuration(entry.startTime)}`);
          observer.disconnect();
        }
      }
    });
    observer.observe({ entryTypes: ['paint'] });
  }
}

/**
 * Measure Largest Contentful Paint
 */
export function measureLCP(): void {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`[Performance] LCP: ${formatDuration(lastEntry.startTime)}`);
      observer.disconnect();
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
}

/**
 * Measure Cumulative Layout Shift
 */
export function measureCLS(): void {
  if ('PerformanceObserver' in window) {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          console.log(`[Performance] CLS: ${clsValue.toFixed(4)}`);
        }
      }
    });
    observer.observe({ entryTypes: ['layout-shift'] });
  }
}

/**
 * Initialize all performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (process.env.NODE_ENV === 'development') {
    measureFCP();
    measureLCP();
    measureCLS();
    console.log('[Performance] Monitoring initialized');
  }
}
