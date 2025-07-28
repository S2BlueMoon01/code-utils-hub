/**
 * Utility functions for sharing code between generator and playground
 */

import { autoCleanup } from './storage-manager'

// Auto cleanup on module load
if (typeof window !== 'undefined') {
  autoCleanup()
}

export interface PlaygroundCodeData {
  id: string
  language: string
  code: string
  timestamp: number
  functionName?: string
  description?: string
}

const STORAGE_KEY = 'playground-shared-code'
const STORAGE_EXPIRY = 30 * 60 * 1000 // 30 minutes

/**
 * Store code data for playground sharing
 */
export function storePlaygroundCode(data: Omit<PlaygroundCodeData, 'id' | 'timestamp'>): string {
  const id = generateId()
  const codeData: PlaygroundCodeData = {
    ...data,
    id,
    timestamp: Date.now()
  }
  
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage not available, using fallback')
      return id
    }

    const existingData = getStoredData()
    existingData[id] = codeData
    
    // Clean up expired entries
    cleanupExpiredEntries(existingData)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData))
    return id
  } catch (error) {
    console.error('Failed to store playground code:', error)
    return id // Return ID anyway so app doesn't break
  }
}

/**
 * Retrieve code data by ID
 */
export function getPlaygroundCode(id: string): PlaygroundCodeData | null {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }

    const data = getStoredData()
    const codeData = data[id]
    
    if (!codeData) return null
    
    // Check if expired
    if (Date.now() - codeData.timestamp > STORAGE_EXPIRY) {
      delete data[id]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return null
    }
    
    return codeData
  } catch (error) {
    console.error('Failed to retrieve playground code:', error)
    return null
  }
}

/**
 * Clear specific code data
 */
export function clearPlaygroundCode(id: string): void {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const data = getStoredData()
    delete data[id]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to clear playground code:', error)
  }
}

/**
 * Store code in localStorage for persistence across sessions
 */
export function persistPlaygroundCode(id: string, code: string, language: string): void {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const persistKey = `playground-persist-${id}`
    const persistData = {
      code,
      language,
      timestamp: Date.now()
    }
    localStorage.setItem(persistKey, JSON.stringify(persistData))
  } catch (error) {
    console.error('Failed to persist playground code:', error)
  }
}

/**
 * Get persisted code from localStorage
 */
export function getPersistedCode(id: string): { code: string; language: string } | null {
  try {
    const persistKey = `playground-persist-${id}`
    const stored = localStorage.getItem(persistKey)
    if (stored) {
      const data = JSON.parse(stored)
      // Check if not too old (24 hours)
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        return { code: data.code, language: data.language }
      } else {
        localStorage.removeItem(persistKey)
      }
    }
    return null
  } catch (error) {
    console.error('Failed to get persisted code:', error)
    return null
  }
}

/**
 * Clear persisted code
 */
export function clearPersistedCode(id: string): void {
  try {
    const persistKey = `playground-persist-${id}`
    localStorage.removeItem(persistKey)
  } catch (error) {
    console.error('Failed to clear persisted code:', error)
  }
}

/**
 * Get all stored data
 */
function getStoredData(): Record<string, PlaygroundCodeData> {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      return {}
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to parse stored data:', error)
    return {}
  }
}

/**
 * Clean up expired entries
 */
function cleanupExpiredEntries(data: Record<string, PlaygroundCodeData>): void {
  const now = Date.now()
  Object.keys(data).forEach(id => {
    if (now - data[id].timestamp > STORAGE_EXPIRY) {
      delete data[id]
    }
  })
}

/**
 * Generate a unique ID for code sharing
 */
function generateId(): string {
  return `code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Convenience function to store code for playground use
 */
export function storeCodeInPlayground(data: { code: string; language: string }): string {
  return storePlaygroundCode({
    ...data,
    functionName: 'Generated Code',
    description: 'Code sent from generator'
  })
}
