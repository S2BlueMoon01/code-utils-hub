/**
 * Performance monitoring and analytics utilities
 */

export interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  metadata?: Record<string, string | number | boolean>
}

export interface UserAction {
  action: string
  component: string
  timestamp: number
  metadata?: Record<string, string | number | boolean>
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private userActions: UserAction[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
    this.trackCoreWebVitals()
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers() {
    if (typeof window === 'undefined') return

    // Track navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('navigation', entry.duration, {
            entryType: entry.entryType,
            name: entry.name
          })
        })
      })
      
      navObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navObserver)

      // Track largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const lcpEntry = entry as PerformanceEntry & {
            size?: number
            element?: { tagName: string }
          }
          this.recordMetric('largest-contentful-paint', entry.startTime, {
            size: lcpEntry.size || 0,
            element: lcpEntry.element?.tagName || 'unknown'
          })
        })
      })
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)

      // Track cumulative layout shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsScore = 0
        list.getEntries().forEach((entry) => {
          const clsEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean
            value?: number
          }
          if (!clsEntry.hadRecentInput) {
            clsScore += clsEntry.value || 0
          }
        })
        this.recordMetric('cumulative-layout-shift', clsScore)
      })
      
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)
    }
  }

  /**
   * Track Core Web Vitals
   */
  private trackCoreWebVitals() {
    if (typeof window === 'undefined') return

    // First Input Delay (FID)
    if ('addEventListener' in window) {
      const handleFirstInput = (event: Event) => {
        const entry = event as Event & {
          processingStart?: number
          startTime?: number
          name?: string
        }
        if (entry.processingStart && entry.startTime) {
          this.recordMetric('first-input-delay', entry.processingStart - entry.startTime, {
            eventType: entry.name || 'unknown'
          })
        }
        window.removeEventListener('keydown', handleFirstInput)
        window.removeEventListener('click', handleFirstInput)
      }

      window.addEventListener('keydown', handleFirstInput, { once: true })
      window.addEventListener('click', handleFirstInput, { once: true })
    }

    // Page Load Time
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigationTiming) {
          this.recordMetric('page-load-time', navigationTiming.loadEventEnd - navigationTiming.fetchStart)
          this.recordMetric('dom-content-loaded', navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart)
          this.recordMetric('time-to-interactive', navigationTiming.domInteractive - navigationTiming.fetchStart)
        }
      }, 0)
    })
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, metadata?: Record<string, string | number | boolean>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    }
    
    this.metrics.push(metric)
    this.trimMetrics()
    
    // Log critical metrics
    if (this.isCriticalMetric(name, value)) {
      console.warn(`Performance Alert: ${name} = ${value}ms`, metadata)
    }
  }

  /**
   * Track user actions
   */
  trackUserAction(action: string, component: string, metadata?: Record<string, string | number | boolean>) {
    const userAction: UserAction = {
      action,
      component,
      timestamp: Date.now(),
      metadata
    }
    
    this.userActions.push(userAction)
    this.trimUserActions()
  }

  /**
   * Mark custom timing
   */
  mark(name: string) {
    if (typeof window !== 'undefined' && performance.mark) {
      performance.mark(name)
    }
  }

  /**
   * Measure time between marks
   */
  measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark)
        const measure = performance.getEntriesByName(name, 'measure')[0]
        if (measure) {
          this.recordMetric(name, measure.duration)
        }
      } catch (error) {
        console.warn('Failed to measure performance:', error)
      }
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const metrics = this.getMetrics()
    const summary = {
      coreWebVitals: {
        lcp: this.getLatestMetric('largest-contentful-paint'),
        fid: this.getLatestMetric('first-input-delay'),
        cls: this.getLatestMetric('cumulative-layout-shift')
      },
      pageMetrics: {
        loadTime: this.getLatestMetric('page-load-time'),
        domContentLoaded: this.getLatestMetric('dom-content-loaded'),
        timeToInteractive: this.getLatestMetric('time-to-interactive')
      },
      userEngagement: {
        totalActions: this.userActions.length,
        sessionDuration: this.getSessionDuration(),
        mostUsedComponents: this.getMostUsedComponents()
      },
      performance: {
        averageResponseTime: this.getAverageResponseTime(),
        slowestOperations: this.getSlowestOperations(),
        totalMetrics: metrics.length
      }
    }
    
    return summary
  }

  /**
   * Check if metric is critical
   */
  private isCriticalMetric(name: string, value: number): boolean {
    const thresholds = {
      'largest-contentful-paint': 2500,
      'first-input-delay': 100,
      'cumulative-layout-shift': 0.1,
      'page-load-time': 3000,
      'time-to-interactive': 3800
    }
    
    const threshold = thresholds[name as keyof typeof thresholds]
    return threshold !== undefined && value > threshold
  }

  /**
   * Get latest metric by name
   */
  private getLatestMetric(name: string): PerformanceMetric | null {
    const metrics = this.metrics.filter(m => m.name === name)
    return metrics.length > 0 ? metrics[metrics.length - 1] : null
  }

  /**
   * Get session duration
   */
  private getSessionDuration(): number {
    if (this.userActions.length === 0) return 0
    const first = this.userActions[0].timestamp
    const last = this.userActions[this.userActions.length - 1].timestamp
    return last - first
  }

  /**
   * Get most used components
   */
  private getMostUsedComponents(): Array<{ component: string; count: number }> {
    const componentCounts = this.userActions.reduce((acc, action) => {
      acc[action.component] = (acc[action.component] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(componentCounts)
      .map(([component, count]) => ({ component, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  /**
   * Get average response time
   */
  private getAverageResponseTime(): number {
    const responseMetrics = this.metrics.filter(m => m.name.includes('response') || m.name.includes('api'))
    if (responseMetrics.length === 0) return 0
    
    const total = responseMetrics.reduce((sum, metric) => sum + metric.value, 0)
    return total / responseMetrics.length
  }

  /**
   * Get slowest operations
   */
  private getSlowestOperations(): Array<{ name: string; value: number }> {
    return this.metrics
      .filter(m => m.value > 100) // Only operations slower than 100ms
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map(m => ({ name: m.name, value: m.value }))
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * Get all user actions
   */
  getUserActions(): UserAction[] {
    return [...this.userActions]
  }

  /**
   * Trim metrics to prevent memory leaks
   */
  private trimMetrics() {
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500) // Keep last 500 metrics
    }
  }

  /**
   * Trim user actions to prevent memory leaks
   */
  private trimUserActions() {
    if (this.userActions.length > 1000) {
      this.userActions = this.userActions.slice(-500) // Keep last 500 actions
    }
  }

  /**
   * Export performance data
   */
  exportData() {
    return {
      metrics: this.getMetrics(),
      userActions: this.getUserActions(),
      summary: this.getPerformanceSummary(),
      timestamp: Date.now()
    }
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Helper hooks for React components
export function usePerformanceTracking(componentName: string) {
  const trackAction = (action: string, metadata?: Record<string, string | number | boolean>) => {
    performanceMonitor.trackUserAction(action, componentName, metadata)
  }
  
  const startTiming = (name: string) => {
    performanceMonitor.mark(`${componentName}-${name}-start`)
  }
  
  const endTiming = (name: string) => {
    performanceMonitor.mark(`${componentName}-${name}-end`)
    performanceMonitor.measure(
      `${componentName}-${name}`,
      `${componentName}-${name}-start`,
      `${componentName}-${name}-end`
    )
  }
  
  return { trackAction, startTiming, endTiming }
}
