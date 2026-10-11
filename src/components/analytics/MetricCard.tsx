// src/components/analytics/MetricCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  sparklineData?: Array<{ value: number }>;
  formatValue?: (value: number) => string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  sparklineData,
  formatValue = (v) => v.toLocaleString(),
  subtitle,
  size = 'md'
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const valueSizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`bg-white ${sizeClasses[size]} rounded-sm border border-slate-200 hover:border-elite-200 transition-all shadow-sm hover:shadow-lg group`}>
      <div className="flex justify-between items-start mb-4">
        {Icon && (
          <div className="p-3 bg-slate-50 rounded-sm group-hover:bg-elite-50 transition-colors">
            <Icon className="w-5 h-5 text-slate-400 group-hover:text-elite-600 transition-colors" />
          </div>
        )}
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em] mb-2">
          {title}
        </h3>
        <p className={`font-serif font-bold text-slate-900 ${valueSizeClasses[size]}`}>
          {typeof value === 'number' ? formatValue(value) : value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
        )}
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-4 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [formatValue(value), '']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#059669"
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#spark-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
