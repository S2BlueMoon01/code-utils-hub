/**
 * Advanced localStorage management utilities
 */

export interface StorageStats {
  totalEntries: number
  totalSize: number
  playgroundEntries: number
  persistedEntries: number
  expiredEntries: number
  oldestEntry: Date | null
  newestEntry: Date | null
}

export interface StorageEntry {
  key: string
  size: number
  timestamp: Date
  type: 'playground' | 'persisted' | 'other'
  data?: Record<string, unknown>
}

/**
 * Get comprehensive storage statistics
 */
export function getStorageStats(): StorageStats {
  const stats: StorageStats = {
    totalEntries: 0,
    totalSize: 0,
    playgroundEntries: 0,
    persistedEntries: 0,
    expiredEntries: 0,
    oldestEntry: null,
    newestEntry: null
  }

  if (typeof window === 'undefined' || !window.localStorage) {
    return stats
  }

  const now = Date.now()
  const playgroundExpiry = 30 * 60 * 1000 // 30 minutes
  const persistExpiry = 24 * 60 * 60 * 1000 // 24 hours

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue

    const value = localStorage.getItem(key)
    if (!value) continue

    stats.totalEntries++
    stats.totalSize += new Blob([value]).size

    try {
      if (key === 'playground-shared-code') {
        const data = JSON.parse(value) as Record<string, { timestamp: number }>
        Object.values(data).forEach((item) => {
          stats.playgroundEntries++
          const timestamp = new Date(item.timestamp)
          updateDateRange(stats, timestamp)
          
          if (now - item.timestamp > playgroundExpiry) {
            stats.expiredEntries++
          }
        })
      } else if (key.startsWith('playground-persist-')) {
        stats.persistedEntries++
        const data = JSON.parse(value) as { timestamp: number }
        const timestamp = new Date(data.timestamp)
        updateDateRange(stats, timestamp)
        
        if (now - data.timestamp > persistExpiry) {
          stats.expiredEntries++
        }
      }
    } catch {
      // Skip invalid JSON entries
    }
  }

  return stats
}

/**
 * Get all storage entries with details
 */
export function getAllStorageEntries(): StorageEntry[] {
  const entries: StorageEntry[] = []

  if (typeof window === 'undefined' || !window.localStorage) {
    return entries
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue

    const value = localStorage.getItem(key)
    if (!value) continue

    const entry: StorageEntry = {
      key,
      size: new Blob([value]).size,
      timestamp: new Date(),
      type: 'other'
    }

    try {
      if (key === 'playground-shared-code') {
        entry.type = 'playground'
        const data = JSON.parse(value) as Record<string, { timestamp: number }>
        entry.data = data
        // Use the newest timestamp from the data
        const timestamps = Object.values(data).map((item) => item.timestamp)
        if (timestamps.length > 0) {
          entry.timestamp = new Date(Math.max(...timestamps))
        }
      } else if (key.startsWith('playground-persist-')) {
        entry.type = 'persisted'
        const data = JSON.parse(value) as { timestamp: number }
        entry.data = data
        entry.timestamp = new Date(data.timestamp)
      }
    } catch {
      // Keep as 'other' type for invalid JSON
    }

    entries.push(entry)
  }

  return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

/**
 * Clean up expired entries
 */
export function cleanupExpiredEntries(): number {
  let cleanedCount = 0

  if (typeof window === 'undefined' || !window.localStorage) {
    return cleanedCount
  }

  const now = Date.now()
  const playgroundExpiry = 30 * 60 * 1000 // 30 minutes
  const persistExpiry = 24 * 60 * 60 * 1000 // 24 hours

  // Clean playground shared code
  try {
    const playgroundData = localStorage.getItem('playground-shared-code')
    if (playgroundData) {
      const data = JSON.parse(playgroundData) as Record<string, { timestamp: number }>
      const originalCount = Object.keys(data).length
      
      Object.keys(data).forEach(id => {
        if (now - data[id].timestamp > playgroundExpiry) {
          delete data[id]
          cleanedCount++
        }
      })

      if (Object.keys(data).length !== originalCount) {
        localStorage.setItem('playground-shared-code', JSON.stringify(data))
      }
    }
  } catch {
    console.error('Failed to cleanup playground shared code')
  }

  // Clean persisted entries
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key || !key.startsWith('playground-persist-')) continue

    try {
      const value = localStorage.getItem(key)
      if (value) {
        const data = JSON.parse(value) as { timestamp: number }
        if (now - data.timestamp > persistExpiry) {
          keysToRemove.push(key)
          cleanedCount++
        }
      }
    } catch {
      // Remove invalid entries too
      keysToRemove.push(key)
      cleanedCount++
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key))

  return cleanedCount
}

