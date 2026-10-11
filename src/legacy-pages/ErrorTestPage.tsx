// src/pages/ErrorTestPage.tsx
import React, { useState } from 'react';
import { useToast } from '../components/ToastProvider';
import { handleError, AppError, NetworkError, AuthError, ValidationError, ConflictError } from '../lib/errorHandler';
import { retryWithBackoff } from '../lib/retry';
import { Button } from '../components/ui/button';

export default function ErrorTestPage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const testSuccessToast = () => {
    toast.success('Success!', 'This is a success message that auto-dismisses after 5 seconds.');
  };

  const testErrorToast = () => {
    toast.error('Error Occurred', 'This is an error message that stays until dismissed.');
  };

  const testWarningToast = () => {
    toast.warning('Warning', 'This is a warning message.');
  };

  const testInfoToast = () => {
    toast.info('Information', 'This is an informational message.');
  };

  const testAppError = () => {
    const error = new AppError('Custom application error', 'CUSTOM_ERROR', 500, false);
    handleError(error, { context: 'Test AppError' });
  };

  const testNetworkError = () => {
    const error = new NetworkError('Failed to fetch data from server');
    handleError(error, { context: 'Test NetworkError' });
  };

  const testAuthError = () => {
    const error = new AuthError('User not authenticated');
    handleError(error, { context: 'Test AuthError' });
  };

  const testValidationError = () => {
    const error = new ValidationError('Invalid email format', 'email');
    handleError(error, { context: 'Test ValidationError' });
  };

  const testConflictError = () => {
    const error = new ConflictError('Resource already exists');
    handleError(error, { context: 'Test ConflictError' });
  };

  const testRetryLogic = async () => {
    setIsLoading(true);
    let attempts = 0;

    try {
      await retryWithBackoff(
        async () => {
          attempts++;
          console.log(`Attempt ${attempts}`);
          if (attempts < 3) {
            throw new NetworkError('Simulated network failure');
          }
          return 'Success!';
        },
        {
          maxRetries: 3,
          baseDelay: 1000,
          onRetry: (attempt, error) => {
            console.log(`Retry attempt ${attempt}:`, error);
          },
        }
      );
      toast.success('Retry Success', `Operation succeeded after ${attempts} attempts`);
    } catch (error) {
      handleError(error, { context: 'Test Retry Logic' });
    } finally {
      setIsLoading(false);
    }
  };

  const testMultipleToasts = () => {
    toast.success('First Message', 'This is the first message');
    setTimeout(() => toast.error('Second Message', 'This is the second message'), 500);
    setTimeout(() => toast.warning('Third Message', 'This is the third message'), 1000);
    setTimeout(() => toast.info('Fourth Message', 'This is the fourth message'), 1500);
  };

  const testThrowError = () => {
    throw new Error('This is a test error to demonstrate the Error Boundary');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Error Handling Test Page</h1>
          <p className="text-slate-600 mb-8">Test all error handling components and functionality</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Toast Notifications */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 pb-2 border-b border-slate-200">Toast Notifications</h2>
              <div className="space-y-3">
                <button
                  onClick={testSuccessToast}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Test Success Toast
                </button>
                <button
                  onClick={testErrorToast}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Test Error Toast
                </button>
                <button
                  onClick={testWarningToast}
                  className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  Test Warning Toast
                </button>
                <button
                  onClick={testInfoToast}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Test Info Toast
                </button>
                <button
                  onClick={testMultipleToasts}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Test Multiple Toasts
                </button>
              </div>
            </div>

            {/* Error Types */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 pb-2 border-b border-slate-200">Error Types</h2>
              <div className="space-y-3">
                <button
                  onClick={testAppError}
                  className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium"
                >
                  Test AppError
                </button>
                <button
                  onClick={testNetworkError}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Test NetworkError
                </button>
                <button
                  onClick={testAuthError}
                  className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                >
                  Test AuthError
                </button>
                <button
                  onClick={testValidationError}
                  className="w-full px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
                >
                  Test ValidationError
                </button>
                <button
                  onClick={testConflictError}
                  className="w-full px-4 py-2 bg-slate-400 text-white rounded-lg hover:bg-slate-500 transition-colors font-medium"
                >
                  Test ConflictError
                </button>
              </div>
            </div>

            {/* Retry Logic */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-xl font-semibold text-slate-900 pb-2 border-b border-slate-200">Retry Logic</h2>
              <button
                onClick={testRetryLogic}
                disabled={isLoading}
                className="px-6 py-3 bg-elite-900 text-white rounded-lg hover:bg-elite-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Testing Retry Logic...' : 'Test Retry with Backoff'}
              </button>
              <p className="text-sm text-slate-600">
                This will simulate a failing request that succeeds after 3 attempts, demonstrating the retry logic with exponential backoff.
              </p>
            </div>

            {/* Error Boundary */}
            <div className="space-y-4 md:col-span-2">
              <h2 className="text-xl font-semibold text-slate-900 pb-2 border-b border-slate-200">Error Boundary</h2>
              <button
                onClick={testThrowError}
                className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
              >
                Trigger Error Boundary
              </button>
              <p className="text-sm text-slate-600">
                ⚠️ Warning: This will trigger an error that gets caught by the Error Boundary, displaying the fallback UI.
              </p>
            </div>
          </div>

          {/* Feature List */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Implemented Features</h2>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>ErrorBoundary Component:</strong> Catches React errors and displays fallback UI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>Toast Notifications:</strong> Success, error, warning, and info messages with auto-dismiss</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>LoadingSpinner:</strong> Consistent loading indicators across the app</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>ErrorMessage Component:</strong> Reusable error display with retry functionality</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>Custom Error Classes:</strong> AppError, NetworkError, AuthError, ValidationError, ConflictError</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>Error Handler Utilities:</strong> Centralized error handling with user-friendly messages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>Retry Logic:</strong> Exponential backoff for retryable errors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>ToastProvider:</strong> Global toast context with useToast hook</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>Global Error Handler:</strong> Catches unhandled errors and promise rejections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>alert() Replaced:</strong> All alert() calls replaced with toast notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>Loading Skeletons:</strong> TableSkeleton, CardSkeleton, FormSkeleton components</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span><strong>Convex Error Helpers:</strong> Helper functions for throwing and handling Convex errors</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
