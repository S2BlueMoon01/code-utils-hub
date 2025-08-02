'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, CheckCircle, AlertCircle, Play } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent } from './card'
import { Badge } from './badge'

interface PythonStatusProps {
  onInitialize?: () => void
  showDetails?: boolean
}

export function PythonStatus({ onInitialize, showDetails = true }: PythonStatusProps) {
  const [status, setStatus] = useState<{
    loading: boolean
    ready: boolean
    error?: string
  }>({ loading: false, ready: false })

  const [packages, setPackages] = useState<string[]>([])

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    let interval: NodeJS.Timeout;

    const initializeStatus = async () => {
      try {
        const { pythonRuntime } = await import('@/lib/python-runtime');
        
        // Check initial status
        const initialStatus = pythonRuntime.getLoadingStatus()
        setStatus(initialStatus)

        // Poll for status updates
        interval = setInterval(() => {
          const currentStatus = pythonRuntime.getLoadingStatus()
          setStatus(prevStatus => {
            if (prevStatus.loading !== currentStatus.loading || 
                prevStatus.ready !== currentStatus.ready) {
              return currentStatus
            }
            return prevStatus
          })

          // If ready, get available packages
          if (currentStatus.ready && packages.length === 0) {
            setPackages(pythonRuntime.getAvailablePackages())
          }
        }, 500)
      } catch (error) {
        setStatus({ loading: false, ready: false, error: 'Failed to load Python runtime' });
      }
    };

    initializeStatus();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [packages.length])

  const handleInitialize = async () => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Python runtime is only available in the browser');
      }
      
      const { pythonRuntime } = await import('@/lib/python-runtime');
      setStatus({ loading: true, ready: false })
      await pythonRuntime.initialize()
      setStatus({ loading: false, ready: true })
      setPackages(pythonRuntime.getAvailablePackages())
      onInitialize?.()
    } catch (error) {
      setStatus({ 
        loading: false, 
        ready: false, 
        error: error instanceof Error ? error.message : 'Failed to initialize Python runtime'
      })
    }
  }

  if (status.ready) {
    return showDetails ? (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Python Runtime Ready
            </span>
            <Badge variant="secondary" className="text-xs">
              Pyodide v0.24.1
            </Badge>
          </div>
          
          {packages.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Available packages: {packages.slice(0, 8).join(', ')}
                {packages.length > 8 && ` +${packages.length - 8} more`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    ) : (
      <div className="flex items-center gap-2 text-sm">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="text-green-700 dark:text-green-400">Python Ready</span>
      </div>
    )
  }

  if (status.loading) {
    return showDetails ? (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm font-medium">
              Initializing Python Runtime...
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Loading Pyodide and essential packages. This may take a moment.
          </p>
        </CardContent>
      </Card>
    ) : (
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <span>Loading Python...</span>
      </div>
    )
  }

  if (status.error) {
    return showDetails ? (
      <Card className="mb-4 border-red-200 dark:border-red-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-700 dark:text-red-400">
              Python Runtime Error
            </span>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 mb-3">
            {status.error}
          </p>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleInitialize}
            className="text-red-700 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
          >
            Retry Initialization
          </Button>
        </CardContent>
      </Card>
    ) : (
      <div className="flex items-center gap-2 text-sm">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span className="text-red-700 dark:text-red-400">Python Error</span>
        <Button size="sm" variant="ghost" onClick={handleInitialize}>
          Retry
        </Button>
      </div>
    )
  }

  // Not initialized yet
  return showDetails ? (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium mb-1">Python Runtime</p>
            <p className="text-xs text-muted-foreground">
              Click to initialize Python execution with Pyodide
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={handleInitialize}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Initialize Python
          </Button>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Button 
      size="sm" 
      variant="outline"
      onClick={handleInitialize}
      className="flex items-center gap-2"
    >
      <Play className="h-4 w-4" />
      Initialize Python
    </Button>
  )
}
