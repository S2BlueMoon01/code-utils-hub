import { describe, it, expect } from 'vitest'
import { useSearch } from '@/hooks/useSearch'
import { renderHook, act } from '@testing-library/react'

describe('useSearch Hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useSearch())
    
    expect(result.current.results).toHaveLength(5) // Sample data length
    expect(result.current.isLoading).toBe(false)
    expect(result.current.filters).toEqual({})
  })

  it('performs text search correctly', async () => {
    const { result } = renderHook(() => useSearch())
    
    await act(async () => {
      await result.current.search({ query: 'debounce' })
    })
    
    expect(result.current.results).toHaveLength(1)
    expect(result.current.results[0].name).toBe('debounce')
  })

  it('filters by language correctly', async () => {
    const { result } = renderHook(() => useSearch())
    
    await act(async () => {
      await result.current.search({ language: ['python'] })
    })
    
    expect(result.current.results.every(func => func.language === 'python')).toBe(true)
  })

  it('filters by category correctly', async () => {
    const { result } = renderHook(() => useSearch())
    
    await act(async () => {
      await result.current.search({ category: ['validation'] })
    })
    
    expect(result.current.results.every(func => func.category === 'validation')).toBe(true)
  })

  it('sorts results correctly', async () => {
    const { result } = renderHook(() => useSearch())
    
    await act(async () => {
      await result.current.search({ sort_by: 'rating', sort_order: 'desc' })
    })
    
    const ratings = result.current.results.map(func => func.rating)
    const sortedRatings = [...ratings].sort((a, b) => b - a)
    expect(ratings).toEqual(sortedRatings)
  })

  it('clears search correctly', () => {
    const { result } = renderHook(() => useSearch())
    
    act(() => {
      result.current.clearSearch()
    })
    
    expect(result.current.filters).toEqual({})
    expect(result.current.results).toHaveLength(5) // Back to original sample data
  })

  it('shows loading state during search', async () => {
    const { result } = renderHook(() => useSearch())
    
    act(() => {
      result.current.search({ query: 'test' })
    })
    
    expect(result.current.isLoading).toBe(true)
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 350)) // Wait for debounce
    })
    
    expect(result.current.isLoading).toBe(false)
  })
})
