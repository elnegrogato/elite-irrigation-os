// convex/lib/aggregation.ts
import { v } from "convex/values";

/**
 * Group data by day
 */
export function groupByDay<T extends Record<string, any>>(
  data: T[],
  dateField: keyof T
): Array<{ date: string; count: number; data: T[] }> {
  const grouped = new Map<string, T[]>();

  data.forEach(item => {
    const date = new Date(item[dateField] as number);
    const key = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(item);
  });

  return Array.from(grouped.entries())
    .map(([date, items]) => ({ date, count: items.length, data: items }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Group data by week
 */
export function groupByWeek<T extends Record<string, any>>(
  data: T[],
  dateField: keyof T
): Array<{ week: string; count: number; data: T[] }> {
  const grouped = new Map<string, T[]>();

  data.forEach(item => {
    const date = new Date(item[dateField] as number);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const key = weekStart.toISOString().split('T')[0];

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(item);
  });

  return Array.from(grouped.entries())
    .map(([week, items]) => ({ week, count: items.length, data: items }))
    .sort((a, b) => a.week.localeCompare(b.week));
}

/**
 * Group data by month
 */
export function groupByMonth<T extends Record<string, any>>(
  data: T[],
  dateField: keyof T
): Array<{ month: string; count: number; data: T[] }> {
  const grouped = new Map<string, T[]>();

  data.forEach(item => {
    const date = new Date(item[dateField] as number);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(item);
  });

  return Array.from(grouped.entries())
    .map(([month, items]) => ({ month, count: items.length, data: items }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(
  data: number[],
  period: number
): number[] {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(data[i]);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / period;
      result.push(avg);
    }
  }

  return result;
}

/**
 * Calculate growth rate between two values
 */
export function calculateGrowthRate(
  current: number,
  previous: number
): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(
  converted: number,
  total: number
): number {
  if (total === 0) return 0;
  return (converted / total) * 100;
}

/**
 * Calculate percentile
 */
export function calculatePercentile(
  data: number[],
  percentile: number
): number {
  if (data.length === 0) return 0;

  const sorted = [...data].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index];
}

/**
 * Calculate standard deviation
 */
export function calculateStandardDeviation(data: number[]): number {
  if (data.length === 0) return 0;

  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const squaredDiffs = data.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;

  return Math.sqrt(avgSquaredDiff);
}

/**
 * Calculate median
 */
export function calculateMedian(data: number[]): number {
  if (data.length === 0) return 0;

  const sorted = [...data].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Group by field and aggregate
 */
export function groupByField<T extends Record<string, any>>(
  data: T[],
  field: keyof T,
  aggregations: {
    count?: boolean;
    sum?: keyof T;
    avg?: keyof T;
    min?: keyof T;
    max?: keyof T;
  } = {}
): Array<{ key: string; [key: string]: any }> {
  const grouped = new Map<string, T[]>();

  // Group data
  data.forEach(item => {
    const key = String(item[field] || "unknown");
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item);
  });

  // Aggregate
  return Array.from(grouped.entries()).map(([key, items]) => {
    const result: any = { key, count: items.length };

    if (aggregations.sum) {
      result.sum = items.reduce((sum, item) => sum + (Number(item[aggregations.sum!]) || 0), 0);
    }

    if (aggregations.avg) {
      const sum = items.reduce((s, item) => s + (Number(item[aggregations.avg!]) || 0), 0);
      result.avg = items.length > 0 ? sum / items.length : 0;
    }

    if (aggregations.min) {
      result.min = Math.min(...items.map(item => Number(item[aggregations.min!]) || 0));
    }

    if (aggregations.max) {
      result.max = Math.max(...items.map(item => Number(item[aggregations.max!]) || 0));
    }

    return result;
  }).sort((a, b) => b.count - a.count);
}

/**
 * Calculate year-over-year growth
 */
export function calculateYoYGrowth(
  currentYearData: number[],
  previousYearData: number[]
): number {
  const currentSum = currentYearData.reduce((a, b) => a + b, 0);
  const previousSum = previousYearData.reduce((a, b) => a + b, 0);

  return calculateGrowthRate(currentSum, previousSum);
}

/**
 * Calculate compound annual growth rate (CAGR)
 */
export function calculateCAGR(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (startValue === 0 || years === 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

/**
 * Smooth data using exponential moving average
 */
export function calculateEMA(
  data: number[],
  period: number
): number[] {
  if (data.length === 0) return [];

  const multiplier = 2 / (period + 1);
  const ema: number[] = [data[0]];

  for (let i = 1; i < data.length; i++) {
    ema.push((data[i] - ema[i - 1]) * multiplier + ema[i - 1]);
  }

  return ema;
}
