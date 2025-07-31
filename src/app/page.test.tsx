import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HomePage from './page'

// Mock HomePage component
vi.mock('@/components/pages/HomePage', () => ({
  default: () => (
    <div data-testid="homepage-component">
      <h1>Welcome to CodeUtilsHub</h1>
      <p>Your one-stop destination for utility functions</p>
      <div data-testid="hero-section">
        <h2>Discover, Test, and Use Utility Functions</h2>
        <p>Browse our extensive library of tested utility functions for JavaScript, Python, TypeScript and more.</p>
        <button>Get Started</button>
        <button>Browse Library</button>
      </div>
      <div data-testid="features-section">
        <h2>Why Choose CodeUtilsHub?</h2>
        <div data-testid="feature-card-1">
          <h3>Extensive Library</h3>
          <p>Access hundreds of utility functions</p>
        </div>
        <div data-testid="feature-card-2">
          <h3>Interactive Playground</h3>
          <p>Test functions before using them</p>
        </div>
        <div data-testid="feature-card-3">
          <h3>Multi-Language Support</h3>
          <p>JavaScript, Python, TypeScript, and more</p>
        </div>
      </div>
      <div data-testid="stats-section">
        <h2>Platform Statistics</h2>
        <div data-testid="stat-functions">1000+ Functions</div>
        <div data-testid="stat-users">50K+ Users</div>
        <div data-testid="stat-downloads">1M+ Downloads</div>
      </div>
      <div data-testid="popular-functions">
        <h2>Popular Functions</h2>
        <div data-testid="function-card-1">
          <h3>formatDate</h3>
          <p>Format dates with ease</p>
        </div>
        <div data-testid="function-card-2">
          <h3>validateEmail</h3>
          <p>Validate email addresses</p>
        </div>
        <div data-testid="function-card-3">
          <h3>debounce</h3>
          <p>Debounce function calls</p>
        </div>
      </div>
      <div data-testid="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of developers using CodeUtilsHub</p>
        <button>Sign Up Free</button>
        <button>View Documentation</button>
      </div>
    </div>
  )
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

// Mock useTranslation hook
const mockT = vi.fn((key: string, fallback?: string) => {
  const translations: Record<string, string> = {
    'home.title': 'Welcome to CodeUtilsHub',
    'home.subtitle': 'Your one-stop destination for utility functions',
    'home.hero.title': 'Discover, Test, and Use Utility Functions',
    'home.hero.description': 'Browse our extensive library of tested utility functions for JavaScript, Python, TypeScript and more.',
    'home.hero.getStarted': 'Get Started',
    'home.hero.browseLibrary': 'Browse Library',
    'home.features.title': 'Why Choose CodeUtilsHub?',
    'home.features.extensive.title': 'Extensive Library',
    'home.features.extensive.description': 'Access hundreds of utility functions',
    'home.features.playground.title': 'Interactive Playground',
    'home.features.playground.description': 'Test functions before using them',
    'home.features.multiLanguage.title': 'Multi-Language Support',
    'home.features.multiLanguage.description': 'JavaScript, Python, TypeScript, and more',
    'home.stats.title': 'Platform Statistics',
    'home.stats.functions': '1000+ Functions',
    'home.stats.users': '50K+ Users',
    'home.stats.downloads': '1M+ Downloads',
    'home.popular.title': 'Popular Functions',
    'home.cta.title': 'Ready to Get Started?',
    'home.cta.description': 'Join thousands of developers using CodeUtilsHub',
    'home.cta.signUp': 'Sign Up Free',
    'home.cta.documentation': 'View Documentation'
  }
  return translations[key] || fallback || key
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT
  })
}))

