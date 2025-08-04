import { analytics } from '@/lib/analytics'

interface SearchAnalytics {
  query: string
  results: number
  filters?: {
    language?: string
    category?: string
    difficulty?: string
  }
  timestamp: string
  userId?: string
}

class SearchAnalyticsService {
  private static instance: SearchAnalyticsService
  private searchHistory: SearchAnalytics[] = []
  private readonly MAX_HISTORY = 1000

  static getInstance(): SearchAnalyticsService {
    if (!SearchAnalyticsService.instance) {
      SearchAnalyticsService.instance = new SearchAnalyticsService()
    }
    return SearchAnalyticsService.instance
  }

  /**
   * Track a search query
   */
  trackSearch(data: Omit<SearchAnalytics, 'timestamp'>) {
    const searchData: SearchAnalytics = {
      ...data,
      timestamp: new Date().toISOString()
    }

    // Add to local history
    this.searchHistory.unshift(searchData)
    if (this.searchHistory.length > this.MAX_HISTORY) {
      this.searchHistory = this.searchHistory.slice(0, this.MAX_HISTORY)
    }

    // Track with analytics system
    analytics.trackEvent('search_performed', {
      query: data.query,
      results_count: data.results,
      has_filters: !!data.filters,
      language_filter: data.filters?.language || '',
      category_filter: data.filters?.category || '',
      difficulty_filter: data.filters?.difficulty || '',
      user_id: data.userId || ''
    })

    // Store in localStorage for persistence
    try {
      localStorage.setItem('search_history', JSON.stringify(this.searchHistory.slice(0, 100)))
    } catch (error) {
      console.warn('Failed to save search history:', error)
    }
  }

  /**
   * Get popular search queries
   */
  getPopularQueries(limit: number = 10): Array<{ query: string; count: number }> {
    const queryCount: Record<string, number> = {}
    
    this.searchHistory.forEach(search => {
      const query = search.query.toLowerCase().trim()
      if (query.length > 0) {
        queryCount[query] = (queryCount[query] || 0) + 1
      }
    })

    return Object.entries(queryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }))
  }

  /**
   * Get search trends over time
   */
  getSearchTrends(days: number = 7): Array<{ date: string; searches: number }> {
    const now = new Date()
    const trends: Record<string, number> = {}

    // Initialize with zeros for each day
    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      trends[dateKey] = 0
    }

    // Count searches by date
    this.searchHistory.forEach(search => {
      const searchDate = search.timestamp.split('T')[0]
      if (trends.hasOwnProperty(searchDate)) {
        trends[searchDate]++
      }
    })

    return Object.entries(trends)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, searches]) => ({ date, searches }))
  }

  /**
   * Get most used filters
   */
  getFilterUsage(): {
    languages: Array<{ name: string; count: number }>
    categories: Array<{ name: string; count: number }>
    difficulties: Array<{ name: string; count: number }>
  } {
    const languages: Record<string, number> = {}
    const categories: Record<string, number> = {}
    const difficulties: Record<string, number> = {}

    this.searchHistory.forEach(search => {
      if (search.filters?.language) {
        languages[search.filters.language] = (languages[search.filters.language] || 0) + 1
      }
      if (search.filters?.category) {
        categories[search.filters.category] = (categories[search.filters.category] || 0) + 1
      }
      if (search.filters?.difficulty) {
        difficulties[search.filters.difficulty] = (difficulties[search.filters.difficulty] || 0) + 1
      }
    })

    const sortEntries = (obj: Record<string, number>) =>
      Object.entries(obj)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }))

    return {
      languages: sortEntries(languages),
      categories: sortEntries(categories),
      difficulties: sortEntries(difficulties)
    }
  }

  /**
   * Get zero-result searches (queries that returned no results)
   */
  getZeroResultQueries(limit: number = 20): Array<{ query: string; count: number }> {
    const zeroResultQueries: Record<string, number> = {}
    
    this.searchHistory
      .filter(search => search.results === 0)
      .forEach(search => {
        const query = search.query.toLowerCase().trim()
        if (query.length > 0) {
          zeroResultQueries[query] = (zeroResultQueries[query] || 0) + 1
        }
      })

    return Object.entries(zeroResultQueries)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }))
  }

  /**
   * Clear search history
   */
  clearHistory() {
    this.searchHistory = []
    try {
      localStorage.removeItem('search_history')
    } catch (error) {
      console.warn('Failed to clear search history:', error)
    }
  }

  /**
   * Load search history from localStorage
   */
  loadHistory() {
    try {
      const saved = localStorage.getItem('search_history')
      if (saved) {
        this.searchHistory = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Failed to load search history:', error)
    }
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary() {
    const totalSearches = this.searchHistory.length
    const uniqueQueries = new Set(this.searchHistory.map(s => s.query.toLowerCase())).size
    const avgResultsPerSearch = totalSearches > 0 
      ? this.searchHistory.reduce((sum, s) => sum + s.results, 0) / totalSearches 
      : 0
    const zeroResultRate = totalSearches > 0
      ? this.searchHistory.filter(s => s.results === 0).length / totalSearches
      : 0

    return {
      totalSearches,
      uniqueQueries,
      avgResultsPerSearch: Math.round(avgResultsPerSearch * 10) / 10,
      zeroResultRate: Math.round(zeroResultRate * 1000) / 10 // percentage with 1 decimal
    }
  }
}

// Export singleton instance
export const searchAnalytics = SearchAnalyticsService.getInstance()

// Hook for using search analytics in components
export function useSearchAnalytics() {
  return {
    trackSearch: (data: Omit<SearchAnalytics, 'timestamp'>) => searchAnalytics.trackSearch(data),
    getPopularQueries: (limit?: number) => searchAnalytics.getPopularQueries(limit),
    getSearchTrends: (days?: number) => searchAnalytics.getSearchTrends(days),
    getFilterUsage: () => searchAnalytics.getFilterUsage(),
    getZeroResultQueries: (limit?: number) => searchAnalytics.getZeroResultQueries(limit),
    getAnalyticsSummary: () => searchAnalytics.getAnalyticsSummary(),
    clearHistory: () => searchAnalytics.clearHistory()
  }
}
