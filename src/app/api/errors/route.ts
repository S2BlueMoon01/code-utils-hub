import { NextRequest, NextResponse } from 'next/server'
import { errorMonitoring } from '@/lib/error-monitoring'
import { env } from '@/lib/environment'

interface ErrorReportRequest {
  message: string
  stack?: string
  url: string
  userAgent: string
  timestamp: number
  userId?: string
  feature?: string
  action?: string
  metadata?: Record<string, unknown>
  level: 'error' | 'warning' | 'info' | 'debug'
}

export async function POST(request: NextRequest) {
  try {
    const body: ErrorReportRequest = await request.json()

    // Validate required fields
    if (!body.message || !body.url || !body.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: message, url, timestamp' },
        { status: 400 }
      )
    }

    // Create error object
    const error = new Error(body.message)
    if (body.stack) {
      error.stack = body.stack
    }

    // Report error
    errorMonitoring.reportError({
      error,
      context: {
        userId: body.userId,
        userAgent: body.userAgent,
        url: body.url,
        timestamp: body.timestamp,
        feature: body.feature,
        action: body.action,
        metadata: {
          source: 'client_report',
          ...body.metadata
        }
      },
      level: body.level
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Error reported successfully' 
    })

  } catch (error) {
    console.error('Error in error reporting endpoint:', error)
    
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    )
  }
}

// GET endpoint for error statistics (development only)
export async function GET() {
  if (!env.isDevelopment()) {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    )
  }

  // Return basic error statistics
  // This is a simple implementation - in production you'd want to
  // fetch this from your error monitoring service
  return NextResponse.json({
    message: 'Error monitoring is active',
    environment: env.app.env,
    timestamp: Date.now()
  })
}
