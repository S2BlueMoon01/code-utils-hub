import { NextRequest, NextResponse } from 'next/server'

interface AnalyticsData {
  type: string
  data: Record<string, unknown>
  sessionId: string
  timestamp: string
}

// In-memory storage for demo (in production, use a database)
const analyticsStore: AnalyticsData[] = []

export async function POST(request: NextRequest) {
  try {
    const body: AnalyticsData = await request.json()
    
    // Validate required fields
    if (!body.type || !body.sessionId || !body.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Add additional metadata
    const analyticsEntry: AnalyticsData = {
      ...body,
      timestamp: new Date().toISOString(), // Override with server time
    }

    // Store the analytics data
    analyticsStore.push(analyticsEntry)
    
    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics received:', analyticsEntry)
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
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '100')

    let filteredData = analyticsStore

    // Filter by session if provided
    if (sessionId) {
      filteredData = filteredData.filter(entry => entry.sessionId === sessionId)
    }

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
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
