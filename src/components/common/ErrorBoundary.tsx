'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { reportError, errorMonitoring } from '@/lib/error-monitoring'
import { env } from '@/lib/environment'

interface Props {
  children: ReactNode
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void }>
  feature?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })

    // Report error to monitoring service
    reportError(error, {
      feature: this.props.feature,
      action: 'component_error',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
        errorId: this.state.errorId
      }
    })

    // Add breadcrumb for debugging
    errorMonitoring.addBreadcrumb(
      `Error boundary caught error in ${this.props.feature || 'unknown'} feature`,
      'error',
      {
        errorMessage: error.message,
        errorStack: error.stack,
        componentStack: errorInfo.componentStack
      }
    )

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log to console in development
    if (env.isDevelopment()) {
      console.group('🚨 Error Boundary Caught Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Component Stack:', errorInfo.componentStack)
      console.groupEnd()
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })

    // Track retry action
    errorMonitoring.addBreadcrumb(
      'User retried after error',
      'user',
      {
        feature: this.props.feature,
        errorId: this.state.errorId
      }
    )
  }

  handleReportBug = () => {
    const { error, errorInfo, errorId } = this.state
    
    // Create bug report data
    const bugReport = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      feature: this.props.feature,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    }

    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(bugReport, null, 2))
      .then(() => {
        alert('Bug report copied to clipboard! Please paste it in your bug report.')
      })
      .catch(() => {
        console.error('Failed to copy bug report to clipboard')
      })

    // Track bug report action
    errorMonitoring.addBreadcrumb(
      'User requested bug report',
      'user',
      {
        feature: this.props.feature,
        errorId
      }
    )
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback component if provided
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent
        return (
          <FallbackComponent 
            error={this.state.error!} 
            retry={this.handleRetry} 
          />
        )
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                We encountered an unexpected error. This has been automatically reported to our team.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {env.isDevelopment() && this.state.error && (
                <Alert>
                  <Bug className="h-4 w-4" />
                  <AlertDescription className="font-mono text-xs">
                    {this.state.error.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>

                {env.isDevelopment() && (
                  <Button 
                    variant="outline" 
                    onClick={this.handleReportBug}
                    className="w-full"
                  >
                    <Bug className="mr-2 h-4 w-4" />
                    Copy Bug Report
                  </Button>
                )}
              </div>

              {this.state.errorId && (
                <div className="text-center text-xs text-muted-foreground">
                  Error ID: {this.state.errorId}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Functional wrapper for use with hooks
interface FunctionalErrorBoundaryProps extends Props {
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
}

export function FunctionalErrorBoundary({ 
  children, 
  fallback, 
  ...props 
}: FunctionalErrorBoundaryProps) {
  return (
    <ErrorBoundary fallbackComponent={fallback} {...props}>
      {children}
    </ErrorBoundary>
  )
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  feature?: string,
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary 
        feature={feature} 
        fallbackComponent={fallbackComponent}
      >
        <Component {...props} />
      </ErrorBoundary>
    )
  }

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

export default ErrorBoundary
