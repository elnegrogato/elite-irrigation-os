// src/lib/performanceMonitor.ts
/**
 * Performance monitoring system for tracking Web Vitals and custom metrics
 */

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface PerformanceReport {
  metrics: Metric[];
  slowComponents: Array<{ name: string; renderTime: number }>;
  apiResponseTimes: Array<{ endpoint: string; duration: number }>;
}

class PerformanceMonitor {
  private metrics: Metric[] = [];
  private slowComponents: Array<{ name: string; renderTime: number }> = [];
  private apiResponseTimes: Array<{ endpoint: string; duration: number }> = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production';
  }

  /**
   * Initialize performance monitoring
   */
  init(): void {
    if (!this.isEnabled) return;

    if (typeof window === 'undefined') return;

    // Track Web Vitals
    this.trackFCP();
    this.trackLCP();
    this.trackCLS();
    this.trackFID();
    this.trackTTFB();

    // Track navigation timing
    this.trackNavigationTiming();

    // Track resource timing
    this.trackResourceTiming();
  }

  /**
   * Track First Contentful Paint
   */
  private trackFCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('FCP', entry.startTime, this.getRating('FCP', entry.startTime));
            observer.disconnect();
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  /**
   * Track Largest Contentful Paint
   */
  private trackLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime, this.getRating('LCP', lastEntry.startTime));
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  /**
   * Track Cumulative Layout Shift
   */
  private trackCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.recordMetric('CLS', clsValue, this.getRating('CLS', clsValue));
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * Track First Input Delay
   */
  private trackFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('FID', (entry as any).processingStart - entry.startTime, this.getRating('FID', (entry as any).duration));
          observer.disconnect();
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  /**
   * Track Time to First Byte
   */
  private trackTTFB(): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart;
          this.recordMetric('TTFB', ttfb, this.getRating('TTFB', ttfb));
        }
      });
    }
  }

  /**
   * Track navigation timing
   */
  private trackNavigationTiming(): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        if (navigation) {
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          const loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
          const pageLoad = navigation.loadEventEnd - navigation.fetchStart;

          this.recordMetric('DOMContentLoaded', domContentLoaded, this.getRating('custom', domContentLoaded));
          this.recordMetric('LoadComplete', loadComplete, this.getRating('custom', loadComplete));
          this.recordMetric('PageLoad', pageLoad, this.getRating('PageLoad', pageLoad));
        }
      });
    }
  }

  /**
   * Track resource timing
   */
  private trackResourceTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          const duration = resource.responseEnd - resource.startTime;

          // Track slow resources (>1s)
          if (duration > 1000) {
            console.warn(`[Performance] Slow resource detected: ${resource.name} (${Math.round(duration)}ms)`);
          }
        }
      });
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  /**
   * Record a custom metric
   */
  recordMetric(name: string, value: number, rating?: 'good' | 'needs-improvement' | 'poor'): void {
    const metric: Metric = {
      name,
      value,
      rating: rating || this.getRating('custom', value),
      timestamp: Date.now(),
    };
    this.metrics.push(metric);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${Math.round(value)}ms (${rating})`);
    }
  }

  /**
   * Record slow component render
   */
  recordSlowComponent(name: string, renderTime: number): void {
    if (renderTime > 16) { // Slower than 60fps
      this.slowComponents.push({ name, renderTime });
      console.warn(`[Performance] Slow component: ${name} (${Math.round(renderTime)}ms)`);
    }
  }

  /**
   * Record API response time
   */
  recordAPIResponse(endpoint: string, duration: number): void {
    this.apiResponseTimes.push({ endpoint, duration });

    if (duration > 1000) {
      console.warn(`[Performance] Slow API: ${endpoint} (${Math.round(duration)}ms)`);
    }
  }

  /**
   * Get performance rating based on thresholds
   */
  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      TTFB: { good: 800, poor: 1800 },
      PageLoad: { good: 2000, poor: 4000 },
      custom: { good: 500, poor: 1000 },
    };

    const threshold = thresholds[metricName] || thresholds.custom;

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get performance report
   */
  getReport(): PerformanceReport {
    return {
      metrics: this.metrics,
      slowComponents: this.slowComponents,
      apiResponseTimes: this.apiResponseTimes,
    };
  }

  /**
   * Log performance summary
   */
  logSummary(): void {
    console.log('[Performance] Summary:', {
      metrics: this.metrics,
      slowComponents: this.slowComponents,
      apiResponseTimes: this.apiResponseTimes,
    });
  }

  /**
   * Send metrics to analytics (implement with your analytics provider)
   */
  sendToAnalytics(): void {
    const report = this.getReport();
    // Send to your analytics service
    // Example: analytics.track('performance_metrics', report);
  }

  /**
   * Clear all recorded metrics
   */
  clear(): void {
    this.metrics = [];
    this.slowComponents = [];
    this.apiResponseTimes = [];
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize on client side
if (typeof window !== 'undefined') {
  // Initialize after page load
  if (document.readyState === 'complete') {
    performanceMonitor.init();
  } else {
    window.addEventListener('load', () => {
      performanceMonitor.init();
    });
  }
}

/**
 * React hook for measuring component render time
 */
import { useEffect, useRef } from 'react';

export function useRenderTime(componentName: string) {
  const renderStartTime = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();

    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      performanceMonitor.recordSlowComponent(componentName, renderTime);
    };
  });
}

/**
 * Higher-order component for measuring render time
 */
export function withRenderTime<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function WithRenderTime(props: P) {
    useRenderTime(componentName);
    return <WrappedComponent {...props} />;
  };
}

export default performanceMonitor;
