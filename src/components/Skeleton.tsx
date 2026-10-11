// src/components/Skeleton.tsx
import React from 'react';
import { memo } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = memo(({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) => {
  const baseClasses = 'bg-slate-200';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-sm',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : '40px'),
    height: height || (variant === 'text' ? '1rem' : '40px'),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
});

Skeleton.displayName = 'Skeleton';

/**
 * Text skeleton for paragraphs
 */
export const SkeletonText = memo(({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '70%' : '100%'}
      />
    ))}
  </div>
));

SkeletonText.displayName = 'SkeletonText';

/**
 * Card skeleton
 */
export const SkeletonCard = memo(({ className = '' }: { className?: string }) => (
  <div className={`bg-white p-6 rounded-sm border border-slate-200 ${className}`}>
    <div className="flex items-start justify-between mb-4">
      <Skeleton variant="circular" width={48} height={48} />
      <Skeleton variant="text" width={80} />
    </div>
    <Skeleton variant="text" width="60%" className="mb-2" />
    <Skeleton variant="rectangular" width="100%" height={120} className="mt-4" />
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

/**
 * Table skeleton
 */
export const SkeletonTable = memo(({ rows = 5, columns = 4, className = '' }: { rows?: number; columns?: number; className?: string }) => (
  <div className={`bg-white rounded-sm border border-slate-200 overflow-hidden ${className}`}>
    {/* Header */}
    <div className="flex border-b border-slate-200 bg-slate-50 p-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" width={120} className="mr-4" />
      ))}
    </div>

    {/* Rows */}
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex p-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} variant="text" width={j === 0 ? 150 : 100} className="mr-4" />
          ))}
        </div>
      ))}
    </div>
  </div>
));

SkeletonTable.displayName = 'SkeletonTable';

/**
 * List skeleton
 */
export const SkeletonList = memo(({ items = 5, className = '' }: { items?: number; className?: string }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="bg-white p-4 rounded-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton variant="text" width="60%" className="mb-2" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      </div>
    ))}
  </div>
));

SkeletonList.displayName = 'SkeletonList';

/**
 * Stats card skeleton
 */
export const SkeletonStatsCard = memo(({ className = '' }: { className?: string }) => (
  <div className={`bg-white p-6 rounded-sm border border-slate-200 ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <Skeleton variant="rectangular" width={48} height={48} />
      <Skeleton variant="text" width={80} />
    </div>
    <Skeleton variant="text" width="40%" className="mb-2" />
    <Skeleton variant="text" width="80%" height={32} />
  </div>
));

SkeletonStatsCard.displayName = 'SkeletonStatsCard';

/**
 * Chart skeleton
 */
export const SkeletonChart = memo(({ className = '', height = 300 }: { className?: string; height?: number }) => (
  <div className={`bg-white p-6 rounded-sm border border-slate-200 ${className}`}>
    <div className="flex justify-between items-center mb-6">
      <Skeleton variant="text" width={200} />
      <Skeleton variant="text" width={100} />
    </div>
    <Skeleton variant="rectangular" width="100%" height={height} />
  </div>
));

SkeletonChart.displayName = 'SkeletonChart';

/**
 * Dashboard skeleton
 */
export const SkeletonDashboard = memo(() => (
  <div className="space-y-8">
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonStatsCard key={i} />
      ))}
    </div>

    {/* Chart and alerts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <SkeletonChart />
      </div>
      <div className="bg-white p-8 rounded-sm border border-slate-200">
        <Skeleton variant="text" width={150} className="mb-6" />
        <SkeletonList items={3} />
      </div>
    </div>

    {/* Trend indicators */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-sm border border-slate-200">
          <Skeleton variant="text" width="60%" className="mb-4" />
          <Skeleton variant="text" width={80} className="mb-2" />
          <Skeleton variant="text" width="50%" />
        </div>
      ))}
    </div>
  </div>
));

SkeletonDashboard.displayName = 'SkeletonDashboard';

/**
 * Leads pipeline skeleton
 */
export const SkeletonLeadsPipeline = memo(() => (
  <div className="flex gap-4 overflow-x-auto pb-6">
    {['Lead', 'Contacted', 'Inspected', 'Estimated', 'Booked'].map((stage) => (
      <div key={stage} className="min-w-[280px] w-[280px] flex-shrink-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={30} height={20} />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-24 border border-slate-200 bg-white rounded-sm p-4">
              <Skeleton variant="text" width="80%" className="mb-2" />
              <Skeleton variant="text" width="60%" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
));

SkeletonLeadsPipeline.displayName = 'SkeletonLeadsPipeline';

export default Skeleton;
