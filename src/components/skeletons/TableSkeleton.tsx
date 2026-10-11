// src/components/skeletons/TableSkeleton.tsx
import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export default function TableSkeleton({ rows = 5, columns = 4, className = '' }: TableSkeletonProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div
                key={`header-${i}`}
                className="h-4 bg-slate-200 rounded animate-pulse"
                style={{ width: i === 0 ? '30%' : '15%' }}
              />
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="px-4 py-3">
              <div className="flex gap-4">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="h-4 bg-slate-100 rounded animate-pulse"
                    style={{
                      width: colIndex === 0 ? '30%' : '15%',
                      animationDelay: `${(rowIndex * columns + colIndex) * 100}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
