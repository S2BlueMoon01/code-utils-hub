'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, Trash2, RefreshCw, HardDrive, Calendar, FileText } from 'lucide-react'
import { 
  getStorageStats, 
  getStorageUsage, 
  cleanupExpiredEntries, 
  cleanupOldEntries,
  clearAllPlaygroundStorage,
  getAllStorageEntries,
  type StorageStats,
  type StorageEntry
} from '@/lib/storage-manager'

export function StorageManager() {
  const [stats, setStats] = useState<StorageStats | null>(null)
  const [usage, setUsage] = useState<{ used: string; percentage: number; available: string } | null>(null)
  const [entries, setEntries] = useState<StorageEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    setStats(getStorageStats())
    setUsage(getStorageUsage())
    setEntries(getAllStorageEntries())
  }

  useEffect(() => {
    refreshData()
  }, [])

  const handleCleanupExpired = async () => {
    setIsLoading(true)
    const cleaned = cleanupExpiredEntries()
    alert(`Cleaned up ${cleaned} expired entries`)
    refreshData()
    setIsLoading(false)
  }

  const handleCleanupOld = async () => {
    setIsLoading(true)
    const cleaned = cleanupOldEntries(7 * 24 * 60 * 60 * 1000) // 7 days
    alert(`Cleaned up ${cleaned} old entries`)
    refreshData()
    setIsLoading(false)
  }

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all playground storage? This action cannot be undone.')) {
      setIsLoading(true)
      const removed = clearAllPlaygroundStorage()
      alert(`Cleared ${removed} storage entries`)
      refreshData()
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getTypeColor = (type: StorageEntry['type']) => {
    switch (type) {
      case 'playground': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'persisted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (!stats || !usage) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          Loading storage information...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Storage Overview
          </CardTitle>
          <CardDescription>
            Monitor and manage your playground storage usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Storage Used</span>
              <span>{usage.used} ({usage.percentage}%)</span>
            </div>
            <Progress value={usage.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {usage.available} available
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalEntries}</div>
              <div className="text-xs text-muted-foreground">Total Entries</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.playgroundEntries}</div>
              <div className="text-xs text-muted-foreground">Playground</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.persistedEntries}</div>
              <div className="text-xs text-muted-foreground">Persisted</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.expiredEntries}</div>
              <div className="text-xs text-muted-foreground">Expired</div>
            </div>
          </div>

          {/* Date Range */}
          {stats.oldestEntry && stats.newestEntry && (
            <div className="text-sm text-muted-foreground">
              <p>
                <Calendar className="w-4 h-4 inline mr-1" />
                Oldest: {formatDate(stats.oldestEntry)} | 
                Newest: {formatDate(stats.newestEntry)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cleanup Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Storage Cleanup
          </CardTitle>
          <CardDescription>
            Clean up old and expired storage entries to free up space
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleCleanupExpired} 
              disabled={isLoading || stats.expiredEntries === 0}
              variant="outline"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Clean Expired ({stats.expiredEntries})
            </Button>
            
            <Button 
              onClick={handleCleanupOld} 
              disabled={isLoading}
              variant="outline"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Clean Old (7+ days)
            </Button>
            
            <Button 
              onClick={handleClearAll} 
              disabled={isLoading || stats.totalEntries === 0}
              variant="destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Storage
            </Button>
            
            <Button 
              onClick={refreshData} 
              disabled={isLoading}
              variant="ghost"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Storage Entries ({entries.length})
          </CardTitle>
          <CardDescription>
            Detailed view of all storage entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No storage entries found
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {entries.map((entry) => (
                <div 
                  key={entry.key} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getTypeColor(entry.type)}>
                        {entry.type}
                      </Badge>
                      <span className="text-sm font-medium truncate">
                        {entry.key}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Size: {(entry.size / 1024).toFixed(1)} KB | 
                      Modified: {formatDate(entry.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
