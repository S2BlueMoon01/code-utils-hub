'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  Zap, 
  Globe, 
  Server,
  Clock,
  RefreshCw
} from 'lucide-react'

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  status: 'good' | 'needs-improvement' | 'poor'
  threshold: { good: number; poor: number }
}

interface PerformanceData {
  coreWebVitals: {
    lcp: number // Largest Contentful Paint
    fid: number // First Input Delay
    cls: number // Cumulative Layout Shift
    fcp: number // First Contentful Paint
    ttfb: number // Time to First Byte
  }
  runtime: {
    jsHeapSize: number
    jsHeapSizeLimit: number
    usedJSHeapSize: number
  }
  network: {
    connectionType: string
    effectiveType: string
    downlink: number
    rtt: number
  }
  timing: {
    domContentLoaded: number
    loadComplete: number
    firstPaint: number
    firstContentfulPaint: number
  }
}

export function PerformanceMonitor() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const collectPerformanceData = () => {
    setIsLoading(true)
    
    try {
      // Core Web Vitals (simplified measurement)
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paintEntries = performance.getEntriesByType('paint')
      
      // Memory information
      const memory = (performance as unknown as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory || {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
      }

      // Network information
      const connection = (navigator as unknown as { connection?: { type?: string; effectiveType?: string; downlink?: number; rtt?: number } }).connection || {}

      const data: PerformanceData = {
        coreWebVitals: {
          lcp: navigation.loadEventEnd - navigation.loadEventStart,
          fid: 0, // Would need special measurement
          cls: 0, // Would need special measurement
          fcp: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
          ttfb: navigation.responseStart - navigation.requestStart
        },
        runtime: {
          jsHeapSize: memory.totalJSHeapSize || 0,
          jsHeapSizeLimit: memory.jsHeapSizeLimit || 0,
          usedJSHeapSize: memory.usedJSHeapSize || 0
        },
        network: {
          connectionType: connection.type || 'unknown',
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0
        },
        timing: {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        }
      }

      setPerformanceData(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to collect performance data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Wait for page to load before collecting initial data
    if (document.readyState === 'complete') {
      collectPerformanceData()
    } else {
      window.addEventListener('load', collectPerformanceData)
      return () => window.removeEventListener('load', collectPerformanceData)
    }
  }, [])

  const getMetricStatus = (value: number, thresholds: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' => {
    if (value <= thresholds.good) return 'good'
    if (value <= thresholds.poor) return 'needs-improvement'
    return 'poor'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'poor': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const coreWebVitalsMetrics: PerformanceMetric[] = performanceData ? [
    {
      name: 'First Contentful Paint',
      value: performanceData.coreWebVitals.fcp,
      unit: 'ms',
      status: getMetricStatus(performanceData.coreWebVitals.fcp, { good: 1800, poor: 3000 }),
      threshold: { good: 1800, poor: 3000 }
    },
    {
      name: 'Time to First Byte',
      value: performanceData.coreWebVitals.ttfb,
      unit: 'ms',
      status: getMetricStatus(performanceData.coreWebVitals.ttfb, { good: 800, poor: 1800 }),
      threshold: { good: 800, poor: 1800 }
    },
    {
      name: 'DOM Content Loaded',
      value: performanceData.timing.domContentLoaded,
      unit: 'ms',
      status: getMetricStatus(performanceData.timing.domContentLoaded, { good: 1000, poor: 2000 }),
      threshold: { good: 1000, poor: 2000 }
    },
    {
      name: 'Load Complete',
      value: performanceData.timing.loadComplete,
      unit: 'ms',
      status: getMetricStatus(performanceData.timing.loadComplete, { good: 2000, poor: 4000 }),
      threshold: { good: 2000, poor: 4000 }
    }
  ] : []

  if (isLoading || !performanceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitor
            <RefreshCw className="h-4 w-4 animate-spin ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Collecting performance data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Performance Monitor</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={collectPerformanceData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreWebVitalsMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">
                  {metric.value.toFixed(0)}{metric.unit}
                </div>
                <Progress 
                  value={Math.min(100, (metric.value / metric.threshold.poor) * 100)} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Runtime Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used JS Heap</span>
                <span>{formatBytes(performanceData.runtime.usedJSHeapSize)}</span>
              </div>
              <Progress 
                value={performanceData.runtime.jsHeapSizeLimit > 0 
                  ? (performanceData.runtime.usedJSHeapSize / performanceData.runtime.jsHeapSizeLimit) * 100 
                  : 0
                } 
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total JS Heap</span>
                <span>{formatBytes(performanceData.runtime.jsHeapSize)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Heap Limit</span>
                <span>{formatBytes(performanceData.runtime.jsHeapSizeLimit)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Network Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Connection Type</span>
              <Badge variant="outline">{performanceData.network.connectionType}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Effective Type</span>
              <Badge variant="outline">{performanceData.network.effectiveType}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Downlink</span>
              <span className="text-sm font-medium">{performanceData.network.downlink} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Round Trip Time</span>
              <span className="text-sm font-medium">{performanceData.network.rtt} ms</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Timing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Detailed Timing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {performanceData.timing.firstPaint.toFixed(0)}ms
              </div>
              <div className="text-sm text-muted-foreground">First Paint</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {performanceData.timing.firstContentfulPaint.toFixed(0)}ms
              </div>
              <div className="text-sm text-muted-foreground">First Contentful Paint</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {performanceData.timing.domContentLoaded.toFixed(0)}ms
              </div>
              <div className="text-sm text-muted-foreground">DOM Content Loaded</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-xs text-muted-foreground text-center">
        Last updated: {lastUpdate.toLocaleString()}
      </div>
    </div>
  )
}
