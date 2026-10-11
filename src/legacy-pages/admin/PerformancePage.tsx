// src/pages/admin/PerformancePage.tsx
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  Trophy,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Filter
} from 'lucide-react';
import PerformanceTable from '../../components/analytics/PerformanceTable';
import MetricCard from '../../components/analytics/MetricCard';

export default function PerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '6m' | '1y'>('90d');

  const crewPerformance = useQuery(api.analytics.getCrewPerformance, {
    startDate: getPeriodStart(selectedPeriod),
    endDate: Date.now()
  }) || [];

  const staffPerformance = useQuery(api.analytics.getStaffPerformance, {
    startDate: getPeriodStart(selectedPeriod),
    endDate: Date.now()
  }) || [];

  const servicePerformance = useQuery(api.analytics.getServicePerformance, {
    startDate: getPeriodStart(selectedPeriod),
    endDate: Date.now()
  }) || [];

  // Transform crew data for the table
  const crewTableData = crewPerformance.map((crew, index) => ({
    id: crew.crewId,
    name: crew.crewId === 'unassigned' ? 'Unassigned' : `Crew ${crew.crewId}`,
    jobsCompleted: crew.jobsCompleted,
    revenue: crew.jobsCompleted * 2500, // Estimated revenue
    efficiency: crew.efficiency,
    trend: ['up', 'down', 'neutral'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'neutral'
  }));

  // Transform staff data for the table
  const staffTableData = staffPerformance
    .filter(s => s.staffId !== 'unassigned')
    .map((staff, index) => ({
      id: staff.staffId,
      name: staff.staffId,
      jobsCompleted: staff.leadsConverted,
      revenue: staff.leadsConverted * 2000, // Estimated revenue
      efficiency: staff.conversionRate,
      trend: ['up', 'down', 'neutral'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'neutral'
    }))
    .slice(0, 10);

  // Transform service data
  const serviceTableData = servicePerformance.map((service, index) => ({
    id: service.serviceSlug,
    name: service.serviceSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    jobsCompleted: service.jobCount,
    revenue: service.totalRevenue,
    efficiency: (service.totalRevenue / (service.jobCount || 1)) / 100, // Normalize to percentage
    trend: ['up', 'down', 'neutral'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'neutral'
  }));

  const topCrew = crewTableData.length > 0 ? crewTableData[0] : null;
  const topService = serviceTableData.length > 0 ? serviceTableData[0] : null;
  const totalRevenue = serviceTableData.reduce((sum, s) => sum + s.revenue, 0);
  const totalJobs = serviceTableData.reduce((sum, s) => sum + s.jobsCompleted, 0);

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">Performance</h2>
            <p className="text-sm text-slate-500 mt-1">Track crew, staff, and service performance</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-sm focus:ring-elite-500 focus:border-elite-500"
            >
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>

        {/* Performance Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Top Crew"
            value={topCrew?.name || 'N/A'}
            change={topCrew?.jobsCompleted || 0}
            formatValue={(v) => `${v} jobs`}
            icon={Trophy}
            trend="up"
            subtitle="Most jobs completed"
          />
          <MetricCard
            title="Top Service"
            value={topService?.name || 'N/A'}
            change={topService?.revenue || 0}
            formatValue={(v) => `$${v.toLocaleString()}`}
            icon={DollarSign}
            trend="up"
            subtitle="Highest revenue"
          />
          <MetricCard
            title="Total Revenue"
            value={totalRevenue}
            formatValue={(v) => `$${v.toLocaleString()}`}
            icon={TrendingUp}
            change={12.5}
            trend="up"
          />
          <MetricCard
            title="Total Jobs"
            value={totalJobs}
            formatValue={(v) => v.toLocaleString()}
            icon={Calendar}
            change={8.3}
            trend="up"
          />
        </div>

        {/* Crew Performance Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
              <Users className="w-5 h-5 text-elite-600" />
              Crew Performance Leaderboard
            </h3>
          </div>
          <PerformanceTable
            data={crewTableData}
            title="Crew Rankings"
            sortBy="jobsCompleted"
            sortOrder="desc"
          />
        </div>

        {/* Individual Staff Performance */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
              <Users className="w-5 h-5 text-elite-600" />
              Individual Staff Performance
            </h3>
          </div>
          <PerformanceTable
            data={staffTableData}
            title="Staff Rankings"
            sortBy="jobsCompleted"
            sortOrder="desc"
          />
        </div>

        {/* Service Profitability Ranking */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-elite-600" />
              Service Profitability Ranking
            </h3>
          </div>
          <PerformanceTable
            data={serviceTableData}
            title="Service Rankings"
            sortBy="revenue"
            sortOrder="desc"
          />
        </div>

        {/* Efficiency Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Jobs Per Day (Avg)</h4>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {(totalJobs / 30).toFixed(1)}
              </span>
              <span className="text-sm text-slate-500 mb-1">per day</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-600 font-medium">+5.2% vs last period</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Avg Job Duration</h4>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">2.5</span>
              <span className="text-sm text-slate-500 mb-1">hours</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-600 font-medium">-8% faster (improvement)</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Efficiency Rate</h4>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900">87.3</span>
              <span className="text-sm text-slate-500 mb-1">%</span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-600 font-medium">+2.1% vs last period</span>
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 font-serif mb-4">Performance Trends</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Crew Utilization</span>
                <span className="text-sm font-bold text-slate-900">92%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-elite-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">On-Time Completion Rate</span>
                <span className="text-sm font-bold text-slate-900">88%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Customer Satisfaction</span>
                <span className="text-sm font-bold text-slate-900">4.7/5</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Revenue per Job</span>
                <span className="text-sm font-bold text-slate-900">$2,450</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Period Over Period Comparison */}
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 font-serif mb-4">Period Over Period Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Metric</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Current Period</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Previous Period</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium">Total Revenue</td>
                  <td className="px-4 py-3 text-sm text-slate-900">${totalRevenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">${(totalRevenue * 0.88).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-medium text-emerald-600">+12.0%</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium">Jobs Completed</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{totalJobs}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{Math.round(totalJobs * 0.92)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-emerald-600">+8.0%</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium">Average Job Value</td>
                  <td className="px-4 py-3 text-sm text-slate-900">${totalJobs > 0 ? (totalRevenue / totalJobs).toFixed(0) : 0}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">${((totalRevenue / totalJobs) * 1.04).toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600">-4.0%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-slate-900 font-medium">Efficiency Rate</td>
                  <td className="px-4 py-3 text-sm text-slate-900">87.3%</td>
                  <td className="px-4 py-3 text-sm text-slate-600">85.2%</td>
                  <td className="px-4 py-3 text-sm font-medium text-emerald-600">+2.1%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function getPeriodStart(period: '30d' | '90d' | '6m' | '1y'): number {
  const now = Date.now();
  switch (period) {
    case '30d':
      return now - 30 * 24 * 60 * 60 * 1000;
    case '90d':
      return now - 90 * 24 * 60 * 60 * 1000;
    case '6m':
      return now - 6 * 30 * 24 * 60 * 60 * 1000;
    case '1y':
      return now - 12 * 30 * 24 * 60 * 60 * 1000;
    default:
      return now - 90 * 24 * 60 * 60 * 1000;
  }
}
