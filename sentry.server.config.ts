// Sentry configuration for Next.js server-side
import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    debug: process.env.NODE_ENV === 'development',
    
    // Environment and release tracking
    environment: process.env.NODE_ENV || 'development',
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    
    // Tracing and performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Server-specific configuration
    beforeSend(event, hint) {
      // Filter out development errors
      if (process.env.NODE_ENV === 'development') {
        console.log('Sentry Server Event:', event)
        console.log('Sentry Server Hint:', hint)
      }
      
      // Skip certain server errors
      const error = hint.originalException
      if (error instanceof Error) {
        // Skip common server errors
        if (
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('EPIPE') ||
          error.message?.includes('Socket hang up')
        ) {
          return null
        }
      }
      
      return event
    },
    
    // Tags for better organization
    initialScope: {
      tags: {
        component: 'code-utils-hub-server',
        feature: 'server-monitoring'
      }
    }
  })
}

// Export Sentry for manual error reporting
export * from '@sentry/nextjs'
