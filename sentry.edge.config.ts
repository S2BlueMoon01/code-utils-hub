// Sentry Edge Runtime configuration
import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    debug: process.env.NODE_ENV === 'development',
    
    // Environment and release tracking
    environment: process.env.NODE_ENV || 'development',
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    
    // Edge runtime specific configuration
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Tags for better organization
    initialScope: {
      tags: {
        component: 'code-utils-hub-edge',
        feature: 'edge-monitoring'
      }
    }
  })
}

// Export Sentry for manual error reporting
export * from '@sentry/nextjs'
