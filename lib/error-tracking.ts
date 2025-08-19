// lib/error-tracking.ts - Error tracking and logging
interface ErrorContext {
  slug: string;
  source: 'shopify' | 'storyblok';
  userAgent?: string;
  url?: string;
  timestamp: string;
  environment: string;
}

interface PageError {
  error: any;
  context: ErrorContext;
}

// Log page errors with context
export const logPageError = (
  source: 'shopify' | 'storyblok', 
  slug: string, 
  error: any
) => {
  const context: ErrorContext = {
    slug,
    source,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  const errorData: PageError = {
    error: {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      name: error?.name
    },
    context
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(`${source.toUpperCase()} page error for slug "${slug}":`, errorData);
  }

  // Send to error tracking service in production
  if (process.env.NODE_ENV === 'production') {
    sendToErrorService(errorData);
  }

  // Track in analytics if consent given
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: `${source}_page_error_${slug}`,
      fatal: false
    });
  }
};

// Send error to external service (Sentry, LogRocket, etc.)
const sendToErrorService = async (errorData: PageError) => {
  try {
    // Example: Send to your error tracking endpoint
    if (process.env.NEXT_PUBLIC_ERROR_TRACKING_ENDPOINT) {
      await fetch(process.env.NEXT_PUBLIC_ERROR_TRACKING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
      });
    }

    // Example: Send to Sentry (if using Sentry)
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(errorData.error, {
    //     tags: {
    //       source: errorData.context.source,
    //       slug: errorData.context.slug
    //     },
    //     extra: errorData.context
    //   });
    // }
  } catch (sendError) {
    console.error('Failed to send error to tracking service:', sendError);
  }
};

// Log API errors
export const logApiError = (
  api: 'shopify' | 'storyblok',
  endpoint: string,
  error: any
) => {
  const errorData = {
    api,
    endpoint,
    error: {
      message: error?.message || 'Unknown API error',
      status: error?.status,
      statusText: error?.statusText
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  if (process.env.NODE_ENV === 'development') {
    console.error(`${api.toUpperCase()} API error:`, errorData);
  }

  if (process.env.NODE_ENV === 'production') {
    sendToErrorService({ error: errorData, context: {} as ErrorContext });
  }
};

// Log performance issues
export const logPerformanceIssue = (
  type: 'slow_page_load' | 'large_bundle' | 'slow_api',
  details: any
) => {
  const performanceData = {
    type,
    details,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
  };

  if (process.env.NODE_ENV === 'production') {
    sendToErrorService({ error: performanceData, context: {} as ErrorContext });
  }

  // Track in analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance_issue', {
      issue_type: type,
      page_location: window.location.href
    });
  }
};

// Client-side error boundary helper
export const handleClientError = (error: Error, errorInfo: any) => {
  const errorData = {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    errorInfo,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: window.navigator.userAgent
  };

  console.error('Client-side error:', errorData);

  if (process.env.NODE_ENV === 'production') {
    sendToErrorService({ error: errorData, context: {} as ErrorContext });
  }
};