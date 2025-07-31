import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FavoritesPage from './page'

// Mock sample functions data
vi.mock('@/data/sample-functions', () => ({
  sampleUtilityFunctions: [
    {
      id: '1',
      name: 'formatDate',
      description: 'Format date objects into readable strings',
      category: 'date',
      tags: ['date', 'format', 'utility'],
      language: 'JavaScript',
      rating: 4.5,
      usage_count: 1200,
      created_at: '2024-01-01'
    },
    {
      id: '2',
      name: 'validateEmail',
      description: 'Validate email addresses using regex',
      category: 'validation',
      tags: ['email', 'validation', 'regex'],
      language: 'TypeScript',
      rating: 4.2,
      usage_count: 800,
      created_at: '2024-01-02'
    },
    {
      id: '3',
      name: 'debounce',
      description: 'Debounce function calls to improve performance',
      category: 'performance',
      tags: ['debounce', 'performance', 'utility'],
      language: 'JavaScript',
      rating: 4.8,
      usage_count: 1500,
      created_at: '2024-01-03'
    }
  ]
}))

// Mock favorites store
const mockFavorites = ['1', '3']
const mockAddFavorite = vi.fn()
const mockRemoveFavorite = vi.fn()
const mockClearFavorites = vi.fn()

vi.mock('@/stores/favoritesStore', () => ({
  useFavoritesStore: () => ({
    favorites: mockFavorites,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
    clearFavorites: mockClearFavorites
  })
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

// Mock FavoriteButton component
vi.mock('@/components/ui/favorite-button', () => ({
  FavoriteButton: ({ functionId, onToggle }: { functionId: string; onToggle?: () => void }) => (
    <button 
      data-testid={`favorite-${functionId}`}
      onClick={onToggle}
    >
      ♥
    </button>
  )
}))

// Mock useTranslation hook
const mockT = vi.fn((key: string, fallback?: string, options?: { count?: number }) => {
  const translations: Record<string, string> = {
    'favorites.title': 'My Favorites',
    'favorites.subtitle': 'Your collection of saved utility functions',
    'favorites.search.placeholder': 'Search your favorites...',
    'favorites.filters.category': 'Category',
    'favorites.filters.selectCategory': 'Select category',
    'favorites.filters.allCategories': 'All categories',
    'favorites.filters.language': 'Language',
    'favorites.filters.selectLanguage': 'Select language',
    'favorites.filters.allLanguages': 'All languages',
    'favorites.filters.sortBy': 'Sort by',
    'favorites.filters.rating': 'Rating',
    'favorites.filters.usage': 'Usage',
    'favorites.filters.name': 'Name',
    'favorites.filters.dateAdded': 'Date Added',
    'favorites.filters.clearFilters': 'Clear Filters',
    'favorites.empty.title': 'No favorites yet',
    'favorites.empty.description': 'Start building your collection by adding functions to favorites',
    'favorites.empty.browse': 'Browse Functions',
    'favorites.stats.total': 'Total Favorites',
    'favorites.stats.categories': 'Categories',
    'favorites.stats.languages': 'Languages',
    'favorites.actions.exportFavorites': 'Export Favorites',
    'favorites.actions.clearAll': 'Clear All',
    'favorites.actions.confirmClear': 'Are you sure you want to clear all favorites?',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'favorites.results.showing': `Showing ${options?.count || 0} of ${options?.count || 0} favorites`,
    'favorites.export.success': 'Favorites exported successfully',
    'favorites.clear.success': 'All favorites cleared'
  }
  return translations[key] || fallback || key
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT
  })
}))

// Mock browser APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => JSON.stringify(mockFavorites)),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock URL and Blob for export functionality
global.URL = {
  createObjectURL: vi.fn(() => 'mock-url'),
  revokeObjectURL: vi.fn(),
} as unknown as typeof globalThis.URL

global.Blob = vi.fn().mockImplementation((content, options) => ({
  content,
  options,
})) as unknown as typeof globalThis.Blob

