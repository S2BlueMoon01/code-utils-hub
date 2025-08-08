'use client'

import { useEffect, useCallback } from 'react'
import { trackPerformance, reportInfo } from '@/lib/error-monitoring'
import { env } from '@/lib/environment'

class RealUserMonitoring {
  private isInitialized = false
  private observer: PerformanceObserver | null = null
  private sessionId: string
  private pageLoadTime: number

  constructor() {
    this.sessionId = this.generateSessionId()
    this.pageLoadTime = Date.now()
    this.initialize()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initialize() {
    if (this.isInitialized || typeof window === 'undefined') {
      return
    }

    try {
      this.setupPerformanceObserver()
      this.trackPageLoad()
      this.setupVisibilityChangeTracking()
      this.setupUnloadTracking()

      this.isInitialized = true
      
      reportInfo('Real User Monitoring initialized', {
        feature: 'performance'
      })
    } catch (error) {
      console.error('Failed to initialize RUM:', error)
    }
  }

  private setupPerformanceObserver() {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported')
      return
    }

    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        
        entries.forEach((entry) => {
          this.processPerformanceEntry(entry)
        })
      })

      // Observe navigation and resource timing
      const entryTypes = ['navigation', 'resource', 'measure', 'mark']

      entryTypes.forEach(type => {
        try {
          this.observer?.observe({ entryTypes: [type] })
        } catch {
          // Some entry types might not be supported
          if (env.isDevelopment()) {
            console.debug(`Performance entry type '${type}' not supported`)
          }
        }
      })
    } catch (error) {
      console.error('Failed to setup PerformanceObserver:', error)
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry) {
    const commonData = {
      sessionId: this.sessionId,
      feature: 'performance',
      entryType: entry.entryType,
      name: entry.name,
      startTime: entry.startTime,
      duration: entry.duration
    }

    switch (entry.entryType) {
      case 'navigation':
        this.processNavigationEntry(entry)
        break
      case 'resource':
        this.processResourceEntry(entry)
        break
      case 'measure':
      case 'mark':
        trackPerformance(`${entry.entryType}_${entry.name}`, entry.duration, commonData)
        break
      default:
        trackPerformance(`${entry.entryType}_${entry.name}`, entry.duration, commonData)
    }
  }

  private processNavigationEntry(entry: PerformanceEntry) {
    // Use basic navigation timing
    const navEntry = entry as PerformanceNavigationTiming
    
    const metrics = {
      dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
      tcp: navEntry.connectEnd - navEntry.connectStart,
      ttfb: navEntry.responseStart - navEntry.requestStart,
      download: navEntry.responseEnd - navEntry.responseStart,
      domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
      windowLoad: navEntry.loadEventEnd - navEntry.loadEventStart
    }

    Object.entries(metrics).forEach(([metric, value]) => {
      if (value > 0) {
        trackPerformance(`navigation_${metric}`, value, {
          sessionId: this.sessionId,
          feature: 'performance',
          type: 'navigation'
        })
      }
    })
  }

  private processResourceEntry(entry: PerformanceEntry) {
    const resourceEntry = entry as PerformanceResourceTiming
    
    // Track slow resources
    if (entry.duration > 1000) {
      trackPerformance('slow_resource', entry.duration, {
        sessionId: this.sessionId,
        feature: 'performance',
        resource: entry.name,
        type: resourceEntry.initiatorType,
        size: resourceEntry.transferSize
      })
    }

    // Track large resources
    if (resourceEntry.transferSize > 100000) { // > 100KB
      trackPerformance('large_resource', resourceEntry.transferSize, {
        sessionId: this.sessionId,
        feature: 'performance',
        resource: entry.name,
        type: resourceEntry.initiatorType,
        duration: entry.duration
      })
    }
  }

  private trackPageLoad() {
    // Track page load when DOM is ready
    if (document.readyState === 'complete') {
      this.measurePageLoad()
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.measurePageLoad(), 0)
      })
    }
  }

  private measurePageLoad() {
    const loadTime = Date.now() - this.pageLoadTime
    
    trackPerformance('page_load_time', loadTime, {
      sessionId: this.sessionId,
      feature: 'performance',
      type: 'page-load',
      url: window.location.pathname
    })
  }

  private setupVisibilityChangeTracking() {
    let visibilityStart = Date.now()
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const visibilityDuration = Date.now() - visibilityStart
        
        trackPerformance('page_visibility_duration', visibilityDuration, {
          sessionId: this.sessionId,
          feature: 'performance',
          type: 'visibility'
        })
      } else {
        visibilityStart = Date.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  private setupUnloadTracking() {
    const handleUnload = () => {
      const sessionDuration = Date.now() - this.pageLoadTime
      
      // Use sendBeacon for reliable tracking
      if ('sendBeacon' in navigator) {
        const data = JSON.stringify({
          type: 'session_duration',
          duration: sessionDuration,
          sessionId: this.sessionId,
          feature: 'performance'
        })
        
        navigator.sendBeacon('/api/analytics', data)
      }
    }

    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)
  }

  // Public methods for manual tracking
  public mark(name: string, detail?: unknown) {
    try {
      performance.mark(name, { detail })
    } catch (error) {
      console.warn('Failed to create performance mark:', error)
    }
  }

  public measure(name: string, startMark?: string, endMark?: string) {
    try {
      performance.measure(name, startMark, endMark)
    } catch (error) {
      console.warn('Failed to create performance measure:', error)
    }
  }

  public trackCustomMetric(name: string, value: number, metadata?: Record<string, unknown>) {
    trackPerformance(`custom_${name}`, value, {
      sessionId: this.sessionId,
      feature: 'performance',
      type: 'custom',
      ...metadata
    })
  }

  public disconnect() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }
}

// Create singleton instance
export const rum = new RealUserMonitoring()

// Hooks for React components
export function useRUM() {
  useEffect(() => {
    // RUM is already initialized globally
    return () => {
      // Cleanup if needed
    }
  }, [])

  const trackMetric = useCallback((name: string, value: number, metadata?: Record<string, unknown>) => {
    rum.trackCustomMetric(name, value, metadata)
  }, [])

  const mark = useCallback((name: string, detail?: unknown) => {
    rum.mark(name, detail)
  }, [])

  const measure = useCallback((name: string, startMark?: string, endMark?: string) => {
    rum.measure(name, startMark, endMark)
  }, [])

  return {
    trackMetric,
    mark,
    measure
  }
}

export default rum
