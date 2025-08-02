// Simple analytics tracking without external dependencies
interface AnalyticsEvent {
  name: string
  properties?: Record<string, string | number | boolean>
  timestamp?: Date
}

interface PageView {
  path: string
  title: string
  timestamp: Date
  userAgent?: string
  referrer?: string
}

class SimpleAnalytics {
  private events: AnalyticsEvent[] = []
  private pageViews: PageView[] = []
  private sessionId: string
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.initSession()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initSession() {
    if (typeof window !== 'undefined') {
      // Track initial page load
      this.trackPageView(window.location.pathname, document.title)
      
      // Track page navigation
      const originalPushState = history.pushState
      const originalReplaceState = history.replaceState
      
      history.pushState = (...args) => {
        originalPushState.apply(history, args)
        this.trackPageView(window.location.pathname, document.title)
      }
      
      history.replaceState = (...args) => {
        originalReplaceState.apply(history, args)
        this.trackPageView(window.location.pathname, document.title)
      }
      
      // Track back/forward button
      window.addEventListener('popstate', () => {
        this.trackPageView(window.location.pathname, document.title)
      })
    }
  }

  trackPageView(path: string, title: string) {
    const pageView: PageView = {
      path,
      title,
      timestamp: new Date(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    }
    
    this.pageViews.push(pageView)
    this.sendAnalytics('pageview', { path, title })
  }

  trackEvent(name: string, properties?: Record<string, string | number | boolean>) {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: new Date(),
    }
    
    this.events.push(event)
    this.sendAnalytics('event', { name, ...properties })
  }

  // Feature-specific tracking methods
  trackCodeExecution(language: string, success: boolean) {
    this.trackEvent('code_execution', {
      language,
      success,
      session: this.sessionId,
    })
  }

  trackSnippetAction(action: 'create' | 'edit' | 'delete' | 'like' | 'view', snippetId: string) {
    this.trackEvent('snippet_action', {
      action,
      snippetId,
      session: this.sessionId,
    })
  }

  trackSearch(query: string, resultsCount: number) {
    this.trackEvent('search', {
      query,
      resultsCount,
      session: this.sessionId,
    })
  }

  trackUtilityFunction(functionId: string, action: 'view' | 'copy' | 'download') {
    this.trackEvent('utility_function', {
      functionId,
      action,
      session: this.sessionId,
    })
  }

  private async sendAnalytics(type: string, data: Record<string, unknown>) {
    // Only send in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Analytics (dev):', type, data)
      return
    }

    try {
      // Send to our own analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          data,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }

  // Get analytics data (for dashboard)
  getStats() {
    return {
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      totalPageViews: this.pageViews.length,
      events: this.events,
      pageViews: this.pageViews,
    }
  }
}

// Singleton instance
export const analytics = new SimpleAnalytics()

// React hook for easy usage
export function useAnalytics() {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackCodeExecution: analytics.trackCodeExecution.bind(analytics),
    trackSnippetAction: analytics.trackSnippetAction.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackUtilityFunction: analytics.trackUtilityFunction.bind(analytics),
  }
}