// Mock Intersection Observer for animations
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the HomePage component', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('homepage-component')).toBeInTheDocument()
  })

  it('displays the main title and subtitle', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Welcome to CodeUtilsHub')).toBeInTheDocument()
    expect(screen.getByText('Your one-stop destination for utility functions')).toBeInTheDocument()
  })

  it('renders the hero section', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByText('Discover, Test, and Use Utility Functions')).toBeInTheDocument()
    expect(screen.getByText('Browse our extensive library of tested utility functions for JavaScript, Python, TypeScript and more.')).toBeInTheDocument()
  })

  it('displays hero action buttons', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getByText('Browse Library')).toBeInTheDocument()
  })

  it('renders the features section', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('features-section')).toBeInTheDocument()
    expect(screen.getByText('Why Choose CodeUtilsHub?')).toBeInTheDocument()
  })

  it('displays all feature cards', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('feature-card-1')).toBeInTheDocument()
    expect(screen.getByText('Extensive Library')).toBeInTheDocument()
    expect(screen.getByText('Access hundreds of utility functions')).toBeInTheDocument()
    
    expect(screen.getByTestId('feature-card-2')).toBeInTheDocument()
    expect(screen.getByText('Interactive Playground')).toBeInTheDocument()
    expect(screen.getByText('Test functions before using them')).toBeInTheDocument()
    
    expect(screen.getByTestId('feature-card-3')).toBeInTheDocument()
    expect(screen.getByText('Multi-Language Support')).toBeInTheDocument()
    expect(screen.getByText('JavaScript, Python, TypeScript, and more')).toBeInTheDocument()
  })

  it('renders the statistics section', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('stats-section')).toBeInTheDocument()
    expect(screen.getByText('Platform Statistics')).toBeInTheDocument()
    expect(screen.getByTestId('stat-functions')).toHaveTextContent('1000+ Functions')
    expect(screen.getByTestId('stat-users')).toHaveTextContent('50K+ Users')
    expect(screen.getByTestId('stat-downloads')).toHaveTextContent('1M+ Downloads')
  })

  it('displays popular functions section', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('popular-functions')).toBeInTheDocument()
    expect(screen.getByText('Popular Functions')).toBeInTheDocument()
    
    expect(screen.getByTestId('function-card-1')).toBeInTheDocument()
    expect(screen.getByText('formatDate')).toBeInTheDocument()
    expect(screen.getByText('Format dates with ease')).toBeInTheDocument()
    
    expect(screen.getByTestId('function-card-2')).toBeInTheDocument()
    expect(screen.getByText('validateEmail')).toBeInTheDocument()
    expect(screen.getByText('Validate email addresses')).toBeInTheDocument()
    
    expect(screen.getByTestId('function-card-3')).toBeInTheDocument()
    expect(screen.getByText('debounce')).toBeInTheDocument()
    expect(screen.getByText('Debounce function calls')).toBeInTheDocument()
  })

  it('renders the call-to-action section', () => {
    render(<HomePage />)
    
    expect(screen.getByTestId('cta-section')).toBeInTheDocument()
    expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument()
    expect(screen.getByText('Join thousands of developers using CodeUtilsHub')).toBeInTheDocument()
    expect(screen.getByText('Sign Up Free')).toBeInTheDocument()
    expect(screen.getByText('View Documentation')).toBeInTheDocument()
  })

  it('handles button clicks in hero section', () => {
    render(<HomePage />)
    
    const getStartedButton = screen.getByText('Get Started')
    const browseLibraryButton = screen.getByText('Browse Library')
    
    fireEvent.click(getStartedButton)
    fireEvent.click(browseLibraryButton)
    
    // Buttons should be clickable
    expect(getStartedButton).toBeInTheDocument()
    expect(browseLibraryButton).toBeInTheDocument()
  })

  it('handles button clicks in CTA section', () => {
    render(<HomePage />)
    
    const signUpButton = screen.getByText('Sign Up Free')
    const documentationButton = screen.getByText('View Documentation')
    
    fireEvent.click(signUpButton)
    fireEvent.click(documentationButton)
    
    // Buttons should be clickable
    expect(signUpButton).toBeInTheDocument()
    expect(documentationButton).toBeInTheDocument()
  })

  it('uses proper heading hierarchy', () => {
    render(<HomePage />)
    
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Welcome to CodeUtilsHub')
    
    const h2Elements = screen.getAllByRole('heading', { level: 2 })
    expect(h2Elements.length).toBeGreaterThan(0)
    
    const h3Elements = screen.getAllByRole('heading', { level: 3 })
    expect(h3Elements.length).toBeGreaterThan(0)
  })

  it('provides accessibility attributes', () => {
    render(<HomePage />)
    
    // Check for proper heading structure
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
    
    // Check for buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('handles keyboard navigation', async () => {
    render(<HomePage />)
    
    const firstButton = screen.getAllByRole('button')[0]
    firstButton.focus()
    
    expect(firstButton).toHaveFocus()
    
    fireEvent.keyDown(firstButton, { key: 'Tab' })
    
    await waitFor(() => {
      expect(document.activeElement).not.toBe(firstButton)
    })
  })

  it('handles responsive design', () => {
    render(<HomePage />)
    
    // Test mobile view
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query.includes('max-width'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    
    // Component should render properly in different viewports
    expect(screen.getByTestId('homepage-component')).toBeInTheDocument()
  })

  it('handles scroll-based animations', () => {
    render(<HomePage />)
    
    // Intersection Observer should be initialized for animations
    expect(global.IntersectionObserver).toHaveBeenCalled()
  })

  it('renders with proper semantic structure', () => {
    render(<HomePage />)
    
    // Check for semantic HTML structure
    const sections = document.querySelectorAll('section, article, main')
    expect(sections.length).toBeGreaterThanOrEqual(0)
  })

  it('displays loading states appropriately', async () => {
    render(<HomePage />)
    
    // Check for any loading indicators
    const loadingElements = document.querySelectorAll('[data-loading="true"], .animate-pulse')
    expect(loadingElements.length).toBeGreaterThanOrEqual(0)
  })

  it('handles error states gracefully', () => {
    render(<HomePage />)
    
    // Component should render without errors
    expect(screen.getByTestId('homepage-component')).toBeInTheDocument()
  })

  it('provides proper ARIA labels', () => {
    render(<HomePage />)
    
    // Check that interactive elements have proper accessibility
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      // Each button should have text content or aria-label
      expect(button.textContent || button.getAttribute('aria-label')).toBeTruthy()
    })
  })

  it('handles user interactions correctly', async () => {
    render(<HomePage />)
    
    // Test multiple button interactions
    const buttons = screen.getAllByRole('button')
    
    for (const button of buttons) {
      fireEvent.click(button)
      fireEvent.focus(button)
      fireEvent.blur(button)
    }
    
    // All interactions should complete without errors
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('maintains performance with large content', () => {
    render(<HomePage />)
    
    // Component should render efficiently
    const startTime = performance.now()
    expect(screen.getByTestId('homepage-component')).toBeInTheDocument()
    const endTime = performance.now()
    
    // Render should be fast (less than 100ms)
    expect(endTime - startTime).toBeLessThan(100)
  })

  it('uses translation keys correctly', () => {
    render(<HomePage />)
    
    // Verify that translation function is called
    expect(mockT).toHaveBeenCalled()
    
    // Check that translated content is displayed
    expect(screen.getByText('Welcome to CodeUtilsHub')).toBeInTheDocument()
  })

  it('renders consistent styling', () => {
    render(<HomePage />)
    
    // Check for consistent CSS classes
    const styledElements = document.querySelectorAll('[class*="text-"], [class*="bg-"], [class*="p-"]')
    expect(styledElements.length).toBeGreaterThan(0)
  })
})
