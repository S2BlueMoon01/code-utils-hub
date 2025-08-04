import { useState, useEffect, useCallback } from 'react'
import { searchAnalytics } from './search-analytics'

// Types
export interface SearchResult {
  id: string
  title: string
  description: string
  language?: string
  category?: string
  difficulty?: string
  [key: string]: unknown
}

export interface SearchFilters {
  language?: string
  category?: string
  difficulty?: string
  [key: string]: unknown
}

export interface SearchHookResult {
  query: string
  results: SearchResult[]
  isLoading: boolean
  error: string | null
  totalResults: number
}

export interface AnalyticsHookResult {
  analytics: typeof searchAnalytics
  data: {
    popularQueries: Array<{ query: string; count: number }>
    searchTrends: Array<{ date: string; searches: number }>
    filterUsage: {
      languages: Array<{ name: string; count: number }>
      categories: Array<{ name: string; count: number }>
      difficulties: Array<{ name: string; count: number }>
    }
    zeroResultQueries: Array<{ query: string; count: number }>
    summary: {
      totalSearches: number
      uniqueQueries: number
      avgResultsPerSearch: number
      zeroResultRate: number
    }
  }
  refresh: () => Promise<void>
  clearHistory: () => void
  isLoading: boolean
}

/**
 * Hook for using search analytics service
 */
export function useSearchAnalytics(): AnalyticsHookResult {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    popularQueries: [] as Array<{ query: string; count: number }>,
    searchTrends: [] as Array<{ date: string; searches: number }>,
    filterUsage: {
      languages: [] as Array<{ name: string; count: number }>,
      categories: [] as Array<{ name: string; count: number }>,
      difficulties: [] as Array<{ name: string; count: number }>
    },
    zeroResultQueries: [] as Array<{ query: string; count: number }>,
    summary: {
      totalSearches: 0,
      uniqueQueries: 0,
      avgResultsPerSearch: 0,
      zeroResultRate: 0
    }
  })

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      setData({
        popularQueries: searchAnalytics.getPopularQueries(10),
        searchTrends: searchAnalytics.getSearchTrends(7),
        filterUsage: searchAnalytics.getFilterUsage(),
        zeroResultQueries: searchAnalytics.getZeroResultQueries(10),
        summary: searchAnalytics.getAnalyticsSummary()
      })
    } catch (error) {
      console.error('Error refreshing analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearHistory = useCallback(() => {
    searchAnalytics.clearHistory()
    refresh()
  }, [refresh])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    analytics: searchAnalytics,
    data,
    refresh,
    clearHistory,
    isLoading
  }
}

/**
 * Hook for tracking searches with analytics
 */
export function useTrackedSearch() {
  const [searchState, setSearchState] = useState<SearchHookResult>({
    query: '',
    results: [],
    isLoading: false,
    error: null,
    totalResults: 0
  })

  const search = useCallback(async (
    query: string,
    filters?: SearchFilters,
    searchFunction?: (query: string, filters?: SearchFilters) => Promise<SearchResult[]>
  ) => {
    if (!query.trim()) {
      setSearchState(prev => ({
        ...prev,
        query: '',
        results: [],
        totalResults: 0,
        error: null
      }))
      return
    }

    setSearchState(prev => ({
      ...prev,
      query,
      isLoading: true,
      error: null
    }))

    try {
      let results: SearchResult[] = []
      
      if (searchFunction) {
        results = await searchFunction(query, filters)
      }

      // Track the search
      searchAnalytics.trackSearch({
        query,
        results: results.length,
        filters
      })

      setSearchState({
        query,
        results,
        isLoading: false,
        error: null,
        totalResults: results.length
      })

      return results
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed'
      
      setSearchState({
        query,
        results: [],
        isLoading: false,
        error: errorMessage,
        totalResults: 0
      })

      // Track failed search
      searchAnalytics.trackSearch({
        query,
        results: 0,
        filters
      })
      
      throw error
    }
  }, [])

  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      results: [],
      isLoading: false,
      error: null,
      totalResults: 0
    })
  }, [])

  return {
    ...searchState,
    search,
    clearSearch
  }
}

/**
 * Hook for real-time search suggestions based on analytics
 */
export function useSearchSuggestions(currentQuery: string, limit: number = 5) {
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (!currentQuery.trim()) {
      setSuggestions([])
      return
    }

    // Get popular queries that match current input
    const popularQueries = searchAnalytics.getPopularQueries(50)
    const filtered = popularQueries
      .filter((item: { query: string; count: number }) => 
        item.query.toLowerCase().includes(currentQuery.toLowerCase()) &&
        item.query.toLowerCase() !== currentQuery.toLowerCase()
      )
      .slice(0, limit)
      .map((item: { query: string; count: number }) => item.query)

    setSuggestions(filtered)
  }, [currentQuery, limit])

  return suggestions
}

export default useSearchAnalytics
