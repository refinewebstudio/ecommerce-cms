// components/error-boundary.tsx - React Error Boundary for graceful error handling
'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>;
}

// Simple error logging function (replace with your preferred service)
const logError = (error: Error, errorInfo: React.ErrorInfo) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Boundary caught an error:', errorData);
  }

  // In production, send to your error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to your API endpoint
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    }).catch(() => {
      // Silently fail if error logging fails
      console.error('Failed to log error to server');
    });

    // Track in analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      // @ts-ignore
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error
    logError(error, errorInfo);
    
    // Update state with error info for debugging
    this.setState({ 
      error, 
      errorInfo 
    });
  }

  handleRetry = () => {
    // Reset the error boundary
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback component is provided, use it
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-neutral-400 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md transition-colors duration-200 font-medium"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 px-6 py-2 rounded-md transition-colors duration-200 font-medium"
                >
                  Refresh Page
                </button>
              </div>

              {/* Contact Support Link */}
              <div className="mt-6">
                <a
                  href="/contact"
                  className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 underline"
                >
                  Contact Support
                </a>
              </div>
            </div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-6 text-left">
                <details className="bg-red-50 dark:bg-red-900 p-4 rounded-md border border-red-200 dark:border-red-700">
                  <summary className="cursor-pointer text-red-800 dark:text-red-200 font-medium mb-2">
                    🐛 Error Details (Development Only)
                  </summary>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-red-800 dark:text-red-200">Error Message:</strong>
                      <pre className="text-xs text-red-700 dark:text-red-300 mt-1 p-2 bg-red-100 dark:bg-red-800 rounded overflow-auto">
                        {this.state.error.message}
                      </pre>
                    </div>
                    <div>
                      <strong className="text-red-800 dark:text-red-200">Stack Trace:</strong>
                      <pre className="text-xs text-red-700 dark:text-red-300 mt-1 p-2 bg-red-100 dark:bg-red-800 rounded overflow-auto max-h-40">
                        {this.state.error.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong className="text-red-800 dark:text-red-200">Component Stack:</strong>
                        <pre className="text-xs text-red-700 dark:text-red-300 mt-1 p-2 bg-red-100 dark:bg-red-800 rounded overflow-auto max-h-40">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for manual error reporting
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: any) => {
    logError(error, errorInfo || { componentStack: 'Manual report' });
  }, []);
}