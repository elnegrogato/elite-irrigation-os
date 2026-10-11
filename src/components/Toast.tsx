// src/components/Toast.tsx
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: (id: string) => void;
}

const ToastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const ToastStyles = {
  success: 'bg-white border-forest-200 text-forest-800',
  error: 'bg-white border-forest-200 text-forest-800',
  warning: 'bg-white border-forest-200 text-forest-800',
  info: 'bg-white border-forest-200 text-forest-800',
};

const IconStyles = {
  success: 'text-forest-600',
  error: 'text-forest-600',
  warning: 'text-forest-600',
  info: 'text-forest-600',
};

export default function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isLeaving, setIsLeaving] = useState(false);
  const Icon = ToastIcons[type];

  useEffect(() => {
    if (duration === 0) return;

    const startTime = Date.now();
    const interval = 100;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);

      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleClose();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300); // Match animation duration
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border shadow-lg
        ${ToastStyles[type]}
        ${isLeaving ? 'toast-exit' : 'toast-enter'}
        min-w-[320px] max-w-md
      `}
      style={{
        animation: isLeaving
          ? 'toastExit 0.3s ease-out forwards'
          : 'toastEnter 0.3s ease-out',
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${IconStyles[type]}`} />

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{title}</p>
            {message && (
              <p className="text-sm mt-1 opacity-90 break-words">{message}</p>
            )}
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20">
          <div
            className="h-full transition-all ease-linear"
            style={{
              width: `${progress}%`,
              transitionDuration: `${interval}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes toastEnter {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes toastExit {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  .toast-enter {
    animation: toastEnter 0.3s ease-out;
  }

  .toast-exit {
    animation: toastExit 0.3s ease-out forwards;
  }
`;
if (typeof document !== 'undefined') {
  document.head.appendChild(style);
}
