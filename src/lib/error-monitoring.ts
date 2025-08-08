import * as Sentry from '@sentry/nextjs'
import { env } from './environment'

export interface ErrorContext {
  userId?: string
  userAgent?: string
  url?: string
  timestamp?: number
  feature?: string
  action?: string
  metadata?: Record<string, unknown>
}

export interface ErrorReport {
  error: Error
  context: ErrorContext
  level: 'error' | 'warning' | 'info' | 'debug'
}

class ErrorMonitoringService {
  private isInitialized = false

  constructor() {
    this.initialize()
  }

  private initialize() {
    if (this.isInitialized) {
      return
    }

    try {
      // Additional Sentry configuration for better error tracking
      Sentry.setTag('app.environment', env.app.env)
      
      this.isInitialized = true
      console.log('Error monitoring initialized')
    } catch (error) {
      console.error('Failed to initialize error monitoring:', error)
    }
  }

  /**
   * Report an error with context
   */
  reportError(errorReport: ErrorReport) {
    const { error, context, level } = errorReport

    try {
      // Add context to Sentry scope
      Sentry.withScope((scope) => {
        scope.setLevel(level)
        
        if (context.userId) {
          scope.setUser({ id: context.userId })
        }
        
        if (context.feature) {
          scope.setTag('feature', context.feature)
        }
        
        if (context.action) {
          scope.setTag('action', context.action)
        }
        
        if (context.url) {
          scope.setExtra('url', context.url)
        }
        
        if (context.userAgent) {
          scope.setExtra('userAgent', context.userAgent)
        }
        
        if (context.metadata) {
          Object.entries(context.metadata).forEach(([key, value]) => {
            scope.setExtra(key, value)
          })
        }
        
        Sentry.captureException(error)
      })

      // Also log to console in development
      if (env.isDevelopment()) {
        console.error('Error reported:', {
          error: error.message,
          stack: error.stack,
          context
        })
      }
    } catch (monitoringError) {
      console.error('Failed to report error to monitoring service:', monitoringError)
      // Still log the original error to console
      console.error('Original error:', error)
    }
  }

  /**
   * Report a message/event
   */
  reportMessage(message: string, level: 'error' | 'warning' | 'info' | 'debug' = 'info', context?: ErrorContext) {
    try {
      Sentry.withScope((scope) => {
        scope.setLevel(level)
        
        if (context) {
          if (context.userId) {
            scope.setUser({ id: context.userId })
          }
          
          if (context.feature) {
            scope.setTag('feature', context.feature)
          }
          
          if (context.action) {
            scope.setTag('action', context.action)
          }
          
          if (context.metadata) {
            Object.entries(context.metadata).forEach(([key, value]) => {
              scope.setExtra(key, value)
            })
          }
        }
        
        Sentry.captureMessage(message)
      })

      if (env.isDevelopment()) {
        console.log(`[${level.toUpperCase()}] ${message}`, context)
      }
    } catch (error) {
      console.error('Failed to report message:', error)
    }
  }

  /**
   * Set user context for error tracking
   */
  setUser(user: { id: string; email?: string; username?: string }) {
    try {
      Sentry.setUser(user)
    } catch (error) {
      console.error('Failed to set user context:', error)
    }
  }

  /**
   * Clear user context
   */
  clearUser() {
    try {
      Sentry.setUser(null)
    } catch (error) {
      console.error('Failed to clear user context:', error)
    }
  }

  /**
   * Add breadcrumb for user actions
   */
  addBreadcrumb(message: string, category: string, data?: Record<string, unknown>) {
    try {
      Sentry.addBreadcrumb({
        message,
        category,
        data,
        timestamp: Date.now() / 1000
      })
    } catch (error) {
      console.error('Failed to add breadcrumb:', error)
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(name: string, duration: number, context?: Record<string, unknown>) {
    try {
      this.reportMessage(`Performance: ${name} took ${duration}ms`, 'info', {
        feature: 'performance',
        action: name,
        metadata: {
          duration,
          ...context
        }
      })
    } catch (error) {
      console.error('Failed to track performance:', error)
    }
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(feature: string, action: string, userId?: string, metadata?: Record<string, unknown>) {
    try {
      this.addBreadcrumb(`Feature used: ${feature}.${action}`, 'user', {
        feature,
        action,
        userId,
        ...metadata
      })
    } catch (error) {
      console.error('Failed to track feature usage:', error)
    }
  }
}

// Create singleton instance
export const errorMonitoring = new ErrorMonitoringService()

// Convenience functions
export const reportError = (error: Error, context: ErrorContext = {}) => {
  errorMonitoring.reportError({
    error,
    context: {
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      ...context
    },
    level: 'error'
  })
}

export const reportWarning = (error: Error, context: ErrorContext = {}) => {
  errorMonitoring.reportError({
    error,
    context: {
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      ...context
    },
    level: 'warning'
  })
}

export const reportInfo = (message: string, context: ErrorContext = {}) => {
  errorMonitoring.reportMessage(message, 'info', {
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    ...context
  })
}

export const trackFeature = (feature: string, action: string, userId?: string, metadata?: Record<string, unknown>) => {
  errorMonitoring.trackFeatureUsage(feature, action, userId, metadata)
}

export const trackPerformance = (name: string, duration: number, context?: Record<string, unknown>) => {
  errorMonitoring.trackPerformance(name, duration, context)
}

export default errorMonitoring
