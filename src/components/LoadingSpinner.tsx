// src/components/LoadingSpinner.tsx
import React from 'react';
import cn from 'classnames';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'slate';
  fullScreen?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-[5px]',
};

const colorStyles = {
  primary: 'border-elite-200 border-t-elite-900',
  white: 'border-white/30 border-t-white',
  slate: 'border-slate-200 border-t-slate-600',
};

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  className,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Inline spinner for buttons
interface ButtonSpinnerProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function ButtonSpinner({ size = 'sm', className }: ButtonSpinnerProps) {
  const sizeMap = {
    sm: 'w-3 h-3 border-2',
    md: 'w-4 h-4 border-2',
  };

  return (
    <div
      className={cn(
        'rounded-full animate-spin border-white/30 border-t-white',
        sizeMap[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
