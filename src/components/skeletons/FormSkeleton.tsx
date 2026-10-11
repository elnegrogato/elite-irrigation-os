// src/components/skeletons/FormSkeleton.tsx
import React from 'react';

interface FormSkeletonProps {
  fields?: number;
  className?: string;
}

export default function FormSkeleton({ fields = 5, className = '' }: FormSkeletonProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          {/* Label */}
          <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />

          {/* Input */}
          <div className="h-10 bg-slate-100 rounded animate-pulse" />
        </div>
      ))}

      {/* Button */}
      <div className="pt-4">
        <div className="h-10 bg-slate-200 rounded w-1/4 animate-pulse" />
      </div>
    </div>
  );
}
