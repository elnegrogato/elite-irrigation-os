// convex/analytics.ts
import { query } from "convex/server";
import { v } from "convex/values";

// Helper function to group data by time period
function groupByPeriod(data: any[], dateField: string, period: 'day' | 'week' | 'month') {
  const grouped = new Map<string, number>();

  data.forEach(item => {
    const date = new Date(item[dateField]);
    let key: string;

    if (period === 'day') {
      key = date.toISOString().split('T')[0]; // YYYY-MM-DD
    } else if (period === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split('T')[0];
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    grouped.set(key, (grouped.get(key) || 0) + (item.value || 1));
  });

  return Array.from(grouped.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Helper function to calculate linear regression for forecasting
function linearRegression(data: number[]) {
  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = data;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

// Helper function to calculate growth rate
function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Helper function to calculate conversion rate
function calculateConversionRate(converted: number, total: number): number {
  if (total === 0) return 0;
  return (converted / total) * 100;
}

// ============= TIME SERIES QUERIES =============

export const getRevenueOverTime = query({
  args: {
    period: v.optional(v.string()), // 'day', 'week', 'month'
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const period = (args.period as 'day' | 'week' | 'month') || 'month';
    const startDate = args.startDate || new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).getTime();
    const endDate = args.endDate || Date.now();

    const invoices = await ctx.db.query("invoices").order("desc").take(1000);
    const paidInvoices = invoices.filter(i =>
      i.status === "paid" &&
      i.paidAt &&
      i.paidAt >= startDate &&
      i.paidAt <= endDate
    );

    const data = paidInvoices.map(inv => ({
      date: new Date(inv.paidAt!).toISOString(),
      value: inv.total || 0
    }));

    return groupByPeriod(data, 'date', period);
  },
});

export const getLeadsOverTime = query({
  args: {
    period: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const period = (args.period as 'day' | 'week' | 'month') || 'month';
    const startDate = args.startDate || new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).getTime();
    const endDate = args.endDate || Date.now();

    const leads = await ctx.db.query("leads").withIndex("by_createdAt").order("desc").take(1000);
    const filteredLeads = leads.filter(l =>
      l.createdAt >= startDate &&
      l.createdAt <= endDate
    );

    const data = filteredLeads.map(lead => ({
      date: new Date(lead.createdAt).toISOString(),
      value: 1
    }));

    return groupByPeriod(data, 'date', period);
  },
});

export const getConversionRate = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).getTime();
    const endDate = args.endDate || Date.now();

    const leads = await ctx.db.query("leads").withIndex("by_createdAt").order("desc").take(1000);
    const periodLeads = leads.filter(l => l.createdAt >= startDate && l.createdAt <= endDate);

    const convertedLeads = periodLeads.filter(l =>
      l.stage === "completed" || l.stage === "reviewed"
    );

    const conversionRate = calculateConversionRate(convertedLeads.length, periodLeads.length);

    // Also return monthly breakdown
    const monthlyData = new Map<string, { total: number; converted: number }>();

    periodLeads.forEach(lead => {
      const date = new Date(lead.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData.has(key)) {
        monthlyData.set(key, { total: 0, converted: 0 });
      }

      const data = monthlyData.get(key)!;
      data.total++;

      if (lead.stage === "completed" || lead.stage === "reviewed") {
        data.converted++;
      }
    });

    const monthlyBreakdown = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        total: data.total,
        converted: data.converted,
        rate: calculateConversionRate(data.converted, data.total)
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      overall: conversionRate,
      monthly: monthlyBreakdown
    };
  },
});

export const getAverageJobValue = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).getTime();
    const endDate = args.endDate || Date.now();

    const invoices = await ctx.db.query("invoices").order("desc").take(1000);
    const paidInvoices = invoices.filter(i =>
      i.status === "paid" &&
      i.paidAt &&
      i.paidAt >= startDate &&
      i.paidAt <= endDate
    );

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const averageValue = paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0;

    // Monthly breakdown
    const monthlyData = new Map<string, { total: number; count: number }>();

    paidInvoices.forEach(inv => {
      const date = new Date(inv.paidAt!);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData.has(key)) {
        monthlyData.set(key, { total: 0, count: 0 });
      }

      const data = monthlyData.get(key)!;
      data.total += inv.total || 0;
      data.count++;
    });

    const monthlyBreakdown = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        average: data.count > 0 ? data.total / data.count : 0,
        total: data.total,
        count: data.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      overall: averageValue,
      monthly: monthlyBreakdown
    };
  },
});

