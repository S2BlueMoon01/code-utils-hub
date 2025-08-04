import * as Sentry from '@sentry/nextjs'

/**
 * Error handling utilities for CodeUtilsHub
 */

export interface ErrorContext {
  component?: string
  action?: string
  userId?: string
  feature?: string
  metadata?: Record<string, unknown>
}

export class ErrorHandler {
  /**
   * Report an error to Sentry with context
   */
  static reportError(error: Error, context?: ErrorContext): string {
    return Sentry.captureException(error, {
      tags: {
        component: context?.component,
        action: context?.action,
        feature: context?.feature
      },
      user: context?.userId ? { id: context.userId } : undefined,
      extra: context?.metadata
    })
  }

  /**
   * Report a message to Sentry
   */
  static reportMessage(
    message: string, 
    level: 'info' | 'warning' | 'error' = 'info',
    context?: ErrorContext
  ): string {
    return Sentry.captureMessage(message, {
      level,
      tags: {
        component: context?.component,
        action: context?.action,
        feature: context?.feature
      },
      user: context?.userId ? { id: context.userId } : undefined,
      extra: context?.metadata
    })
  }

  /**
   * Add breadcrumb for debugging
   */
  static addBreadcrumb(
    message: string,
    category: string = 'custom',
    level: 'info' | 'warning' | 'error' = 'info',
    data?: Record<string, unknown>
  ): void {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data
    })
  }

  /**
   * Set user context for error reports
   */
  static setUser(user: { id: string; email?: string; username?: string }): void {
    Sentry.setUser(user)
  }

  /**
   * Set additional context
   */
  static setContext(key: string, context: Record<string, unknown>): void {
    Sentry.setContext(key, context)
  }

  /**
   * Clear user context
   */
  static clearUser(): void {
    Sentry.setUser(null)
  }
}

/**
 * Hook for using error handler in React components
 */
export function useErrorHandler() {
  const reportError = (error: Error, context?: ErrorContext) => {
    return ErrorHandler.reportError(error, context)
  }

  const reportMessage = (
    message: string, 
    level: 'info' | 'warning' | 'error' = 'info',
    context?: ErrorContext
  ) => {
    return ErrorHandler.reportMessage(message, level, context)
  }

  const addBreadcrumb = (
    message: string,
    category: string = 'custom',
    level: 'info' | 'warning' | 'error' = 'info',
    data?: Record<string, unknown>
  ) => {
    ErrorHandler.addBreadcrumb(message, category, level, data)
  }

  return {
    reportError,
    reportMessage,
    addBreadcrumb
  }
}

/**
 * Decorator for async functions to catch and report errors
 */
export function withErrorReporting<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      if (error instanceof Error) {
        ErrorHandler.reportError(error, context)
      }
      throw error
    }
  }) as T
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static transactions = new Map<string, unknown>()

  /**
   * Start a performance transaction
   */
  static startTransaction(name: string, operation: string = 'navigation'): string {
    // Use performance.mark for basic performance tracking
    const transactionId = `${name}-${Date.now()}-${Math.random().toString(36).substring(7)}`
    performance.mark(`${transactionId}-start`)
    
    this.transactions.set(transactionId, {
      name,
      operation,
      startTime: performance.now()
    })
    
    return transactionId
  }

  /**
   * Finish a performance transaction
   */
  static finishTransaction(transactionId: string): void {
    const transaction = this.transactions.get(transactionId)
    if (transaction) {
      performance.mark(`${transactionId}-end`)
      try {
        performance.measure(
          transactionId,
          `${transactionId}-start`,
          `${transactionId}-end`
        )
      } catch {
        // Ignore measurement errors
      }
      this.transactions.delete(transactionId)
    }
  }

  /**
   * Add a span to a transaction
   */
  static addSpan(
    transactionId: string,
    operation: string,
    _description: string
  ): string | null {
    const transaction = this.transactions.get(transactionId)
    if (transaction) {
      const spanId = `${transactionId}-${operation}-${Math.random().toString(36).substring(7)}`
      performance.mark(`${spanId}-start`)
      
      // Store span reference
      return spanId
    }
    return null
  }

  /**
   * Measure function execution time
   */
  static async measureAsync<T>(
    operation: string,
    fn: () => Promise<T>,
    transactionId?: string
  ): Promise<T> {
    const startTime = performance.now()
    
    let spanId: string | null = null
    if (transactionId) {
      spanId = this.addSpan(transactionId, operation, `Async operation: ${operation}`)
    }

    try {
      const result = await fn()
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Report performance metric
      Sentry.addBreadcrumb({
        message: `Operation ${operation} completed`,
        category: 'performance',
        level: 'info',
        data: {
          duration: `${duration.toFixed(2)}ms`
        }
      })
      
      return result
    } catch (error) {
      if (error instanceof Error) {
        ErrorHandler.reportError(error, {
          component: 'PerformanceMonitor',
          action: operation
        })
      }
      throw error
    } finally {
      if (spanId) {
        performance.mark(`${spanId}-end`)
        try {
          performance.measure(spanId, `${spanId}-start`, `${spanId}-end`)
        } catch {
          // Ignore measurement errors
        }
      }
    }
  }
}

export default ErrorHandler
