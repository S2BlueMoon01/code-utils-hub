'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Users, 
  Zap, 
  AlertTriangle, 
  Download,
  RefreshCw 
} from 'lucide-react'
import { performanceMonitor } from '@/lib/performance-monitor'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

function MetricCard({ title, value, subtitle, trend, icon, className }: MetricCardProps) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-muted-foreground'
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className={`text-xs ${getTrendColor()}`}>
            {trend === 'up' && '↗ '}
            {trend === 'down' && '↘ '}
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface PerformanceSummary {
  coreWebVitals: {
    lcp?: { value: number } | null
    fid?: { value: number } | null
    cls?: { value: number } | null
  }
  pageMetrics: {
    loadTime?: { value: number } | null
    domContentLoaded?: { value: number } | null
    timeToInteractive?: { value: number } | null
  }
  userEngagement: {
    totalActions: number
    sessionDuration: number
    mostUsedComponents: Array<{ component: string; count: number }>
  }
  performance: {
    averageResponseTime: number
    slowestOperations: Array<{ name: string; value: number }>
    totalMetrics: number
  }
}

export function AnalyticsDashboard() {
  const { t } = useTranslation()
  const [summary, setSummary] = useState<PerformanceSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    try {
      const newSummary = performanceMonitor.getPerformanceSummary()
      setSummary(newSummary)
    } catch (error) {
      console.error('Failed to get performance summary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    try {
      const data = performanceMonitor.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  useEffect(() => {
    refreshData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (ms: number | null | undefined) => {
    if (!ms) return 'N/A'
    return `${Math.round(ms)}ms`
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            {t('common.loading')}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h2>
          <p className="text-muted-foreground">
            {t('analytics.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Largest Contentful Paint (LCP)"
          value={formatTime(summary.coreWebVitals.lcp?.value)}
          subtitle={(summary.coreWebVitals.lcp?.value || 0) > 2500 ? 'Needs improvement' : 'Good'}
          trend={(summary.coreWebVitals.lcp?.value || 0) > 2500 ? 'down' : 'up'}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          className={(summary.coreWebVitals.lcp?.value || 0) > 2500 ? 'border-red-200' : 'border-green-200'}
        />
        <MetricCard
          title="First Input Delay (FID)"
          value={formatTime(summary.coreWebVitals.fid?.value)}
          subtitle={(summary.coreWebVitals.fid?.value || 0) > 100 ? 'Needs improvement' : 'Good'}
          trend={(summary.coreWebVitals.fid?.value || 0) > 100 ? 'down' : 'up'}
          icon={<Zap className="h-4 w-4 text-muted-foreground" />}
          className={(summary.coreWebVitals.fid?.value || 0) > 100 ? 'border-red-200' : 'border-green-200'}
        />
        <MetricCard
          title="Cumulative Layout Shift (CLS)"
          value={summary.coreWebVitals.cls?.value?.toFixed(3) || 'N/A'}
          subtitle={(summary.coreWebVitals.cls?.value || 0) > 0.1 ? 'Needs improvement' : 'Good'}
          trend={(summary.coreWebVitals.cls?.value || 0) > 0.1 ? 'down' : 'up'}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          className={(summary.coreWebVitals.cls?.value || 0) > 0.1 ? 'border-red-200' : 'border-green-200'}
        />
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Page Load Time"
              value={formatTime(summary.pageMetrics.loadTime?.value)}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="DOM Content Loaded"
              value={formatTime(summary.pageMetrics.domContentLoaded?.value)}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Time to Interactive"
              value={formatTime(summary.pageMetrics.timeToInteractive?.value)}
              icon={<Zap className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Average Response Time"
              value={formatTime(summary.performance.averageResponseTime)}
              icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          {/* Slowest Operations */}
          <Card>
            <CardHeader>
              <CardTitle>Slowest Operations</CardTitle>
              <CardDescription>Operations taking more than 100ms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {summary.performance.slowestOperations.length > 0 ? (
                  summary.performance.slowestOperations.map((op, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded border">
                      <span className="font-medium">{op.name}</span>
                      <Badge variant="outline">{formatTime(op.value)}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No slow operations detected</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Total User Actions"
              value={summary.userEngagement.totalActions}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Session Duration"
              value={formatTime(summary.userEngagement.sessionDuration)}
              icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            />
            <MetricCard
              title="Total Metrics"
              value={summary.performance.totalMetrics}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          {/* Most Used Components */}
          <Card>
            <CardHeader>
              <CardTitle>Most Used Components</CardTitle>
              <CardDescription>Top 5 components by user interaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {summary.userEngagement.mostUsedComponents.length > 0 ? (
                  summary.userEngagement.mostUsedComponents.map((comp, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded border">
                      <span className="font-medium">{comp.component}</span>
                      <Badge variant="secondary">{comp.count} interactions</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No component interactions recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Performance Alerts
              </CardTitle>
              <CardDescription>Critical performance issues detected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* LCP Alert */}
                {(summary.coreWebVitals.lcp?.value || 0) > 2500 && (
                  <div className="flex items-start gap-3 p-3 rounded border border-red-200 bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Slow Largest Contentful Paint</h4>
                      <p className="text-sm text-red-600">
                        LCP is {formatTime(summary.coreWebVitals.lcp?.value || 0)}, which is above the recommended 2.5s threshold.
                      </p>
                    </div>
                  </div>
                )}

                {/* FID Alert */}
                {(summary.coreWebVitals.fid?.value || 0) > 100 && (
                  <div className="flex items-start gap-3 p-3 rounded border border-red-200 bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">High First Input Delay</h4>
                      <p className="text-sm text-red-600">
                        FID is {formatTime(summary.coreWebVitals.fid?.value || 0)}, which is above the recommended 100ms threshold.
                      </p>
                    </div>
                  </div>
                )}

                {/* CLS Alert */}
                {(summary.coreWebVitals.cls?.value || 0) > 0.1 && (
                  <div className="flex items-start gap-3 p-3 rounded border border-red-200 bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">High Cumulative Layout Shift</h4>
                      <p className="text-sm text-red-600">
                        CLS is {(summary.coreWebVitals.cls?.value || 0).toFixed(3)}, which is above the recommended 0.1 threshold.
                      </p>
                    </div>
                  </div>
                )}

                {/* No Issues */}
                {!((summary.coreWebVitals.lcp?.value || 0) > 2500) && 
                 !((summary.coreWebVitals.fid?.value || 0) > 100) && 
                 !((summary.coreWebVitals.cls?.value || 0) > 0.1) && (
                  <div className="flex items-center gap-3 p-3 rounded border border-green-200 bg-green-50">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">All Core Web Vitals Good</h4>
                      <p className="text-sm text-green-600">
                        No critical performance issues detected.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
