// src/components/ErrorMessage.tsx
import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';
import cn from 'classnames';

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning';
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  showIcon?: boolean;
  dismissible?: boolean;
}

export default function ErrorMessage({
  title,
  message,
  type = 'error',
  onRetry,
  onDismiss,
  className,
  showIcon = true,
  dismissible = true,
}: ErrorMessageProps) {
  const baseStyles = 'rounded-lg border p-4';
  const typeStyles = {
    error: 'bg-white border-forest-200 text-forest-800',
    warning: 'bg-white border-forest-200 text-forest-800',
  };

  return (
    <div className={cn(baseStyles, typeStyles[type], className)}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        )}

        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-sm mb-1">{title}</p>
          )}
          <p className="text-sm opacity-90 break-words">{message}</p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <RefreshCw className="w-3 h-3" />
              Try Again
            </button>
          )}
        </div>

        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Simplified inline error message
interface InlineErrorProps {
  message: string;
  className?: string;
}

export function InlineError({ message, className }: InlineErrorProps) {
  return (
    <p className={cn('text-sm text-forest-600 flex items-center gap-1', className)}>
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </p>
  );
}

// Form field error
interface FieldErrorProps {
  message: string;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  return (
    <p className={cn('text-xs text-forest-600 mt-1', className)}>
      {message}
    </p>
  );
}
