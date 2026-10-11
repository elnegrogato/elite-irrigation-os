// src/components/analytics/CohortChart.tsx
import React, { useMemo, useCallback, memo } from 'react';

interface CohortChartProps {
  data: Array<{
    cohortMonth: string;
    customerCount: number;
    retentionByMonth: Array<{ month: number; rate: number }>;
  }>;
  title?: string;
}

function CohortChart({ data, title }: CohortChartProps) {
  const getColor = useCallback((rate: number) => {
    if (rate >= 80) return 'bg-emerald-500';
    if (rate >= 60) return 'bg-emerald-400';
    if (rate >= 40) return 'bg-yellow-400';
    if (rate >= 20) return 'bg-orange-400';
    return 'bg-red-400';
  }, []);

  const getOpacity = useCallback((rate: number) => {
    return Math.max(0.2, rate / 100);
  }, []);

  const formatMonth = useCallback((monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }, []);

  // Memoize summary stats calculations
  const summaryStats = useMemo(() => {
    if (data.length === 0) return null;

    const avgMonth1 = data.reduce((sum, cohort) => sum + (cohort.retentionByMonth[1]?.rate || 0), 0) / data.length;
    const avgMonth6 = data.reduce((sum, cohort) => sum + (cohort.retentionByMonth[6]?.rate || 0), 0) / data.length;
    const avgMonth12 = data.reduce((sum, cohort) => sum + (cohort.retentionByMonth[12]?.rate || 0), 0) / data.length;

    return { avgMonth1, avgMonth6, avgMonth12 };
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
      {title && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900 font-serif">{title}</h3>
          <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
            Customer retention by cohort
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Cohort
              </th>
              <th className="px-4 py-2 text-center text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                Customers
              </th>
              {Array.from({ length: 13 }, (_, i) => (
                <th
                  key={i}
                  className="px-2 py-2 text-center text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200"
                >
                  M{i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((cohort, cohortIndex) => (
              <tr key={cohort.cohortMonth} className={cohortIndex % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                <td className="px-4 py-2 text-sm font-medium text-slate-900 border-b border-slate-100">
                  {formatMonth(cohort.cohortMonth)}
                </td>
                <td className="px-4 py-2 text-sm text-slate-600 text-center border-b border-slate-100">
                  {cohort.customerCount}
                </td>
                {cohort.retentionByMonth.map((retention, monthIndex) => {
                  const rate = retention.rate;
                  const colorClass = getColor(rate);
                  const opacity = getOpacity(rate);

                  return (
                    <td
                      key={monthIndex}
                      className="px-2 py-2 text-center border-b border-slate-100"
                    >
                      <div
                        className={`w-full h-8 ${colorClass} rounded-sm flex items-center justify-center text-[10px] font-bold text-white`}
                        style={{ opacity }}
                        title={`${rate.toFixed(1)}% retention`}
                      >
                        {rate.toFixed(0)}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <span className="text-xs text-slate-600 uppercase tracking-wider">Retention Rate:</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-emerald-500 rounded-sm" />
            <span className="text-xs text-slate-600">80%+</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-emerald-400 rounded-sm" />
            <span className="text-xs text-slate-600">60-79%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
            <span className="text-xs text-slate-600">40-59%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-400 rounded-sm" />
            <span className="text-xs text-slate-600">20-39%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-400 rounded-sm" />
            <span className="text-xs text-slate-600">&lt;20%</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {summaryStats && (
        <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-sm">
          <div className="text-center">
            <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Avg. Month 1 Retention</p>
            <p className="text-lg font-bold text-slate-900">
              {summaryStats.avgMonth1.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Avg. Month 6 Retention</p>
            <p className="text-lg font-bold text-slate-900">
              {summaryStats.avgMonth6.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Avg. Month 12 Retention</p>
            <p className="text-lg font-bold text-slate-900">
              {summaryStats.avgMonth12.toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Memoize the component
export default memo(CohortChart, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data && prevProps.title === nextProps.title;
});
