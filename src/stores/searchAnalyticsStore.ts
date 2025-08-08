import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SearchQuery {
  id: string
  query: string
  category?: string
  language?: string
  timestamp: number
  resultsCount: number
  userId?: string
}

export interface SearchAnalytics {
  popularQueries: { query: string; count: number; lastSearched: number }[]
  trendingCategories: { category: string; count: number }[]
  trendingLanguages: { language: string; count: number }[]
  totalSearches: number
  uniqueSearches: number
  averageResultsPerSearch: number
}

interface SearchAnalyticsState {
  searches: SearchQuery[]
  analytics: SearchAnalytics
  
  // Actions
  trackSearch: (query: SearchQuery) => void
  getPopularQueries: (limit?: number) => SearchAnalytics['popularQueries']
  getTrendingCategories: (limit?: number) => SearchAnalytics['trendingCategories'] 
  getTrendingLanguages: (limit?: number) => SearchAnalytics['trendingLanguages']
  getAnalytics: () => SearchAnalytics
  clearAnalytics: () => void
}

const calculateAnalytics = (searches: SearchQuery[]): SearchAnalytics => {
  const queryCount: Record<string, { count: number; lastSearched: number }> = {}
  const categoryCount: Record<string, number> = {}
  const languageCount: Record<string, number> = {}
  
  searches.forEach(search => {
    // Track query popularity
    if (queryCount[search.query]) {
      queryCount[search.query].count++
      queryCount[search.query].lastSearched = Math.max(
        queryCount[search.query].lastSearched,
        search.timestamp
      )
    } else {
      queryCount[search.query] = {
        count: 1,
        lastSearched: search.timestamp
      }
    }
    
    // Track category trends
    if (search.category) {
      categoryCount[search.category] = (categoryCount[search.category] || 0) + 1
    }
    
    // Track language trends
    if (search.language) {
      languageCount[search.language] = (languageCount[search.language] || 0) + 1
    }
  })
  
  const popularQueries = Object.entries(queryCount)
    .map(([query, data]) => ({ query, ...data }))
    .sort((a, b) => b.count - a.count)
  
  const trendingCategories = Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
  
  const trendingLanguages = Object.entries(languageCount)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
  
  const totalSearches = searches.length
  const uniqueSearches = Object.keys(queryCount).length
  const averageResultsPerSearch = searches.reduce((sum, s) => sum + s.resultsCount, 0) / totalSearches || 0
  
  return {
    popularQueries,
    trendingCategories,
    trendingLanguages,
    totalSearches,
    uniqueSearches,
    averageResultsPerSearch
  }
}

export const useSearchAnalyticsStore = create<SearchAnalyticsState>()(
  persist(
    (set, get) => ({
      searches: [],
      analytics: {
        popularQueries: [],
        trendingCategories: [],
        trendingLanguages: [],
        totalSearches: 0,
        uniqueSearches: 0,
        averageResultsPerSearch: 0
      },

      trackSearch: (query: SearchQuery) => {
        const { searches } = get()
        const newSearches = [...searches, query]
        
        // Keep only last 1000 searches for performance
        if (newSearches.length > 1000) {
          newSearches.splice(0, newSearches.length - 1000)
        }
        
        const analytics = calculateAnalytics(newSearches)
        
        set({
          searches: newSearches,
          analytics
        })
      },

      getPopularQueries: (limit = 10) => {
        const { analytics } = get()
        return analytics.popularQueries.slice(0, limit)
      },

      getTrendingCategories: (limit = 10) => {
        const { analytics } = get()
        return analytics.trendingCategories.slice(0, limit)
      },

      getTrendingLanguages: (limit = 10) => {
        const { analytics } = get()
        return analytics.trendingLanguages.slice(0, limit)
      },

      getAnalytics: () => {
        return get().analytics
      },

      clearAnalytics: () => {
        set({
          searches: [],
          analytics: {
            popularQueries: [],
            trendingCategories: [],
            trendingLanguages: [],
            totalSearches: 0,
            uniqueSearches: 0,
            averageResultsPerSearch: 0
          }
        })
      }
    }),
    {
      name: 'search-analytics-store',
      partialize: (state) => ({
        searches: state.searches,
        analytics: state.analytics
      })
    }
  )
)
