// src/components/analytics/TimeSeriesChart.tsx
import React, { useState, useMemo, useCallback, memo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Brush
} from 'recharts';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';

interface TimeSeriesChartProps {
  data: Array<{ date: string; value: number; [key: string]: any }>;
  xKey: string;
  yKey: string;
  color?: string;
  title?: string;
  subtitle?: string;
  showTrendLine?: boolean;
  showAverage?: boolean;
  formatValue?: (value: number) => string;
  height?: number;
  allowZoom?: boolean;
}

function TimeSeriesChart({
  data,
  xKey,
  yKey,
  color = '#059669',
  title,
  subtitle,
  showTrendLine = false,
  showAverage = false,
  formatValue = (value) => value.toLocaleString(),
  height = 300,
  allowZoom = true
}: TimeSeriesChartProps) {
  const [zoom, setZoom] = useState({ start: 0, end: 100 });

  // Memoize expensive calculations
  const averageValue = useMemo(() => {
    if (data.length === 0) return 0;
    return data.reduce((sum, d) => sum + d[yKey as keyof typeof d], 0) / data.length;
  }, [data, yKey]);

  // Limit data points for performance
  const limitedData = useMemo(() => {
    if (data.length <= 100) return data;
    // Sample data if too many points
    const step = Math.ceil(data.length / 100);
    return data.filter((_, i) => i % step === 0);
  }, [data]);

  const handleExport = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${title || 'chart'}-${Date.now()}.png`;
      link.href = url;
      link.click();
    }
  }, [title]);

  const formatXAxisLabel = useCallback((label: string) => {
    const date = new Date(label);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  const handleZoomChange = useCallback((e: any) => {
    setZoom({ start: e.startIndex || 0, end: e.endIndex || 100 });
  }, []);

  return (
    <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
      {(title || subtitle) && (
        <div className="flex justify-between items-start mb-6">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-900 font-serif">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{subtitle}</p>}
          </div>
          {allowZoom && (
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="p-2 text-slate-400 hover:text-elite-600 hover:bg-elite-50 rounded-sm transition-colors"
                title="Export as PNG"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={limitedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey={xKey}
            tickFormatter={formatXAxisLabel}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
            tickFormatter={formatValue}
          />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: 'none',
              borderRadius: '4px',
              color: '#fff'
            }}
            itemStyle={{ color: '#fff', fontSize: '12px' }}
            labelFormatter={(label) => formatXAxisLabel(label)}
            formatter={(value: number) => [formatValue(value), yKey]}
          />
          {allowZoom && (
            <Brush
              dataKey={xKey}
              height={30}
              stroke={color}
              onChange={handleZoomChange}
            />
          )}
          {showAverage && (
            <ReferenceLine
              y={averageValue}
              label="Avg"
              stroke="#94a3b8"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />
          )}
          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, stroke: color, strokeWidth: 2 }}
            isAnimationActive={data.length <= 50}
            animationDuration={300}
          />
          {showTrendLine && (
            <Line
              type="linear"
              dataKey={yKey}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(TimeSeriesChart, (prevProps, nextProps) => {
  return (
    prevProps.data === nextProps.data &&
    prevProps.xKey === nextProps.xKey &&
    prevProps.yKey === nextProps.yKey &&
    prevProps.color === nextProps.color &&
    prevProps.title === nextProps.title
  );
});
