// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showError?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // TODO: Send to error reporting service (Sentry, etc.)
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use default error UI if showError is true or not specified
      if (this.props.showError !== false) {
        return (
          <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-lg sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white">
                  <AlertCircle className="w-6 h-6 text-forest-600" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-stone-900">Something went wrong</h1>
                  <p className="text-sm text-stone-500">An unexpected error occurred</p>
                </div>
              </div>

              <div className="mb-6 rounded-lg bg-stone-50 p-4">
                <p className="break-words font-mono text-sm text-stone-700">
                  {this.state.error?.toString() || 'Unknown error'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-forest-700 px-4 py-2 font-medium text-white transition-colors hover:bg-forest-800"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 font-medium text-stone-700 transition-colors hover:bg-stone-50"
                >
                  Reload Page
                </button>
              </div>

              <div className="mt-6 border-t border-stone-200 pt-6">
                <p className="mb-2 text-sm text-stone-600">Still having trouble?</p>
                <a
                  href="mailto:support@eliteirrigation.com"
                  className="text-sm font-medium text-forest-700 hover:text-forest-800"
                >
                  Contact Support →
                </a>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-stone-700 hover:text-stone-900">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-stone-900 p-4 text-xs text-stone-100">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        );
      }

      // Return null if showError is false
      return null;
    }

    return this.props.children;
  }
}