/**
 * Clear all playground-related storage
 */
export function clearAllPlaygroundStorage(): number {
  let removedCount = 0

  if (typeof window === 'undefined' || !window.localStorage) {
    return removedCount
  }

  // Remove main playground storage
  if (localStorage.getItem('playground-shared-code')) {
    localStorage.removeItem('playground-shared-code')
    removedCount++
  }

  // Remove all persisted entries
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('playground-persist-')) {
      keysToRemove.push(key)
    }
  }

  keysToRemove.forEach(key => {
    localStorage.removeItem(key)
    removedCount++
  })

  return removedCount
}

/**
 * Get storage usage in human-readable format
 */
export function getStorageUsage(): { used: string; percentage: number; available: string } {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { used: '0 B', percentage: 0, available: 'Unknown' }
  }

  let totalSize = 0
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) {
      const value = localStorage.getItem(key)
      if (value) {
        totalSize += new Blob([key + value]).size
      }
    }
  }

  // Typical localStorage limit is 5-10MB, we'll assume 5MB
  const limit = 5 * 1024 * 1024 // 5MB
  const percentage = (totalSize / limit) * 100
  const available = limit - totalSize

  return {
    used: formatBytes(totalSize),
    percentage: Math.round(percentage * 100) / 100,
    available: formatBytes(available)
  }
}

/**
 * Clean up old entries based on age
 */
export function cleanupOldEntries(maxAge: number = 7 * 24 * 60 * 60 * 1000): number {
  let cleanedCount = 0

  if (typeof window === 'undefined' || !window.localStorage) {
    return cleanedCount
  }

  const cutoffTime = Date.now() - maxAge

  // Clean playground shared code
  try {
    const playgroundData = localStorage.getItem('playground-shared-code')
    if (playgroundData) {
      const data = JSON.parse(playgroundData) as Record<string, { timestamp: number }>
      const originalCount = Object.keys(data).length
      
      Object.keys(data).forEach(id => {
        if (data[id].timestamp < cutoffTime) {
          delete data[id]
          cleanedCount++
        }
      })

      if (Object.keys(data).length !== originalCount) {
        localStorage.setItem('playground-shared-code', JSON.stringify(data))
      }
    }
  } catch {
    console.error('Failed to cleanup old playground data')
  }

  // Clean old persisted entries
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key || !key.startsWith('playground-persist-')) continue

    try {
      const value = localStorage.getItem(key)
      if (value) {
        const data = JSON.parse(value) as { timestamp: number }
        if (data.timestamp < cutoffTime) {
          keysToRemove.push(key)
          cleanedCount++
        }
      }
    } catch {
      // Remove invalid entries too
      keysToRemove.push(key)
      cleanedCount++
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key))

  return cleanedCount
}

/**
 * Auto cleanup on app start
 */
export function autoCleanup(): void {
  if (typeof window === 'undefined') return

  // Run cleanup when the page loads
  setTimeout(() => {
    const expired = cleanupExpiredEntries()
    const old = cleanupOldEntries()
    
    if (expired > 0 || old > 0) {
      console.log(`Storage cleanup: removed ${expired} expired entries and ${old} old entries`)
    }
  }, 1000)
}

/**
 * Helper functions
 */
function updateDateRange(stats: StorageStats, timestamp: Date): void {
  if (!stats.oldestEntry || timestamp < stats.oldestEntry) {
    stats.oldestEntry = timestamp
  }
  if (!stats.newestEntry || timestamp > stats.newestEntry) {
    stats.newestEntry = timestamp
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
