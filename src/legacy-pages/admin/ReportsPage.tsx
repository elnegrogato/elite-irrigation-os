// src/pages/admin/ReportsPage.tsx
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  Calendar,
  Download,
  FileText,
  Filter,
  Save,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import TimeSeriesChart from '../../components/analytics/TimeSeriesChart';
import MetricCard from '../../components/analytics/MetricCard';
import {
  getRevenueOverTime,
  getLeadsOverTime,
  getConversionRate,
  getAverageJobValue
} from '../../../convex/analytics';

type ReportType = 'summary' | 'detailed' | 'trends';
type DateRange = '7d' | '30d' | '90d' | '6m' | '1y' | 'custom';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('summary');
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch analytics data
  const revenueData = useQuery(api.analytics.getRevenueOverTime, {
    period: 'day',
    startDate: getDateRangeStart(dateRange),
    endDate: Date.now()
  }) || [];

  const leadsData = useQuery(api.analytics.getLeadsOverTime, {
    period: 'day',
    startDate: getDateRangeStart(dateRange),
    endDate: Date.now()
  }) || [];

  const conversionData = useQuery(api.analytics.getConversionRate, {
    startDate: getDateRangeStart(dateRange),
    endDate: Date.now()
  });

  const avgJobValue = useQuery(api.analytics.getAverageJobValue, {
    startDate: getDateRangeStart(dateRange),
    endDate: Date.now()
  });

  const handleExport = (format: 'csv' | 'pdf') => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // In a real implementation, this would trigger a download
      console.log(`Exporting report as ${format}`);
    }, 2000);
  };

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.value, 0);
  const totalLeads = leadsData.reduce((sum, d) => sum + d.value, 0);

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">Reports</h2>
            <p className="text-sm text-slate-500 mt-1">Generate and export custom reports</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('csv')}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-elite-600 hover:bg-elite-700 rounded-sm transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Export CSV'}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-sm transition-colors disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Export PDF'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Report Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm focus:ring-elite-500 focus:border-elite-500"
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="trends">Trends Report</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm focus:ring-elite-500 focus:border-elite-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Service (Optional)
              </label>
              <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm focus:ring-elite-500 focus:border-elite-500">
                <option value="">All Services</option>
                <option value="irrigation-install">Irrigation Install</option>
                <option value="irrigation-repair">Irrigation Repair</option>
                <option value="landscape">Landscaping</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Source (Optional)
              </label>
              <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm focus:ring-elite-500 focus:border-elite-500">
                <option value="">All Sources</option>
                <option value="google">Google</option>
                <option value="organic">Organic</option>
                <option value="referral">Referral</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-elite-600 hover:bg-elite-700 rounded-sm transition-colors">
              <BarChart3 className="w-4 h-4" />
              Generate Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-sm transition-colors">
              <Save className="w-4 h-4" />
              Save as Template
            </button>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={totalRevenue}
            formatValue={(v) => `$${v.toLocaleString()}`}
            icon={TrendingUp}
            change={12.5}
            trend="up"
          />
          <MetricCard
            title="Total Leads"
            value={totalLeads}
            icon={FileText}
            change={8.3}
            trend="up"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${conversionData?.overall.toFixed(1) || 0}%`}
            change={2.1}
            trend="up"
          />
          <MetricCard
            title="Avg Job Value"
            value={avgJobValue?.overall || 0}
            formatValue={(v) => `$${v.toLocaleString()}`}
            change={-1.2}
            trend="down"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TimeSeriesChart
            data={revenueData.map(d => ({ date: d.date, value: d.value }))}
            xKey="date"
            yKey="value"
            title="Revenue Over Time"
            subtitle="Revenue trends by day"
            color="#059669"
            formatValue={(v) => `$${v.toLocaleString()}`}
          />

          <TimeSeriesChart
            data={leadsData.map(d => ({ date: d.date, value: d.value }))}
            xKey="date"
            yKey="value"
            title="Leads Over Time"
            subtitle="Lead volume trends by day"
            color="#3b82f6"
            formatValue={(v) => v.toLocaleString()}
          />
        </div>

        {/* Conversion Trends */}
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 font-serif mb-4">Conversion Rate Trends</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Month</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Total Leads</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Converted</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {conversionData?.monthly.map((month) => (
                  <tr key={month.month} className="border-b border-slate-100">
                    <td className="px-4 py-3 text-sm text-slate-900">{month.month}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{month.total}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{month.converted}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{month.rate.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function getDateRangeStart(range: DateRange): number {
  const now = Date.now();
  switch (range) {
    case '7d':
      return now - 7 * 24 * 60 * 60 * 1000;
    case '30d':
      return now - 30 * 24 * 60 * 60 * 1000;
    case '90d':
      return now - 90 * 24 * 60 * 60 * 1000;
    case '6m':
      return now - 6 * 30 * 24 * 60 * 60 * 1000;
    case '1y':
      return now - 12 * 30 * 24 * 60 * 60 * 1000;
    default:
      return now - 30 * 24 * 60 * 60 * 1000;
  }
}
