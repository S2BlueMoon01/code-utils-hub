'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Activity,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { useSearchAnalytics } from '@/lib/search-analytics'

interface SearchAnalyticsDashboardProps {
  className?: string
}

export function SearchAnalyticsDashboard({ className = '' }: SearchAnalyticsDashboardProps) {
  const searchAnalytics = useSearchAnalytics()
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // State for analytics data
  const [popularQueries, setPopularQueries] = useState<Array<{ query: string; count: number }>>([])
  const [searchTrends, setSearchTrends] = useState<Array<{ date: string; searches: number }>>([])
  const [filterUsage, setFilterUsage] = useState<{
    languages: Array<{ name: string; count: number }>
    categories: Array<{ name: string; count: number }>
    difficulties: Array<{ name: string; count: number }>
  }>({ languages: [], categories: [], difficulties: [] })
  const [zeroResultQueries, setZeroResultQueries] = useState<Array<{ query: string; count: number }>>([])
  const [summary, setSummary] = useState({
    totalSearches: 0,
    uniqueQueries: 0,
    avgResultsPerSearch: 0,
    zeroResultRate: 0
  })

  const refreshData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      // Load fresh data
      setPopularQueries(searchAnalytics.getPopularQueries(10))
      setSearchTrends(searchAnalytics.getSearchTrends(7))
      setFilterUsage(searchAnalytics.getFilterUsage())
      setZeroResultQueries(searchAnalytics.getZeroResultQueries(10))
      setSummary(searchAnalytics.getAnalyticsSummary())
      setLastRefresh(new Date())
    } catch (error) {
      console.error('Failed to refresh analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchAnalytics])

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all search history? This action cannot be undone.')) {
      searchAnalytics.clearHistory()
      refreshData()
    }
  }

  useEffect(() => {
    refreshData()
  }, [refreshData])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Search Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearHistory}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalSearches.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unique Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.uniqueQueries.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgResultsPerSearch}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Zero Result Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.zeroResultRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular Search Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularQueries.length > 0 ? (
                popularQueries.map((item, index) => (
                  <div key={item.query} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <span className="text-sm font-medium truncate">{item.query}</span>
                    </div>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No search data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Search Trends (7 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchTrends.length > 0 ? (
                searchTrends.map((trend) => (
                  <div key={trend.date} className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {new Date(trend.date).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ 
                            width: `${Math.max(5, (trend.searches / Math.max(...searchTrends.map(t => t.searches), 1)) * 100)}%`
                          }}
                        />
                      </div>
                      <Badge variant="outline">{trend.searches}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No trend data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filter Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Languages */}
              <div>
                <h4 className="text-sm font-medium mb-2">Languages</h4>
                <div className="space-y-2">
                  {filterUsage.languages.slice(0, 5).map((lang) => (
                    <div key={lang.name} className="flex items-center justify-between">
                      <span className="text-sm">{lang.name}</span>
                      <Badge variant="outline">{lang.count}</Badge>
                    </div>
                  ))}
                  {filterUsage.languages.length === 0 && (
                    <p className="text-xs text-muted-foreground">No filter usage data</p>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium mb-2">Categories</h4>
                <div className="space-y-2">
                  {filterUsage.categories.slice(0, 5).map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <span className="text-sm">{cat.name}</span>
                      <Badge variant="outline">{cat.count}</Badge>
                    </div>
                  ))}
                  {filterUsage.categories.length === 0 && (
                    <p className="text-xs text-muted-foreground">No filter usage data</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zero Result Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Zero Result Queries
              <Badge variant="destructive" className="ml-auto">
                {zeroResultQueries.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {zeroResultQueries.length > 0 ? (
                zeroResultQueries.slice(0, 8).map((item) => (
                  <div key={item.query} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{item.query}</span>
                    <Badge variant="outline">{item.count}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No zero-result queries</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground text-center">
        Last updated: {lastRefresh.toLocaleString()}
      </div>
    </div>
  )
}