// ============= PERFORMANCE METRICS =============

export const getCrewPerformance = query({
  args: {
    crewId: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1).getTime();
    const endDate = args.endDate || Date.now();

    const appointments = await ctx.db.query("appointments")
      .withIndex("by_time", q => q.gte("scheduledFor", startDate).lte("scheduledFor", endDate))
      .collect();

    const crewAppointments = args.crewId
      ? appointments.filter(a => a.crewId === args.crewId)
      : appointments;

    const completed = crewAppointments.filter(a => a.status === "completed");
    const crewGroups = new Map<string, { count: number; totalRevenue: number }>();

    completed.forEach(appt => {
      const crewId = appt.crewId || "unassigned";
      if (!crewGroups.has(crewId)) {
        crewGroups.set(crewId, { count: 0, totalRevenue: 0 });
      }
      const data = crewGroups.get(crewId)!;
      data.count++;
    });

    return Array.from(crewGroups.entries()).map(([crewId, data]) => ({
      crewId,
      jobsCompleted: data.count,
      averageJobsPerDay: data.count / 30, // Approximate
      efficiency: completed.length > 0 ? (data.count / crewAppointments.length) * 100 : 0
    }));
  },
});

export const getStaffPerformance = query({
  args: {
    staffId: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1).getTime();
    const endDate = args.endDate || Date.now();

    const leads = await ctx.db.query("leads").withIndex("by_assigned").collect();

    const staffLeads = args.staffId
      ? leads.filter(l => l.assignedTo === args.staffId)
      : leads;

    const converted = staffLeads.filter(l =>
      l.stage === "completed" || l.stage === "reviewed"
    );

    const staffGroups = new Map<string, { total: number; converted: number }>();

    staffLeads.forEach(lead => {
      const staffId = lead.assignedTo || "unassigned";
      if (!staffGroups.has(staffId)) {
        staffGroups.set(staffId, { total: 0, converted: 0 });
      }
      const data = staffGroups.get(staffId)!;
      data.total++;
      if (lead.stage === "completed" || lead.stage === "reviewed") {
        data.converted++;
      }
    });

    return Array.from(staffGroups.entries()).map(([staffId, data]) => ({
      staffId,
      leadsAssigned: data.total,
      leadsConverted: data.converted,
      conversionRate: calculateConversionRate(data.converted, data.total)
    }));
  },
});

export const getServicePerformance = query({
  args: {
    serviceSlug: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1).getTime();
    const endDate = args.endDate || Date.now();

    const invoices = await ctx.db.query("invoices").order("desc").take(1000);
    const periodInvoices = invoices.filter(i => i.createdAt >= startDate && i.createdAt <= endDate);

    const serviceGroups = new Map<string, { revenue: number; count: number }>();

    periodInvoices.forEach(inv => {
      const serviceSlug = inv.serviceSlug || "other";
      if (!serviceGroups.has(serviceSlug)) {
        serviceGroups.set(serviceSlug, { revenue: 0, count: 0 });
      }
      const data = serviceGroups.get(serviceSlug)!;
      data.revenue += inv.total || 0;
      data.count++;
    });

    return Array.from(serviceGroups.entries())
      .map(([serviceSlug, data]) => ({
        serviceSlug,
        totalRevenue: data.revenue,
        jobCount: data.count,
        averageRevenue: data.count > 0 ? data.revenue / data.count : 0
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  },
});

// ============= FORECASTING =============

export const forecastRevenue = query({
  args: {
    monthsAhead: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const monthsAhead = args.monthsAhead || 6;
    const monthsToAnalyze = 12;

    // Get historical revenue data
    const monthlyRevenue: number[] = [];
    const now = new Date();

    for (let i = monthsToAnalyze - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i - 1, 1).getTime();
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i, 0, 23, 59, 59).getTime();

      const invoices = await ctx.db.query("invoices").order("desc").take(500);
      const monthlyInvoices = invoices.filter(i =>
        i.status === "paid" &&
        i.paidAt &&
        i.paidAt >= monthStart &&
        i.paidAt <= monthEnd
      );

      const revenue = monthlyInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
      monthlyRevenue.push(revenue);
    }

    // Calculate linear regression
    const { slope, intercept } = linearRegression(monthlyRevenue);

    // Generate forecast
    const forecast = [];
    for (let i = 1; i <= monthsAhead; i++) {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const predictedValue = slope * (monthsToAnalyze + i - 1) + intercept;

      forecast.push({
        month: `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`,
        predicted: Math.max(0, predictedValue),
        confidence: 0.85 // Simplified confidence
      });
    }

    return {
      historical: monthlyRevenue,
      forecast,
      trend: slope > 0 ? "increasing" : slope < 0 ? "decreasing" : "stable",
      averageMonthlyRevenue: monthlyRevenue.reduce((a, b) => a + b, 0) / monthlyRevenue.length
    };
  },
});

