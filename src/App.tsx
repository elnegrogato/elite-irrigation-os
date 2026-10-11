// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './components/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastProvider';
import { handleError } from './lib/errorHandler';
import { isSecureConnection } from './lib/security';

// Global error handler for unhandled errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    handleError(event.error, { context: 'Global window error handler' });
  });

  window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, { context: 'Global unhandled promise rejection' });
  });
}

function AppWithProviders() {
  useEffect(() => {
    // Enforce HTTPS in production
    if (import.meta.env.PROD && !isSecureConnection() && typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      const secureUrl = currentUrl.replace(/^http:/, 'https:');
      if (currentUrl !== secureUrl) {
        window.location.href = secureUrl;
        return;
      }
    }

    // Warn if not using HTTPS in production
    if (
      import.meta.env.PROD &&
      !isSecureConnection() &&
      typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1'
    ) {
      console.warn(
        'WARNING: Your application is not running on HTTPS. ' +
        'This is a security risk. Please configure your server to use HTTPS.'
      );
    }

    // Set up global error handlers
    const handleErrorGlobal = (event: ErrorEvent) => {
      handleError(event.error, { context: 'Global window error handler' });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleError(event.reason, { context: 'Global unhandled promise rejection' });
    };

    window.addEventListener('error', handleErrorGlobal);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleErrorGlobal);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <AppRoutes />;
}

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        handleError(error, { context: 'React Error Boundary', componentStack: errorInfo.componentStack });
      }}
    >
      <HelmetProvider>
        <BrowserRouter>
          <ToastProvider>
            <AuthProvider>
              <AppWithProviders />
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}