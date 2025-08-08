'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { trackPerformance, errorMonitoring } from '@/lib/error-monitoring'
import { env } from '@/lib/environment'

interface PerformanceMetrics {
  name: string
  duration: number
  startTime: number
  endTime: number
  metadata?: Record<string, unknown>
}

interface UsePerformanceOptions {
  trackAutomatically?: boolean
  feature?: string
  threshold?: number // Log warning if duration exceeds this (in ms)
}

export function usePerformance(name: string, options: UsePerformanceOptions = {}) {
  const {
    trackAutomatically = true,
    feature,
    threshold = 1000
  } = options

  const startTimeRef = useRef<number | null>(null)
  const metricsRef = useRef<PerformanceMetrics[]>([])

  const start = useCallback(() => {
    startTimeRef.current = performance.now()
    
    if (env.isDevelopment()) {
      console.time(`[Performance] ${name}`)
    }
  }, [name])

  const end = useCallback((metadata?: Record<string, unknown>) => {
    if (startTimeRef.current === null) {
      console.warn(`Performance measurement "${name}" was ended without being started`)
      return null
    }

    const endTime = performance.now()
    const duration = endTime - startTimeRef.current
    
    const metrics: PerformanceMetrics = {
      name,
      duration,
      startTime: startTimeRef.current,
      endTime,
      metadata
    }

    metricsRef.current.push(metrics)

    if (env.isDevelopment()) {
      console.timeEnd(`[Performance] ${name}`)
      
      if (duration > threshold) {
        console.warn(`[Performance Warning] ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`)
      }
    }

    // Track performance if enabled
    if (trackAutomatically) {
      trackPerformance(name, duration, {
        feature,
        threshold: duration > threshold ? 'exceeded' : 'within',
        ...metadata
      })
    }

    // Reset start time
    startTimeRef.current = null
    
    return metrics
  }, [name, trackAutomatically, feature, threshold])

  const getMetrics = useCallback(() => {
    return [...metricsRef.current]
  }, [])

  const clearMetrics = useCallback(() => {
    metricsRef.current = []
  }, [])

  const getAverageTime = useCallback(() => {
    if (metricsRef.current.length === 0) return 0
    
    const total = metricsRef.current.reduce((sum, metric) => sum + metric.duration, 0)
    return total / metricsRef.current.length
  }, [])

  return {
    start,
    end,
    getMetrics,
    clearMetrics,
    getAverageTime,
    isRunning: startTimeRef.current !== null
  }
}

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string, feature?: string) {
  const renderCount = useRef(0)
  const lastRenderTime = useRef<number>(0)

  useEffect(() => {
    const renderTime = performance.now()
    renderCount.current += 1

    if (lastRenderTime.current > 0) {
      const timeSinceLastRender = renderTime - lastRenderTime.current
      
      // Track slow re-renders (more than 16ms for 60fps)
      if (timeSinceLastRender > 16) {
        trackPerformance(`${componentName}_render`, timeSinceLastRender, {
          feature,
          renderCount: renderCount.current,
          type: 're-render'
        })
      }
    } else {
      // Track initial render
      trackPerformance(`${componentName}_initial_render`, renderTime, {
        feature,
        renderCount: renderCount.current,
        type: 'initial'
      })
    }

    lastRenderTime.current = renderTime

    // Add breadcrumb for excessive re-renders
    if (renderCount.current > 10) {
      errorMonitoring.addBreadcrumb(
        `Component ${componentName} has re-rendered ${renderCount.current} times`,
        'performance',
        {
          componentName,
          renderCount: renderCount.current,
          feature
        }
      )
    }
  })

  return {
    renderCount: renderCount.current
  }
}

// Hook for measuring API call performance
export function useApiPerformance() {
  const measure = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string,
    feature?: string
  ): Promise<T> => {
    const startTime = performance.now()
    
    try {
      const result = await apiCall()
      const duration = performance.now() - startTime
      
      trackPerformance(`api_${endpoint}`, duration, {
        feature,
        status: 'success',
        endpoint
      })
      
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      
      trackPerformance(`api_${endpoint}`, duration, {
        feature,
        status: 'error',
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      
      throw error
    }
  }, [])

  return { measure }
}

// Web Vitals tracking
export function useWebVitals(feature?: string) {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    // Use basic performance API instead of web-vitals library for now
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          trackPerformance(`web_vital_${entry.name}`, entry.duration, {
            feature,
            type: entry.entryType
          })
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['measure', 'navigation'] })
    } catch (error) {
      console.warn('Performance Observer not supported:', error)
    }

    return () => {
      observer.disconnect()
    }
  }, [feature])
}

// Performance monitoring component
interface PerformanceMonitorProps {
  children: React.ReactNode
  feature?: string
  enableWebVitals?: boolean
}

export function PerformanceMonitor({ 
  children, 
  feature, 
  enableWebVitals = true 
}: PerformanceMonitorProps) {
  useWebVitals(enableWebVitals ? feature : undefined)

  return children as React.ReactElement
}

export default usePerformance
