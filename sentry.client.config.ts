// Sentry configuration for Next.js application
import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    debug: process.env.NODE_ENV === 'development',
    
    // Environment and release tracking
    environment: process.env.NODE_ENV || 'development',
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    
    // Tracing and performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session replay for debugging
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Integration configuration
    integrations: [
      // Additional integrations can be added here
    ],
    
    // Error filtering
    beforeSend(event, hint) {
      // Filter out development errors
      if (process.env.NODE_ENV === 'development') {
        console.log('Sentry Event:', event)
        console.log('Sentry Hint:', hint)
      }
      
      // Skip certain errors
      const error = hint.originalException
      if (error instanceof Error) {
        // Skip common browser/network errors
        if (
          error.message?.includes('Network Error') ||
          error.message?.includes('Loading chunk') ||
          error.message?.includes('ChunkLoadError')
        ) {
          return null
        }
      }
      
      return event
    },
    
    // Breadcrumb filtering
    beforeBreadcrumb(breadcrumb) {
      // Skip console.log breadcrumbs in production
      if (breadcrumb.category === 'console' && process.env.NODE_ENV === 'production') {
        return null
      }
      return breadcrumb
    },
    
    // Tags for better organization
    initialScope: {
      tags: {
        component: 'code-utils-hub',
        feature: 'error-monitoring'
      }
    }
  })
}

// Export Sentry for manual error reporting
export * from '@sentry/nextjs'
