// src/components/skeletons/CardSkeleton.tsx
import React from 'react';

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export default function CardSkeleton({ count = 3, className = '' }: CardSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
        >
          {/* Title */}
          <div className="h-6 bg-slate-200 rounded w-3/4 mb-4 animate-pulse" />

          {/* Content lines */}
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-4/6 animate-pulse" />
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
