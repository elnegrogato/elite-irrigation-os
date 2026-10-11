// src/components/analytics/PerformanceTable.tsx
import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Minus, Trophy, Medal, Award } from 'lucide-react';

interface PerformanceTableProps {
  data: Array<{
    id: string;
    name: string;
    jobsCompleted: number;
    revenue: number;
    efficiency: number;
    trend: 'up' | 'down' | 'neutral';
  }>;
  title?: string;
  sortBy?: keyof Pick<PerformanceData, 'jobsCompleted' | 'revenue' | 'efficiency'>;
  sortOrder?: 'asc' | 'desc';
}

type PerformanceData = PerformanceTableProps['data'][0];

type SortableField = 'name' | 'jobsCompleted' | 'revenue' | 'efficiency';

export default function PerformanceTable({
  data,
  title,
  sortBy = 'jobsCompleted',
  sortOrder = 'desc'
}: PerformanceTableProps) {
  const [sortField, setSortField] = useState<SortableField>(sortBy);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(sortOrder);

  const handleSort = (field: SortableField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }

    return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-slate-400" />;
      case 3:
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-3 h-3 text-emerald-600" />;
      case 'down':
        return <ArrowDown className="w-3 h-3 text-red-600" />;
      default:
        return <Minus className="w-3 h-3 text-slate-400" />;
    }
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 font-serif">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Rank</span>
              </th>
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-slate-100" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Name</span>
                  {sortField === 'name' && (
                    <span className="text-xs text-slate-400">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-slate-100" onClick={() => handleSort('jobsCompleted')}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Jobs Completed</span>
                  {sortField === 'jobsCompleted' && (
                    <span className="text-xs text-slate-400">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-slate-100" onClick={() => handleSort('revenue')}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue</span>
                  {sortField === 'revenue' && (
                    <span className="text-xs text-slate-400">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-slate-100" onClick={() => handleSort('efficiency')}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Efficiency</span>
                  {sortField === 'efficiency' && (
                    <span className="text-xs text-slate-400">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Trend</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedData.map((item, index) => (
              <tr
                key={item.id}
                className={`hover:bg-slate-50 transition-colors ${
                  index < 3 ? 'bg-gradient-to-r from-transparent to-transparent' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(index + 1)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-slate-900">{item.name}</div>
                    {index < 3 && (
                      <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-elite-50 text-elite-700 rounded-full border border-elite-100">
                        Top {index + 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-900">{item.jobsCompleted}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-900">{formatCurrency(item.revenue)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.efficiency >= 90 ? 'bg-emerald-500' :
                          item.efficiency >= 75 ? 'bg-blue-500' :
                          item.efficiency >= 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${item.efficiency}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-900">{item.efficiency.toFixed(0)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getTrendIcon(item.trend)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="px-6 py-12 text-center text-slate-500">
          <p className="text-sm">No performance data available</p>
        </div>
      )}
    </div>
  );
}
