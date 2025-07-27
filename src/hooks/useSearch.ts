import { useState, useCallback, useMemo } from 'react'
import Fuse from 'fuse.js'
import { UtilityFunction, SearchFilters } from '@/types'
import { sampleUtilityFunctions } from '@/data/sample-functions'

/**
 * Hook for searching utility functions
 */
export function useSearch() {
  const [results, setResults] = useState<UtilityFunction[]>(sampleUtilityFunctions)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => new Fuse(sampleUtilityFunctions, {
    keys: [
      { name: 'name', weight: 0.3 },
      { name: 'description', weight: 0.2 },
      { name: 'tags', weight: 0.2 },
      { name: 'category', weight: 0.2 },
      { name: 'author.username', weight: 0.1 }
    ],
    threshold: 0.3, // Lower threshold for more precise search
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 1,
    ignoreLocation: true
  }), [])

  const search = useCallback(async (searchFilters: SearchFilters) => {
    setIsLoading(true)
    setFilters(searchFilters)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      let filteredResults = sampleUtilityFunctions

      // Apply text search
      if (searchFilters.query && searchFilters.query.trim()) {
        const fuseResults = fuse.search(searchFilters.query)
        filteredResults = fuseResults.map(result => result.item)
        
        // If there's a text search, apply other filters to the search results
        // Apply language filter
        if (searchFilters.language && searchFilters.language.length > 0) {
          filteredResults = filteredResults.filter(func =>
            searchFilters.language!.includes(func.language)
          )
        }

        // Apply category filter
        if (searchFilters.category && searchFilters.category.length > 0) {
          filteredResults = filteredResults.filter(func =>
            searchFilters.category!.includes(func.category)
          )
        }

        // Apply difficulty filter
        if (searchFilters.difficulty && searchFilters.difficulty.length > 0) {
          filteredResults = filteredResults.filter(func =>
            searchFilters.difficulty!.includes(func.difficulty)
          )
        }

        // Apply tags filter
        if (searchFilters.tags && searchFilters.tags.length > 0) {
          filteredResults = filteredResults.filter(func =>
            searchFilters.tags!.some(tag => func.tags.includes(tag))
          )
        }
      } else {
        // No text search, just apply filters to all functions
        // Apply language filter
        if (searchFilters.language && searchFilters.language.length > 0) {
          filteredResults = filteredResults.filter(func =>
            searchFilters.language!.includes(func.language)
          )
        }

        // Apply category filter
        if (searchFilters.category && searchFilters.category.length > 0) {
          filteredResults = filteredResults.filter(func =>
            searchFilters.category!.includes(func.category)
          )
        }

        // Apply difficulty filter
        if (searchFilters.difficulty && searchFilters.difficulty.length > 0) {
          filteredResults = filteredResults.filter(func =>
            searchFilters.difficulty!.includes(func.difficulty)
          )
        }

        // Apply tags filter
        if (searchFilters.tags && searchFilters.tags.length > 0) {
          filteredResults = filteredResults.filter(func =>
            searchFilters.tags!.some(tag => func.tags.includes(tag))
          )
        }
      }

      // Apply sorting
      if (searchFilters.sort_by) {
        filteredResults.sort((a, b) => {
          let comparison = 0
          switch (searchFilters.sort_by) {
            case 'rating':
              comparison = b.rating - a.rating
              break
            case 'usage':
              comparison = b.usage_count - a.usage_count
              break
            case 'recent':
              comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              break
            case 'name':
              comparison = a.name.localeCompare(b.name)
              break
            default:
              comparison = 0
          }
          return searchFilters.sort_order === 'asc' ? -comparison : comparison
        })
      }

      setResults(filteredResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [fuse])

  const clearSearch = useCallback(() => {
    setFilters({})
    setResults(sampleUtilityFunctions)
  }, [])

  return {
    results,
    isLoading,
    filters,
    search,
    clearSearch
  }
}
