// convex/lib/export.ts
import { v } from "convex/values";

/**
 * Convert data to CSV format
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string
): string {
  if (data.length === 0) {
    return "";
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const csvRows = [
    headers.join(","), // Header row
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? "";
      }).join(",")
    )
  ];

  return csvRows.join("\n");
}

/**
 * Format data for PDF export (returns data structure, actual PDF generation done client-side)
 */
export function exportToPDF<T extends Record<string, any>>(
  data: T[],
  filename: string,
  template: "report" | "forecast" | "analytics" = "report"
): {
  filename: string;
  data: T[];
  template: string;
  timestamp: number;
} {
  return {
    filename,
    data,
    template,
    timestamp: Date.now()
  };
}

/**
 * Generate CSV from analytics data
 */
export function generateAnalyticsCSV(
  analyticsData: Array<{ date: string; value: number }>,
  title: string
): string {
  const headers = ["Date", "Value"];
  const rows = analyticsData.map(d => [d.date, d.value.toString()]);

  return [
    title,
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");
}

/**
 * Generate CSV from performance data
 */
export function generatePerformanceCSV(
  performanceData: Array<{
    name: string;
    jobsCompleted?: number;
    revenue?: number;
    efficiency?: number;
    conversionRate?: number;
  }>
): string {
  const headers = ["Name", "Jobs Completed", "Revenue", "Efficiency", "Conversion Rate"];
  const rows = performanceData.map(d => [
    d.name,
    (d.jobsCompleted ?? 0).toString(),
    (d.revenue ?? 0).toString(),
    (d.efficiency ?? 0).toFixed(1) + "%",
    (d.conversionRate ?? 0).toFixed(1) + "%"
  ]);

  return [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");
}

/**
 * Generate CSV from forecast data
 */
export function generateForecastCSV(
  forecastData: Array<{
    month: string;
    predicted: number;
    confidence?: number;
    actual?: number;
  }>
): string {
  const headers = ["Month", "Predicted", "Confidence", "Actual"];
  const rows = forecastData.map(d => [
    d.month,
    d.predicted.toFixed(2),
    d.confidence ? d.confidence.toFixed(2) : "N/A",
    d.actual ? d.actual.toFixed(2) : "N/A"
  ]);

  return [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");
}

/**
 * Generate CSV from cohort data
 */
export function generateCohortCSV(
  cohortData: Array<{
    cohortMonth: string;
    customerCount: number;
    retentionByMonth: Array<{ month: number; rate: number }>;
  }>
): string {
  const headers = ["Cohort Month", "Customers", ...Array.from({ length: 13 }, (_, i) => `Month ${i}`)];
  const rows = cohortData.map(d => [
    d.cohortMonth,
    d.customerCount.toString(),
    ...d.retentionByMonth.map(r => r.rate.toFixed(1) + "%")
  ]);

  return [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");
}

/**
 * Generate summary report data
 */
export function generateSummaryReport(
  data: {
    revenue: number;
    leads: number;
    conversionRate: number;
    averageJobValue: number;
    period: string;
  }
): string {
  const lines = [
    `ELITE IRRIGATION & LANDSCAPING - ${data.period} REPORT`,
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "SUMMARY METRICS",
    "================",
    `Total Revenue: $${data.revenue.toLocaleString()}`,
    `Total Leads: ${data.leads}`,
    `Conversion Rate: ${data.conversionRate.toFixed(1)}%`,
    `Average Job Value: $${data.averageJobValue.toLocaleString()}`,
    "",
    "END OF REPORT"
  ];

  return lines.join("\n");
}

/**
 * Format number as currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

/**
 * Format number as percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date range
 */
export function formatDateRange(startDate: number, endDate: number): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}

/**
 * Validate export data
 */
export function validateExportData<T extends Record<string, any>>(
  data: T[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    errors.push("Data must be an array");
    return { valid: false, errors };
  }

  if (data.length === 0) {
    errors.push("Data array is empty");
  }

  // Check for consistent keys across all objects
  if (data.length > 0) {
    const firstKeys = Object.keys(data[0]);
    data.forEach((item, index) => {
      const keys = Object.keys(item);
      if (JSON.stringify(keys.sort()) !== JSON.stringify(firstKeys.sort())) {
        errors.push(`Inconsistent keys at index ${index}`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Chunk data for large exports
 */
export function chunkData<T>(data: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Generate export filename with timestamp
 */
export function generateExportFilename(
  baseName: string,
  format: "csv" | "pdf" | "json"
): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .split("T")[0];

  return `${baseName}-${timestamp}.${format}`;
}