export const forecastLeadVolume = query({
  args: {
    monthsAhead: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const monthsAhead = args.monthsAhead || 6;
    const monthsToAnalyze = 12;

    const monthlyLeads: number[] = [];
    const now = new Date();

    for (let i = monthsToAnalyze - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i - 1, 1).getTime();
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i, 0, 23, 59, 59).getTime();

      const leads = await ctx.db.query("leads").withIndex("by_createdAt").order("desc").take(500);
      const monthlyCount = leads.filter(l =>
        l.createdAt >= monthStart &&
        l.createdAt <= monthEnd
      ).length;

      monthlyLeads.push(monthlyCount);
    }

    const { slope, intercept } = linearRegression(monthlyLeads);

    const forecast = [];
    for (let i = 1; i <= monthsAhead; i++) {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const predictedValue = slope * (monthsToAnalyze + i - 1) + intercept;

      forecast.push({
        month: `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`,
        predicted: Math.max(0, Math.round(predictedValue)),
        confidence: 0.80
      });
    }

    return {
      historical: monthlyLeads,
      forecast,
      trend: slope > 0 ? "increasing" : slope < 0 ? "decreasing" : "stable",
      averageMonthlyLeads: Math.round(monthlyLeads.reduce((a, b) => a + b, 0) / monthlyLeads.length)
    };
  },
});

export const predictSeasonalTrends = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const currentMonth = now.getMonth();

    // Get data for the last 2 years
    const seasonalData = new Map<number, number[]>(); // month -> [year1, year2]

    for (let yearOffset = 0; yearOffset < 2; yearOffset++) {
      for (let month = 0; month < 12; month++) {
        const monthStart = new Date(now.getFullYear() - yearOffset, month, 1).getTime();
        const monthEnd = new Date(now.getFullYear() - yearOffset, month + 1, 0, 23, 59, 59).getTime();

        const invoices = await ctx.db.query("invoices").order("desc").take(500);
        const monthlyRevenue = invoices.filter(i =>
          i.status === "paid" &&
          i.paidAt &&
          i.paidAt >= monthStart &&
          i.paidAt <= monthEnd
        ).reduce((sum, inv) => sum + (inv.total || 0), 0);

        if (!seasonalData.has(month)) {
          seasonalData.set(month, []);
        }
        seasonalData.get(month)!.push(monthlyRevenue);
      }
    }

    // Calculate seasonal patterns
    const patterns = Array.from(seasonalData.entries()).map(([month, revenues]) => {
      const avg = revenues.reduce((a, b) => a + b, 0) / revenues.length;
      return { month, averageRevenue: avg };
    });

    // Identify seasonal peaks
    const sortedPatterns = [...patterns].sort((a, b) => b.averageRevenue - a.averageRevenue);
    const peakMonths = sortedPatterns.slice(0, 3).map(p => p.month);
    const lowMonths = sortedPatterns.slice(-3).map(p => p.month);

    // Seasonality alerts
    const seasonalityAlerts = [];
    if (currentMonth === 11 || currentMonth === 0) {
      seasonalityAlerts.push({
        type: "spring_startup",
        message: "Spring startup season approaching - expect increased lead volume",
        severity: "info"
      });
    } else if (currentMonth === 8 || currentMonth === 9) {
      seasonalityAlerts.push({
        type: "winterization",
        message: "Winterization season approaching - prepare for seasonal service demand",
        severity: "info"
      });
    }

    return {
      patterns,
      peakMonths,
      lowMonths,
      currentMonth,
      seasonalityAlerts
    };
  },
});

