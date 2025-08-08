'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useSearchAnalyticsStore } from '@/stores/searchAnalyticsStore'
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Eye,
  Hash,
  Code,
  Tag,
  RefreshCw
} from 'lucide-react'

export function SearchAnalyticsDashboard() {
  const { 
    getAnalytics, 
    getPopularQueries, 
    getTrendingCategories, 
    getTrendingLanguages,
    clearAnalytics,
    searches
  } = useSearchAnalyticsStore()
  
  const [analytics, setAnalytics] = useState(getAnalytics())
  const [popularQueries, setPopularQueries] = useState(getPopularQueries(10))
  const [trendingCategories, setTrendingCategories] = useState(getTrendingCategories(10))
  const [trendingLanguages, setTrendingLanguages] = useState(getTrendingLanguages(10))

  useEffect(() => {
    const updateData = () => {
      setAnalytics(getAnalytics())
      setPopularQueries(getPopularQueries(10))
      setTrendingCategories(getTrendingCategories(10))
      setTrendingLanguages(getTrendingLanguages(10))
    }
    
    updateData()
    
    // Update every 5 seconds if component is mounted
    const interval = setInterval(updateData, 5000)
    return () => clearInterval(interval)
  }, [searches, getAnalytics, getPopularQueries, getTrendingCategories, getTrendingLanguages])

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN')
  }

  const getRecentSearches = () => {
    return searches
      .slice(-10)
      .reverse()
      .map(search => ({
        ...search,
        formattedTime: formatTimestamp(search.timestamp)
      }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Search Analytics</h1>
          <p className="text-muted-foreground">
            Insights and trends from user search behavior
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={clearAnalytics}
          className="text-destructive hover:text-destructive"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Clear Analytics
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Searches</p>
                <p className="text-2xl font-bold">{analytics.totalSearches.toLocaleString()}</p>
              </div>
              <Search className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Queries</p>
                <p className="text-2xl font-bold">{analytics.uniqueSearches.toLocaleString()}</p>
              </div>
              <Hash className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Results</p>
                <p className="text-2xl font-bold">{analytics.averageResultsPerSearch.toFixed(1)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">
                  {analytics.totalSearches > 0 
                    ? ((searches.filter(s => s.resultsCount > 0).length / analytics.totalSearches) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="popular" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="popular">Popular Queries</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Most Popular Search Queries
              </CardTitle>
              <CardDescription>
                Top search terms based on frequency and recency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularQueries.length > 0 ? (
                  popularQueries.map((query, index) => {
                    const maxCount = popularQueries[0]?.count || 1
                    const percentage = (query.count / maxCount) * 100
                    
                    return (
                      <div key={query.query} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                              {index + 1}
                            </div>
                            <span className="font-medium">{query.query}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{query.count} searches</Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatTimestamp(query.lastSearched)}
                            </span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No search data available yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Trending Categories
              </CardTitle>
              <CardDescription>
                Most searched function categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {trendingCategories.length > 0 ? (
                  trendingCategories.map((category, index) => {
                    const maxCount = trendingCategories[0]?.count || 1
                    const percentage = (category.count / maxCount) * 100
                    
                    return (
                      <div key={category.category} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{category.category}</span>
                          <Badge variant="outline">#{index + 1}</Badge>
                        </div>
                        <div className="space-y-2">
                          <Progress value={percentage} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            {category.count} searches
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-8">
                    No category data available yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Popular Programming Languages
              </CardTitle>
              <CardDescription>
                Most searched programming languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {trendingLanguages.length > 0 ? (
                  trendingLanguages.map((language, index) => {
                    const maxCount = trendingLanguages[0]?.count || 1
                    const percentage = (language.count / maxCount) * 100
                    
                    const getLanguageColor = (lang: string) => {
                      const colors: Record<string, string> = {
                        javascript: 'bg-yellow-500',
                        typescript: 'bg-blue-500',
                        python: 'bg-green-500',
                        java: 'bg-orange-500',
                        cpp: 'bg-blue-600',
                        csharp: 'bg-purple-500'
                      }
                      return colors[lang.toLowerCase()] || 'bg-gray-500'
                    }
                    
                    return (
                      <div key={language.language} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getLanguageColor(language.language)}`} />
                            <span className="font-medium capitalize">{language.language}</span>
                          </div>
                          <Badge variant="outline">#{index + 1}</Badge>
                        </div>
                        <div className="space-y-2">
                          <Progress value={percentage} className="h-2" />
                          <p className="text-sm text-muted-foreground">
                            {language.count} searches
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-8">
                    No language data available yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Search Activity
              </CardTitle>
              <CardDescription>
                Latest search queries and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getRecentSearches().length > 0 ? (
                  getRecentSearches().map((search) => (
                    <div key={search.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{search.query}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {search.category && (
                              <Badge variant="secondary" className="text-xs">
                                {search.category}
                              </Badge>
                            )}
                            {search.language && (
                              <Badge variant="outline" className="text-xs">
                                {search.language}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {search.resultsCount} results
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {search.formattedTime}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No recent searches available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
