"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.handleRetry} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  retry: () => void
}

function DefaultErrorFallback({ error, retry }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Oops! Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          
          {isDevelopment && error && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm font-medium mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={retry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Specific error boundaries for different sections
export function PlaygroundErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ retry }) => (
        <Card className="h-96 flex items-center justify-center">
          <CardContent className="text-center space-y-4">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <div>
              <h3 className="font-semibold">Playground Error</h3>
              <p className="text-sm text-muted-foreground">
                Failed to load the code playground
              </p>
            </div>
            <Button onClick={retry} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}
      onError={(error, errorInfo) => {
        console.error('Playground error:', error, errorInfo)
        // Could send to error reporting service
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export function SearchErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ retry }) => (
        <div className="text-center py-8 space-y-4">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold">Search Error</h3>
            <p className="text-sm text-muted-foreground">
              Unable to perform search operation
            </p>
          </div>
          <Button onClick={retry} size="sm" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Search Again
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Handled error:', error, errorInfo)
    
    // Could integrate with error reporting service like Sentry
    if (typeof window !== 'undefined') {
      // Browser-specific error handling
      window.dispatchEvent(new CustomEvent('app-error', { 
        detail: { error, errorInfo } 
      }))
    }
  }
}