// ============= COHORT ANALYSIS =============

export const getCohortRetention = query({
  args: {},
  handler: async (ctx) => {
    // Get customers grouped by their first purchase month
    const invoices = await ctx.db.query("invoices").order("desc").take(1000);
    const paidInvoices = invoices.filter(i => i.status === "paid" && i.paidAt);

    // Group by customer (using phone as proxy)
    const customerFirstPurchase = new Map<string, number>();
    const customerPurchases = new Map<string, number[]>();

    paidInvoices.forEach(inv => {
      const customerId = inv.customerPhone || "unknown";
      const purchaseDate = new Date(inv.paidAt!);
      const monthKey = `${purchaseDate.getFullYear()}-${String(purchaseDate.getMonth() + 1).padStart(2, '0')}`;

      if (!customerFirstPurchase.has(customerId)) {
        customerFirstPurchase.set(customerId, purchaseDate.getTime());
        customerPurchases.set(customerId, []);
      }

      customerPurchases.get(customerId)!.push(purchaseDate.getTime());
    });

    // Build cohort data
    const cohorts = new Map<string, number[]>();
    customerFirstPurchase.forEach((firstPurchase, customerId) => {
      const cohortMonth = new Date(firstPurchase);
      const cohortKey = `${cohortMonth.getFullYear()}-${String(cohortMonth.getMonth() + 1).padStart(2, '0')}`;

      if (!cohorts.has(cohortKey)) {
        cohorts.set(cohortKey, []);
      }

      const purchases = customerPurchases.get(customerId)!;
      const monthsActive = new Set(
        purchases.map(p => {
          const d = new Date(p);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        })
      );

      cohorts.get(cohortKey)!.push(monthsActive.size);
    });

    // Calculate retention rates
    const cohortData = Array.from(cohorts.entries()).map(([cohortMonth, activeMonths]) => {
      const customerCount = activeMonths.length;
      const retentionByMonth = [];

      for (let month = 0; month <= 12; month++) {
        const retained = activeMonths.filter(m => m >= month).length;
        const retentionRate = customerCount > 0 ? (retained / customerCount) * 100 : 0;
        retentionByMonth.push({ month, rate: retentionRate, customers: retained });
      }

      return {
        cohortMonth,
        customerCount,
        retentionByMonth
      };
    });

    return cohortData.sort((a, b) => b.cohortMonth.localeCompare(a.cohortMonth));
  },
});

export const getRepeatCustomerRate = query({
  args: {},
  handler: async (ctx) => {
    const invoices = await ctx.db.query("invoices").order("desc").take(1000);
    const paidInvoices = invoices.filter(i => i.status === "paid" && i.paidAt);

    const customerPurchases = new Map<string, number>();

    paidInvoices.forEach(inv => {
      const customerId = inv.customerPhone || "unknown";
      customerPurchases.set(customerId, (customerPurchases.get(customerId) || 0) + 1);
    });

    const totalCustomers = customerPurchases.size;
    const repeatCustomers = Array.from(customerPurchases.values()).filter(count => count > 1).length;
    const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

    return {
      totalCustomers,
      repeatCustomers,
      repeatRate,
      breakdown: {
        oneTime: totalCustomers - repeatCustomers,
        twoToFive: Array.from(customerPurchases.values()).filter(c => c >= 2 && c <= 5).length,
        sixOrMore: Array.from(customerPurchases.values()).filter(c => c >= 6).length
      }
    };
  },
});

export const getCustomerLifetimeValue = query({
  args: {},
  handler: async (ctx) => {
    const invoices = await ctx.db.query("invoices").order("desc").take(1000);
    const paidInvoices = invoices.filter(i => i.status === "paid" && i.paidAt);

    const customerRevenue = new Map<string, number>();

    paidInvoices.forEach(inv => {
      const customerId = inv.customerPhone || "unknown";
      customerRevenue.set(customerId, (customerRevenue.get(customerId) || 0) + (inv.total || 0));
    });

    const totalRevenue = Array.from(customerRevenue.values()).reduce((a, b) => a + b, 0);
    const totalCustomers = customerRevenue.size;
    const averageCLV = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    // Calculate median
    const sortedRevenue = Array.from(customerRevenue.values()).sort((a, b) => a - b);
    const medianCLV = sortedRevenue.length > 0
      ? sortedRevenue[Math.floor(sortedRevenue.length / 2)]
      : 0;

    // Segments
    const segments = {
      high: sortedRevenue.filter(r => r >= averageCLV * 1.5).length,
      medium: sortedRevenue.filter(r => r >= averageCLV * 0.5 && r < averageCLV * 1.5).length,
      low: sortedRevenue.filter(r => r < averageCLV * 0.5).length
    };

    return {
      averageCLV,
      medianCLV,
      totalRevenue,
      totalCustomers,
      segments
    };
  },
});

