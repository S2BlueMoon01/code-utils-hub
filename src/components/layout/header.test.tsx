import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { Header } from './header'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock next-themes
vi.mock('next-themes', async () => {
  const actual = await vi.importActual('next-themes')
  return {
    ...actual,
    useTheme: () => ({
      theme: 'light',
      setTheme: vi.fn(),
      resolvedTheme: 'light',
    }),
  }
})

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'navigation.home': 'Home',
        'navigation.search': 'Search', 
        'navigation.utils': 'Utils Library',
        'navigation.playground': 'Playground',
        'navigation.generator': 'Generator',
        'navigation.storage': 'Storage',
        'navigation.favorites': 'Favorites',
        'navigation.blog': 'Blog',
        'navigation.contribute': 'Contribute',
        'navigation.docs': 'Docs',
        'navigation.about': 'About',
        'navigation.analytics': 'Analytics',
        'navigation.faq': 'FAQ',
        'navigation.login': 'Login',
        'navigation.logout': 'Logout',
        'navigation.signup': 'Sign Up',
        'header.search.placeholder': 'Search functions, tags, or categories...',
        'search.placeholder': 'Search functions, tags, or categories...'
      }
      return translations[key] || key
    }
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn()
  }
}))

// Mock auth store
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: null,
    profile: null,
    loading: false
  })
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    {children}
  </ThemeProvider>
)

describe('Header', () => {
  it('renders the main navigation elements', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    // Check for logo/brand
    expect(screen.getByText('CodeUtilsHub')).toBeInTheDocument()
    
    // Check for navigation links
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Utils Library')).toBeInTheDocument()
    expect(screen.getByText('Playground')).toBeInTheDocument()
    expect(screen.getByText('Contribute')).toBeInTheDocument()
  })

  it('renders the search bar', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    const searchInput = screen.getByPlaceholderText('Search functions, tags, or categories...')
    expect(searchInput).toBeInTheDocument()
  })

  it('handles search input changes', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    const searchInput = screen.getByPlaceholderText('Search functions, tags, or categories...')
    fireEvent.change(searchInput, { target: { value: 'test search' } })
    
    expect(searchInput).toHaveValue('test search')
  })

  it('renders theme toggle button', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
    expect(themeToggle).toBeInTheDocument()
  })

  it('renders mobile menu button on smaller screens', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    // Mobile menu button should be present (though may not be visible on larger screens)
    const mobileMenuButton = screen.getByRole('button', { name: /toggle menu/i })
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    
    const searchInput = screen.getByPlaceholderText('Search functions, tags, or categories...')
    expect(searchInput).toHaveAttribute('type', 'search')
  })

  it('navigation links have correct href attributes', () => {
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/')
    expect(screen.getByText('Utils Library').closest('a')).toHaveAttribute('href', '/utils')
    expect(screen.getByText('Playground').closest('a')).toHaveAttribute('href', '/playground')
    expect(screen.getByText('Contribute').closest('a')).toHaveAttribute('href', '/contribute')
  })
})
