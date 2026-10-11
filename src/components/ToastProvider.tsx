// src/components/ToastProvider.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastContainer, ToastProps } from './Toast';

interface ToastContextValue {
  success: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  warning: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastWithMeta extends ToastProps {
  createdAt: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastWithMeta[]>([]);

  const addToast = useCallback(
    (type: ToastProps['type'], title: string, message?: string, duration?: number): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          title,
          message,
          duration: duration ?? (type === 'error' ? 0 : 5000), // Errors don't auto-dismiss by default
          createdAt: Date.now(),
        },
      ]);

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addToast('success', title, message, duration);
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addToast('error', title, message, duration);
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addToast('warning', title, message, duration);
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number) => {
      return addToast('info', title, message, duration);
    },
    [addToast]
  );

  const dismiss = useCallback(
    (id: string) => {
      removeToast(id);
    },
    [removeToast]
  );

  const contextValue: ToastContextValue = {
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

// Hook to integrate with error handler
export function useToastErrorHandler() {
  const toast = useToast();

  React.useEffect(() => {
    // Set up the toast handler for the error handler
    const { setToastHandler } = require('../lib/errorHandler');
    setToastHandler((type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string) => {
      switch (type) {
        case 'success':
          toast.success(title, message);
          break;
        case 'error':
          toast.error(title, message);
          break;
        case 'warning':
          toast.warning(title, message);
          break;
        case 'info':
          toast.info(title, message);
          break;
      }
    });
  }, [toast]);
}