// ============= SOURCE ATTRIBUTION =============

export const getSourceROI = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).getTime();
    const endDate = args.endDate || Date.now();

    const leads = await ctx.db.query("leads").withIndex("by_createdAt").order("desc").take(1000);
    const periodLeads = leads.filter(l => l.createdAt >= startDate && l.createdAt <= endDate);

    const sourceRevenue = new Map<string, { leads: number; revenue: number; cost: number }>();

    // Get revenue from converted leads
    const invoices = await ctx.db.query("invoices").order("desc").take(1000);
    const paidInvoices = invoices.filter(i => i.status === "paid" && i.paidAt && i.paidAt >= startDate && i.paidAt <= endDate);

    for (const lead of periodLeads) {
      const source = lead.surface || "unknown";
      if (!sourceRevenue.has(source)) {
        sourceRevenue.set(source, { leads: 0, revenue: 0, cost: 0 });
      }

      const data = sourceRevenue.get(source)!;
      data.leads++;

      // Find revenue from this lead
      const leadRevenue = paidInvoices
        .filter(i => i.leadId === lead._id)
        .reduce((sum, inv) => sum + (inv.total || 0), 0);

      data.revenue += leadRevenue;
      data.cost += 50; // Simplified cost per lead
    }

    const roiData = Array.from(sourceRevenue.entries()).map(([source, data]) => {
      const roi = data.cost > 0 ? ((data.revenue - data.cost) / data.cost) * 100 : 0;
      return {
        source,
        leads: data.leads,
        revenue: data.revenue,
        cost: data.cost,
        roi,
        cpl: data.leads > 0 ? data.cost / data.leads : 0
      };
    }).sort((a, b) => b.roi - a.roi);

    return roiData;
  },
});

export const getLeadSourceBreakdown = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).getTime();
    const endDate = args.endDate || Date.now();

    const leads = await ctx.db.query("leads").withIndex("by_createdAt").order("desc").take(1000);
    const periodLeads = leads.filter(l => l.createdAt >= startDate && l.createdAt <= endDate);

    const sourceCounts = new Map<string, number>();

    periodLeads.forEach(lead => {
      const source = lead.surface || "unknown";
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
    });

    const totalLeads = periodLeads.length;

    return Array.from(sourceCounts.entries())
      .map(([source, count]) => ({
        source,
        count,
        percentage: totalLeads > 0 ? (count / totalLeads) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);
  },
});

export const getCostPerLead = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const startDate = args.startDate || new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).getTime();
    const endDate = args.endDate || Date.now();

    const leads = await ctx.db.query("leads").withIndex("by_createdAt").order("desc").take(1000);
    const periodLeads = leads.filter(l => l.createdAt >= startDate && l.createdAt <= endDate);

    // Estimated costs by source (simplified)
    const estimatedCosts: Record<string, number> = {
      "google": 120,
      "organic": 30,
      "referral": 20,
      "facebook": 80,
      "direct": 10,
      "yelp": 60,
      "unknown": 50
    };

    const sourceCosts = new Map<string, { leads: number; cost: number }>();

    periodLeads.forEach(lead => {
      const source = lead.surface || "unknown";
      if (!sourceCosts.has(source)) {
        sourceCosts.set(source, { leads: 0, cost: 0 });
      }

      const data = sourceCosts.get(source)!;
      data.leads++;
      data.cost += estimatedCosts[source] || 50;
    });

    return Array.from(sourceCosts.entries())
      .map(([source, data]) => ({
        source,
        leads: data.leads,
        totalCost: data.cost,
        cpl: data.leads > 0 ? data.cost / data.leads : 0
      }))
      .sort((a, b) => a.cpl - b.cpl);
  },
});
