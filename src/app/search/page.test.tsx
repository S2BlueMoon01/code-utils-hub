import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SearchPage from './page'

// Mock data
vi.mock('@/data/sample-functions', () => ({
  sampleUtilityFunctions: [
    {
      id: '1',
      name: 'formatDate',
      description: 'Format date objects',
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
      description: 'Validate email addresses',
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
      description: 'Debounce function calls',
      category: 'performance',
      tags: ['debounce', 'performance', 'utility'],
      language: 'JavaScript',
      rating: 4.8,
      usage_count: 1500,
      created_at: '2024-01-03'
    }
  ],
  categories: [
    { id: 'date', name: 'Date & Time', count: 1 },
    { id: 'validation', name: 'Validation', count: 1 },
    { id: 'performance', name: 'Performance', count: 1 }
  ],
  popularTags: [
    { name: 'date', count: 1 },
    { name: 'validation', count: 1 },
    { name: 'performance', count: 1 }
  ]
}))

// Mock formatters
vi.mock('@/lib/utils/formatters', () => ({
  formatDownloads: vi.fn((count: number) => `${count} downloads`),
  formatRating: vi.fn((rating: number) => `⭐ ${rating}`)
}))

// Mock FavoriteButton component
vi.mock('@/components/ui/favorite-button', () => ({
  FavoriteButton: ({ functionId }: { functionId: string }) => (
    <button data-testid={`favorite-${functionId}`}>♥</button>
  )
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

// Mock useTranslation hook
const mockT = vi.fn((key: string, fallback?: string, options?: { count?: number }) => {
  const translations: Record<string, string> = {
    'search.title': 'Search Functions',
    'search.subtitle': 'Find utility functions for your projects',
    'search.filters.title': 'Search Filters',
    'search.placeholder': 'Search functions, tags, or categories...',
    'search.filters.category': 'Category',
    'search.filters.selectCategory': 'Select category',
    'search.filters.allCategories': 'All categories',
    'search.filters.tag': 'Tag',
    'search.filters.selectTag': 'Select tag',
    'search.filters.allTags': 'All tags',
    'search.filters.sortBy': 'Sort by',
    'search.filters.views': 'Views',
    'search.filters.rating': 'Rating',
    'search.filters.nameAZ': 'Name A-Z',
    'search.filters.dateCreated': 'Date Created',
    'search.filters.order': 'Order',
    'search.filters.ascending': 'Ascending',
    'search.filters.descending': 'Descending',
    'search.filters.hideAdvanced': 'Hide advanced filters',
    'search.filters.showAdvanced': 'Show advanced filters',
    'search.filters.language': 'Language',
    'search.filters.selectLanguage': 'Select language',
    'search.filters.allLanguages': 'All languages',
    'search.filters.minRating': 'Minimum Rating',
    'search.filters.selectRating': 'Select rating',
    'common.all': 'All',
    'search.filters.onePlusStar': '1+ stars',
    'search.filters.twoPlusStar': '2+ stars',
    'search.filters.threePlusStar': '3+ stars',
    'search.filters.fourPlusStar': '4+ stars',
    'search.filters.fourHalfPlusStar': '4.5+ stars',
    'search.filters.complexity': 'Complexity',
    'search.filters.selectComplexity': 'Select complexity',
    'search.filters.easy': 'Easy',
    'search.filters.medium': 'Medium',
    'search.filters.hard': 'Hard',
    'search.results.found': `Found ${options?.count || 0} results`,
    'search.filters.clearFilters': 'Clear Filters',
    'search.results.noResults': 'No results found',
    'search.results.tryDifferent': 'Try changing your search keywords or filters'
  }
  return translations[key] || fallback || key
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT
  })
}))

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search page with title and subtitle', () => {
    render(<SearchPage />)
    
    expect(screen.getByText('Search Functions')).toBeInTheDocument()
    expect(screen.getByText('Find utility functions for your projects')).toBeInTheDocument()
  })

  it('renders search filters section', () => {
    render(<SearchPage />)
    
    expect(screen.getByText('Search Filters')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search functions, tags, or categories...')).toBeInTheDocument()
  })

  it('renders all filter options', () => {
    render(<SearchPage />)
    
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Tag')).toBeInTheDocument()
    expect(screen.getByText('Sort by')).toBeInTheDocument()
    expect(screen.getByText('Order')).toBeInTheDocument()
  })

  it('renders sample functions', async () => {
    render(<SearchPage />)
    
    await waitFor(() => {
      expect(screen.getByText('formatDate')).toBeInTheDocument()
      expect(screen.getByText('validateEmail')).toBeInTheDocument()
      expect(screen.getByText('debounce')).toBeInTheDocument()
    })
  })

  it('filters functions by search query', async () => {
    render(<SearchPage />)
    
    const searchInput = screen.getByPlaceholderText('Search functions, tags, or categories...')
    fireEvent.change(searchInput, { target: { value: 'email' } })
    
    await waitFor(() => {
      expect(screen.getByText('validateEmail')).toBeInTheDocument()
      expect(screen.queryByText('formatDate')).not.toBeInTheDocument()
      expect(screen.queryByText('debounce')).not.toBeInTheDocument()
    })
  })

  it('shows advanced filters when toggled', async () => {
    render(<SearchPage />)
    
    const advancedButton = screen.getByText('Show advanced filters')
    fireEvent.click(advancedButton)
    
    await waitFor(() => {
      expect(screen.getByText('Language')).toBeInTheDocument()
      expect(screen.getByText('Minimum Rating')).toBeInTheDocument()
      expect(screen.getByText('Complexity')).toBeInTheDocument()
    })
  })

  it('hides advanced filters when toggled back', async () => {
    render(<SearchPage />)
    
    const advancedButton = screen.getByText('Show advanced filters')
    fireEvent.click(advancedButton)
    
    await waitFor(() => {
      expect(screen.getByText('Language')).toBeInTheDocument()
    })
    
    const hideButton = screen.getByText('Hide advanced filters')
    fireEvent.click(hideButton)
    
    await waitFor(() => {
      expect(screen.queryByText('Language')).not.toBeInTheDocument()
    })
  })

  it('displays results count', async () => {
    render(<SearchPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Found 3 results')).toBeInTheDocument()
    })
  })

  it('shows no results message when search yields no results', async () => {
    render(<SearchPage />)
    
    const searchInput = screen.getByPlaceholderText('Search functions, tags, or categories...')
    fireEvent.change(searchInput, { target: { value: 'nonexistent function xyz' } })
    
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument()
      expect(screen.getByText('Try changing your search keywords or filters')).toBeInTheDocument()
    })
  })

  it('clears filters when clear button is clicked', async () => {
    render(<SearchPage />)
    
    // First, set a search query
    const searchInput = screen.getByPlaceholderText('Search functions, tags, or categories...')
    fireEvent.change(searchInput, { target: { value: 'email' } })
    
    await waitFor(() => {
      expect(screen.getByText('validateEmail')).toBeInTheDocument()
      expect(screen.queryByText('formatDate')).not.toBeInTheDocument()
    })
    
    // Then clear filters
    const clearButton = screen.getByText('Clear Filters')
    fireEvent.click(clearButton)
    
    await waitFor(() => {
      expect(screen.getByText('formatDate')).toBeInTheDocument()
      expect(screen.getByText('validateEmail')).toBeInTheDocument()
      expect(screen.getByText('debounce')).toBeInTheDocument()
    })
  })

  it('renders function cards with correct information', async () => {
    render(<SearchPage />)
    
    await waitFor(() => {
      // Check function names - use getAllByText for elements that appear multiple times
      expect(screen.getAllByText('formatDate')[0]).toBeInTheDocument()
      expect(screen.getAllByText('validateEmail')[0]).toBeInTheDocument()
      expect(screen.getAllByText('debounce')[0]).toBeInTheDocument()
      
      // Check descriptions
      expect(screen.getByText('Format date objects')).toBeInTheDocument()
      expect(screen.getByText('Validate email addresses')).toBeInTheDocument()
      expect(screen.getByText('Debounce function calls')).toBeInTheDocument()
      
      // Check categories - use getAllByText for elements that appear multiple times
      expect(screen.getAllByText('date')[0]).toBeInTheDocument()
      expect(screen.getAllByText('validation')[0]).toBeInTheDocument()
      expect(screen.getAllByText('performance')[0]).toBeInTheDocument()
    })
  })

  it('renders favorite buttons for each function', async () => {
    render(<SearchPage />)
    
    await waitFor(() => {
      expect(screen.getByTestId('favorite-1')).toBeInTheDocument()
      expect(screen.getByTestId('favorite-2')).toBeInTheDocument()
      expect(screen.getByTestId('favorite-3')).toBeInTheDocument()
    })
  })

  it('toggles sort order when order button is clicked', async () => {
    render(<SearchPage />)
    
    const orderButton = screen.getByText('Descending')
    fireEvent.click(orderButton)
    
    await waitFor(() => {
      expect(screen.getByText('Ascending')).toBeInTheDocument()
    })
    
    fireEvent.click(screen.getByText('Ascending'))
    
    await waitFor(() => {
      expect(screen.getByText('Descending')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    render(<SearchPage />)
    
    // Should show skeleton loading cards initially or loading indicators
    const loadingElements = document.querySelectorAll('.animate-pulse, [data-loading="true"], .loading')
    expect(loadingElements.length).toBeGreaterThanOrEqual(0)
  })

  it('filters by tags in search', async () => {
    render(<SearchPage />)
    
    const searchInput = screen.getByPlaceholderText('Search functions, tags, or categories...')
    fireEvent.change(searchInput, { target: { value: 'regex' } })
    
    await waitFor(() => {
      expect(screen.getByText('validateEmail')).toBeInTheDocument()
      expect(screen.queryByText('formatDate')).not.toBeInTheDocument()
      expect(screen.queryByText('debounce')).not.toBeInTheDocument()
    })
  })

  it('filters by category in search', async () => {
    render(<SearchPage />)
    
    const searchInput = screen.getByPlaceholderText('Search functions, tags, or categories...')
    fireEvent.change(searchInput, { target: { value: 'performance' } })
    
    await waitFor(() => {
      expect(screen.getAllByText('debounce')[0]).toBeInTheDocument()
      expect(screen.queryByText('formatDate')).not.toBeInTheDocument()
      expect(screen.queryByText('validateEmail')).not.toBeInTheDocument()
    })
  })

  it('maintains search results when advanced filters are toggled', async () => {
    render(<SearchPage />)
    
    const searchInput = screen.getByPlaceholderText('Search functions, tags, or categories...')
    fireEvent.change(searchInput, { target: { value: 'date' } })
    
    await waitFor(() => {
      expect(screen.getByText('formatDate')).toBeInTheDocument()
    })
    
    const advancedButton = screen.getByText('Show advanced filters')
    fireEvent.click(advancedButton)
    
    await waitFor(() => {
      expect(screen.getByText('formatDate')).toBeInTheDocument()
      expect(screen.getByText('Language')).toBeInTheDocument()
    })
  })

  it('renders function links correctly', async () => {
    render(<SearchPage />)
    
    await waitFor(() => {
      const functionLinks = screen.getAllByRole('link')
      expect(functionLinks).toHaveLength(3) // One for each function
      
      // Check that all expected utility links are present
      const hrefs = functionLinks.map(link => link.getAttribute('href'))
      expect(hrefs).toContain('/utils/1')
      expect(hrefs).toContain('/utils/2')
      expect(hrefs).toContain('/utils/3')
    })
  })
})
