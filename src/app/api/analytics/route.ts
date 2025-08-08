import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/environment'

interface AnalyticsData {
  type: string
  data: Record<string, unknown>
  sessionId: string
  timestamp: string
}

interface SearchAnalyticsData {
  query: string
  category?: string
  language?: string
  resultsCount: number
  userId?: string
  timestamp: number
}

// In-memory storage for demo (in production, use a database)
const analyticsStore: AnalyticsData[] = []
const searchAnalyticsStore: SearchAnalyticsData[] = []

export async function POST(request: NextRequest) {
  if (!env.features.analytics) {
    return NextResponse.json(
      { error: 'Analytics is disabled' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    
    if (body.type === 'search') {
      // Handle search analytics
      const searchData: SearchAnalyticsData = {
        query: body.data.query,
        category: body.data.category,
        language: body.data.language,
        resultsCount: body.data.resultsCount,
        userId: body.data.userId,
        timestamp: Date.now()
      }
      
      searchAnalyticsStore.push(searchData)
      
      // Keep only last 5000 searches for memory management
      if (searchAnalyticsStore.length > 5000) {
        searchAnalyticsStore.splice(0, searchAnalyticsStore.length - 5000)
      }
      
    } else {
      // Handle general analytics
      const analyticsEntry: AnalyticsData = {
        ...body,
        timestamp: new Date().toISOString(),
      }

      analyticsStore.push(analyticsEntry)
      
      // Keep only last 10000 events for memory management
      if (analyticsStore.length > 10000) {
        analyticsStore.splice(0, analyticsStore.length - 10000)
      }
    }
    
    // Log for debugging (remove in production)
    if (env.isDevelopment()) {
      console.log('Analytics received:', body)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  if (!env.features.analytics) {
    return NextResponse.json(
      { error: 'Analytics is disabled' },
      { status: 403 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '100')
    const timeframe = searchParams.get('timeframe') || '7d'

    const now = Date.now()
    const timeframes = {
      '1d': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    }
    
    const timeLimit = now - (timeframes[timeframe as keyof typeof timeframes] || timeframes['7d'])

    if (type === 'search') {
      // Return search analytics
      const recentSearches = searchAnalyticsStore
        .filter(s => s.timestamp >= timeLimit)
        .slice(-limit)

      // Calculate popular queries
      const queryCount: Record<string, number> = {}
      const categoryCount: Record<string, number> = {}
      const languageCount: Record<string, number> = {}

      recentSearches.forEach(search => {
        queryCount[search.query] = (queryCount[search.query] || 0) + 1
        if (search.category) {
          categoryCount[search.category] = (categoryCount[search.category] || 0) + 1
        }
        if (search.language) {
          languageCount[search.language] = (languageCount[search.language] || 0) + 1
        }
      })

      const popularQueries = Object.entries(queryCount)
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20)

      const trendingCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      const trendingLanguages = Object.entries(languageCount)
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return NextResponse.json({
        searches: recentSearches,
        summary: {
          totalSearches: recentSearches.length,
          uniqueQueries: Object.keys(queryCount).length,
          averageResults: recentSearches.reduce((sum, s) => sum + s.resultsCount, 0) / recentSearches.length || 0,
          popularQueries,
          trendingCategories,
          trendingLanguages
        }
      })
    } else {
      // Return general analytics
      let filteredData = analyticsStore

      // Filter by type if provided
      if (type) {
        filteredData = filteredData.filter(entry => entry.type === type)
      }

      // Limit results
      const limitedData = filteredData.slice(-limit)

      // Generate basic stats
      const stats = {
        total: filteredData.length,
        byType: filteredData.reduce((acc, entry) => {
          acc[entry.type] = (acc[entry.type] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        uniqueSessions: new Set(filteredData.map(entry => entry.sessionId)).size,
        dateRange: {
          from: filteredData.length > 0 ? filteredData[0].timestamp : null,
          to: filteredData.length > 0 ? filteredData[filteredData.length - 1].timestamp : null,
        }
      }

      return NextResponse.json({
        data: limitedData,
        stats,
        success: true
      })
    }
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
