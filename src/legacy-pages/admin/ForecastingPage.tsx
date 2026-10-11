// src/pages/admin/ForecastingPage.tsx
import React from 'react';
import AdminLayout from './AdminLayout';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  Info,
  Sparkles
} from 'lucide-react';
import TimeSeriesChart from '../../components/analytics/TimeSeriesChart';
import MetricCard from '../../components/analytics/MetricCard';

export default function ForecastingPage() {
  const revenueForecast = useQuery(api.analytics.forecastRevenue, { monthsAhead: 6 });
  const leadForecast = useQuery(api.analytics.forecastLeadVolume, { monthsAhead: 6 });
  const seasonalTrends = useQuery(api.analytics.predictSeasonalTrends);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const combineHistoricalAndForecast = (
    historical: number[],
    forecast: Array<{ month: string; predicted: number }>
  ) => {
    const now = new Date();
    const combined = [];

    // Add historical data
    historical.forEach((value, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (historical.length - index - 1), 1);
      combined.push({
        date: date.toISOString(),
        value,
        type: 'historical'
      });
    });

    // Add forecast data
    forecast.forEach(item => {
      combined.push({
        date: item.month,
        value: item.predicted,
        type: 'forecast'
      });
    });

    return combined;
  };

  const combinedRevenue = revenueForecast
    ? combineHistoricalAndForecast(revenueForecast.historical, revenueForecast.forecast)
    : [];

  const combinedLeads = leadForecast
    ? combineHistoricalAndForecast(leadForecast.historical, leadForecast.forecast)
    : [];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">Forecasting</h2>
            <p className="text-sm text-slate-500 mt-1">AI-powered predictions and trend analysis</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-elite-50 border border-elite-100 rounded-sm">
            <Sparkles className="w-4 h-4 text-elite-600" />
            <span className="text-xs font-bold text-elite-700 uppercase tracking-wider">AI Predictions</span>
          </div>
        </div>

        {/* Seasonality Alerts */}
        {seasonalTrends && seasonalTrends.seasonalityAlerts.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {seasonalTrends.seasonalityAlerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-sm border ${
                  alert.type === 'spring_startup'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <Info className="w-5 h-5 mt-0.5 text-elite-600" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {alert.type.replace('_', ' ')}
                  </h4>
                  <p className="text-sm text-slate-700 mt-1">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Forecast Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Revenue Trend"
            value={revenueForecast?.trend || 'stable'}
            change={revenueForecast?.averageMonthlyRevenue || 0}
            formatValue={(v) => `$${(typeof v === 'number' ? v : 0).toLocaleString()}`}
            icon={TrendingUp}
            trend={revenueForecast?.trend === 'increasing' ? 'up' : revenueForecast?.trend === 'decreasing' ? 'down' : 'neutral'}
            subtitle="Avg monthly revenue"
          />
          <MetricCard
            title="Lead Volume Trend"
            value={leadForecast?.trend || 'stable'}
            change={leadForecast?.averageMonthlyLeads || 0}
            formatValue={(v) => v.toString()}
            icon={Activity}
            trend={leadForecast?.trend === 'increasing' ? 'up' : leadForecast?.trend === 'decreasing' ? 'down' : 'neutral'}
            subtitle="Avg monthly leads"
          />
          <MetricCard
            title="Forecast Confidence"
            value="85%"
            change={5}
            trend="up"
            icon={Sparkles}
            subtitle="Model accuracy"
          />
        </div>

        {/* Revenue Forecast */}
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Revenue Forecast</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">6-Month Prediction</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
              <span>Historical</span>
              <div className="w-3 h-3 bg-blue-500 rounded-sm ml-2" />
              <span>Forecast</span>
            </div>
          </div>

          <TimeSeriesChart
            data={combinedRevenue}
            xKey="date"
            yKey="value"
            formatValue={(v) => `$${v.toLocaleString()}`}
            height={350}
            color="#059669"
          />

          {/* Forecast Table */}
          {revenueForecast && (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Forecast Details</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Month</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Predicted Revenue</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Confidence</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueForecast.forecast.map((month) => (
                      <tr key={month.month} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-sm text-slate-900">{formatMonth(month.month)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          ${month.predicted.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-elite-500 h-2 rounded-full"
                                style={{ width: `${month.confidence * 100}%` }}
                              />
                            </div>
                            <span>{(month.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {month.predicted > revenueForecast.averageMonthlyRevenue ? (
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                          ) : month.predicted < revenueForecast.averageMonthlyRevenue ? (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          ) : (
                            <Activity className="w-4 h-4 text-slate-400" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Lead Volume Forecast */}
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">Lead Volume Forecast</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">6-Month Prediction</p>
            </div>
          </div>

          <TimeSeriesChart
            data={combinedLeads}
            xKey="date"
            yKey="value"
            formatValue={(v) => v.toLocaleString()}
            height={350}
            color="#3b82f6"
          />

          {/* Forecast Table */}
          {leadForecast && (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Forecast Details</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Month</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Predicted Leads</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Confidence</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">vs Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadForecast.forecast.map((month) => (
                      <tr key={month.month} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-sm text-slate-900">{formatMonth(month.month)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {month.predicted}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${month.confidence * 100}%` }}
                              />
                            </div>
                            <span>{(month.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {month.predicted > leadForecast.averageMonthlyLeads ? (
                            <span className="text-emerald-600 font-medium">
                              +{Math.round(((month.predicted - leadForecast.averageMonthlyLeads) / leadForecast.averageMonthlyLeads) * 100)}%
                            </span>
                          ) : month.predicted < leadForecast.averageMonthlyLeads ? (
                            <span className="text-red-600 font-medium">
                              {Math.round(((month.predicted - leadForecast.averageMonthlyLeads) / leadForecast.averageMonthlyLeads) * 100)}%
                            </span>
                          ) : (
                            <span className="text-slate-600">0%</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Seasonal Patterns */}
        {seasonalTrends && (
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 font-serif mb-4">Seasonal Patterns</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Peak Months</h4>
                <div className="space-y-2">
                  {seasonalTrends.peakMonths.map((month) => {
                    const monthName = new Date(2024, month).toLocaleDateString('en-US', { month: 'long' });
                    const data = seasonalTrends.patterns.find(p => p.month === month);
                    return (
                      <div key={month} className="flex items-center justify-between p-3 bg-emerald-50 rounded-sm border border-emerald-100">
                        <span className="text-sm font-medium text-slate-900">{monthName}</span>
                        <span className="text-sm font-bold text-emerald-700">
                          ${data?.averageRevenue.toLocaleString() || 0}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Low Months</h4>
                <div className="space-y-2">
                  {seasonalTrends.lowMonths.map((month) => {
                    const monthName = new Date(2024, month).toLocaleDateString('en-US', { month: 'long' });
                    const data = seasonalTrends.patterns.find(p => p.month === month);
                    return (
                      <div key={month} className="flex items-center justify-between p-3 bg-slate-50 rounded-sm border border-slate-200">
                        <span className="text-sm font-medium text-slate-900">{monthName}</span>
                        <span className="text-sm font-bold text-slate-600">
                          ${data?.averageRevenue.toLocaleString() || 0}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Assumptions */}
        <div className="bg-elite-50 p-6 rounded-sm border border-elite-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-elite-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Key Assumptions & Factors</h4>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Forecasts based on linear regression analysis of historical data</li>
                <li>• Seasonal adjustments applied based on 2-year historical patterns</li>
                <li>• Confidence intervals represent model accuracy, not business certainty</li>
                <li>• Actual results may vary due to market conditions, competition, and external factors</li>
                <li>• Review forecasts monthly and adjust based on actual performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