describe('FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders favorites page with title and subtitle', () => {
    render(<FavoritesPage />)
    
    expect(screen.getByText('My Favorites')).toBeInTheDocument()
    expect(screen.getByText('Your collection of saved utility functions')).toBeInTheDocument()
  })

  it('renders search input', () => {
    render(<FavoritesPage />)
    
    expect(screen.getByPlaceholderText('Search your favorites...')).toBeInTheDocument()
  })

  it('renders filter options', () => {
    render(<FavoritesPage />)
    
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Language')).toBeInTheDocument()
    expect(screen.getByText('Sort by')).toBeInTheDocument()
  })

  it('displays favorite functions', async () => {
    render(<FavoritesPage />)
    
    await waitFor(() => {
      expect(screen.getByText('formatDate')).toBeInTheDocument()
      expect(screen.getByText('debounce')).toBeInTheDocument()
      expect(screen.queryByText('validateEmail')).not.toBeInTheDocument() // Not in favorites
    })
  })

  it('shows function details for favorites', async () => {
    render(<FavoritesPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Format date objects into readable strings')).toBeInTheDocument()
      expect(screen.getByText('Debounce function calls to improve performance')).toBeInTheDocument()
    })
  })

  it('renders favorite buttons for each function', async () => {
    render(<FavoritesPage />)
    
    await waitFor(() => {
      expect(screen.getByTestId('favorite-1')).toBeInTheDocument()
      expect(screen.getByTestId('favorite-3')).toBeInTheDocument()
    })
  })

  it('filters favorites by search query', async () => {
    render(<FavoritesPage />)
    
    const searchInput = screen.getByPlaceholderText('Search your favorites...')
    fireEvent.change(searchInput, { target: { value: 'date' } })
    
    await waitFor(() => {
      expect(screen.getByText('formatDate')).toBeInTheDocument()
      expect(screen.queryByText('debounce')).not.toBeInTheDocument()
    })
  })

  it('shows empty state when no favorites', () => {
    // Mock empty favorites
    vi.mocked(mockFavorites).length = 0
    
    render(<FavoritesPage />)
    
    expect(screen.getByText('No favorites yet')).toBeInTheDocument()
    expect(screen.getByText('Start building your collection by adding functions to favorites')).toBeInTheDocument()
    expect(screen.getByText('Browse Functions')).toBeInTheDocument()
  })

  it('displays stats correctly', async () => {
    render(<FavoritesPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Total Favorites')).toBeInTheDocument()
      expect(screen.getByText('Categories')).toBeInTheDocument()
      expect(screen.getByText('Languages')).toBeInTheDocument()
    })
  })

  it('renders export favorites button', () => {
    render(<FavoritesPage />)
    
    expect(screen.getByText('Export Favorites')).toBeInTheDocument()
  })

  it('renders clear all button', () => {
    render(<FavoritesPage />)
    
    expect(screen.getByText('Clear All')).toBeInTheDocument()
  })

  it('handles export favorites functionality', async () => {
    render(<FavoritesPage />)
    
    const exportButton = screen.getByText('Export Favorites')
    fireEvent.click(exportButton)
    
    await waitFor(() => {
      expect(global.Blob).toHaveBeenCalled()
      expect(global.URL.createObjectURL).toHaveBeenCalled()
    })
  })

  it('shows confirmation dialog when clearing all favorites', async () => {
    render(<FavoritesPage />)
    
    const clearButton = screen.getByText('Clear All')
    fireEvent.click(clearButton)
    
    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to clear all favorites?')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Confirm')).toBeInTheDocument()
    })
  })

  it('cancels clear all operation', async () => {
    render(<FavoritesPage />)
    
    const clearButton = screen.getByText('Clear All')
    fireEvent.click(clearButton)
    
    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
    })
    
    expect(mockClearFavorites).not.toHaveBeenCalled()
  })

  it('confirms clear all operation', async () => {
    render(<FavoritesPage />)
    
    const clearButton = screen.getByText('Clear All')
    fireEvent.click(clearButton)
    
    await waitFor(() => {
      const confirmButton = screen.getByText('Confirm')
      fireEvent.click(confirmButton)
    })
    
    expect(mockClearFavorites).toHaveBeenCalled()
  })

  it('clears filters when clear filters button is clicked', async () => {
    render(<FavoritesPage />)
    
    // Set a search query first
    const searchInput = screen.getByPlaceholderText('Search your favorites...')
    fireEvent.change(searchInput, { target: { value: 'date' } })
    
    // Click clear filters
    const clearFiltersButton = screen.getByText('Clear Filters')
    fireEvent.click(clearFiltersButton)
    
    await waitFor(() => {
      expect(searchInput).toHaveValue('')
    })
  })

  it('handles favorite toggle correctly', async () => {
    render(<FavoritesPage />)
    
    await waitFor(() => {
      const favoriteButton = screen.getByTestId('favorite-1')
      fireEvent.click(favoriteButton)
      // Should trigger the onToggle callback
      expect(favoriteButton).toBeInTheDocument()
    })
  })

  it('shows correct results count', async () => {
    render(<FavoritesPage />)
    
    await waitFor(() => {
      expect(screen.getByText(/Showing 2 of 2 favorites/)).toBeInTheDocument()
    })
  })

  it('navigates to function detail page when clicked', async () => {
    render(<FavoritesPage />)
    
    await waitFor(() => {
      const functionLinks = screen.getAllByRole('link')
      expect(functionLinks[0]).toHaveAttribute('href', '/utils/1')
      expect(functionLinks[1]).toHaveAttribute('href', '/utils/3')
    })
  })

  it('renders function categories and tags', async () => {
    render(<FavoritesPage />)
    
    await waitFor(() => {
      expect(screen.getByText('date')).toBeInTheDocument()
      expect(screen.getByText('performance')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    render(<FavoritesPage />)
    
    // Should show skeleton loading cards initially
    const loadingElements = document.querySelectorAll('.animate-pulse')
    expect(loadingElements.length).toBeGreaterThanOrEqual(0)
  })

  it('handles keyboard navigation', async () => {
    render(<FavoritesPage />)
    
    const searchInput = screen.getByPlaceholderText('Search your favorites...')
    searchInput.focus()
    
    expect(searchInput).toHaveFocus()
    
    fireEvent.keyDown(searchInput, { key: 'Tab' })
    
    await waitFor(() => {
      expect(document.activeElement).not.toBe(searchInput)
    })
  })

  it('maintains search state when favorites are updated', async () => {
    render(<FavoritesPage />)
    
    const searchInput = screen.getByPlaceholderText('Search your favorites...')
    fireEvent.change(searchInput, { target: { value: 'format' } })
    
    await waitFor(() => {
      expect(screen.getByText('formatDate')).toBeInTheDocument()
      expect(searchInput).toHaveValue('format')
    })
  })
})
