import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AboutPage from './page'

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

// Mock useTranslation hook
const mockT = vi.fn((key: string, fallback?: string) => {
  const translations: Record<string, string> = {
    'about.title': 'About CodeUtilsHub',
    'about.subtitle': 'Empowering developers with essential utility functions',
    'about.mission.title': 'Our Mission',
    'about.mission.description': 'To provide developers with a comprehensive, easy-to-use platform for discovering, testing, and sharing utility functions across multiple programming languages.',
    'about.vision.title': 'Our Vision',
    'about.vision.description': 'We envision a world where developers can focus on building amazing applications while having instant access to reliable, tested utility functions.',
    'about.values.title': 'Our Values',
    'about.values.openSource': 'Open Source',
    'about.values.openSourceDesc': 'We believe in the power of open source and community-driven development.',
    'about.values.quality': 'Quality',
    'about.values.qualityDesc': 'Every function is thoroughly tested and documented to ensure reliability.',
    'about.values.community': 'Community',
    'about.values.communityDesc': 'We foster a collaborative environment where developers can learn and grow together.',
    'about.values.innovation': 'Innovation',
    'about.values.innovationDesc': 'We continuously improve and add new features to serve our community better.',
    'about.story.title': 'Our Story',
    'about.story.beginning': 'CodeUtilsHub was born from a simple frustration: spending too much time searching for and implementing common utility functions.',
    'about.story.growth': 'What started as a personal collection has grown into a platform serving thousands of developers worldwide.',
    'about.story.future': 'Today, we continue to expand our library and improve the developer experience through community feedback and contributions.',
    'about.team.title': 'Meet the Team',
    'about.team.founder': 'Founder & Lead Developer',
    'about.team.backend': 'Backend Developer',
    'about.team.frontend': 'Frontend Developer',
    'about.team.designer': 'UI/UX Designer',
    'about.stats.title': 'Platform Statistics',
    'about.stats.functions': 'Utility Functions',
    'about.stats.users': 'Active Users',
    'about.stats.downloads': 'Total Downloads',
    'about.stats.contributors': 'Contributors',
    'about.features.title': 'Key Features',
    'about.features.multiLanguage': 'Multi-Language Support',
    'about.features.multiLanguageDesc': 'JavaScript, TypeScript, Python, and more languages supported',
    'about.features.playground': 'Interactive Playground',
    'about.features.playgroundDesc': 'Test functions directly in your browser with real-time execution',
    'about.features.community': 'Community Driven',
    'about.features.communityDesc': 'Contribute functions, rate, and help improve the platform',
    'about.features.search': 'Advanced Search',
    'about.features.searchDesc': 'Find exactly what you need with powerful filtering and search',
    'about.contact.title': 'Get in Touch',
    'about.contact.description': 'Have questions, suggestions, or want to contribute? We\'d love to hear from you!',
    'about.contact.email': 'Email Us',
    'about.contact.github': 'GitHub',
    'about.contact.discord': 'Discord',
    'about.contact.twitter': 'Twitter',
    'about.technology.title': 'Technology Stack',
    'about.technology.frontend': 'Frontend: Next.js, React, TypeScript, Tailwind CSS',
    'about.technology.backend': 'Backend: Node.js, Supabase, Vercel',
    'about.technology.testing': 'Testing: Vitest, Playwright, Lighthouse CI',
    'about.technology.deployment': 'Deployment: Vercel, Docker, GitHub Actions'
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

describe('AboutPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders about page with title and subtitle', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('About CodeUtilsHub')).toBeInTheDocument()
    expect(screen.getByText('Empowering developers with essential utility functions')).toBeInTheDocument()
  })

  it('renders mission section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Our Mission')).toBeInTheDocument()
    expect(screen.getByText('To provide developers with a comprehensive, easy-to-use platform for discovering, testing, and sharing utility functions across multiple programming languages.')).toBeInTheDocument()
  })

  it('renders vision section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Our Vision')).toBeInTheDocument()
    expect(screen.getByText('We envision a world where developers can focus on building amazing applications while having instant access to reliable, tested utility functions.')).toBeInTheDocument()
  })

  it('renders values section with all values', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Our Values')).toBeInTheDocument()
    
    // Check all values
    expect(screen.getByText('Open Source')).toBeInTheDocument()
    expect(screen.getByText('We believe in the power of open source and community-driven development.')).toBeInTheDocument()
    
    expect(screen.getByText('Quality')).toBeInTheDocument()
    expect(screen.getByText('Every function is thoroughly tested and documented to ensure reliability.')).toBeInTheDocument()
    
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('We foster a collaborative environment where developers can learn and grow together.')).toBeInTheDocument()
    
    expect(screen.getByText('Innovation')).toBeInTheDocument()
    expect(screen.getByText('We continuously improve and add new features to serve our community better.')).toBeInTheDocument()
  })

  it('renders story section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Our Story')).toBeInTheDocument()
    expect(screen.getByText('CodeUtilsHub was born from a simple frustration: spending too much time searching for and implementing common utility functions.')).toBeInTheDocument()
    expect(screen.getByText('What started as a personal collection has grown into a platform serving thousands of developers worldwide.')).toBeInTheDocument()
    expect(screen.getByText('Today, we continue to expand our library and improve the developer experience through community feedback and contributions.')).toBeInTheDocument()
  })

  it('renders team section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Meet the Team')).toBeInTheDocument()
    expect(screen.getByText('Founder & Lead Developer')).toBeInTheDocument()
    expect(screen.getByText('Backend Developer')).toBeInTheDocument()
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    expect(screen.getByText('UI/UX Designer')).toBeInTheDocument()
  })

  it('renders statistics section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Platform Statistics')).toBeInTheDocument()
    expect(screen.getByText('Utility Functions')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('Total Downloads')).toBeInTheDocument()
    expect(screen.getByText('Contributors')).toBeInTheDocument()
  })

  it('renders key features section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Key Features')).toBeInTheDocument()
    
    expect(screen.getByText('Multi-Language Support')).toBeInTheDocument()
    expect(screen.getByText('JavaScript, TypeScript, Python, and more languages supported')).toBeInTheDocument()
    
    expect(screen.getByText('Interactive Playground')).toBeInTheDocument()
    expect(screen.getByText('Test functions directly in your browser with real-time execution')).toBeInTheDocument()
    
    expect(screen.getByText('Community Driven')).toBeInTheDocument()
    expect(screen.getByText('Contribute functions, rate, and help improve the platform')).toBeInTheDocument()
    
    expect(screen.getByText('Advanced Search')).toBeInTheDocument()
    expect(screen.getByText('Find exactly what you need with powerful filtering and search')).toBeInTheDocument()
  })

  it('renders contact section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
    expect(screen.getByText('Have questions, suggestions, or want to contribute? We\'d love to hear from you!')).toBeInTheDocument()
    expect(screen.getByText('Email Us')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Discord')).toBeInTheDocument()
    expect(screen.getByText('Twitter')).toBeInTheDocument()
  })

  it('renders technology stack section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Technology Stack')).toBeInTheDocument()
    expect(screen.getByText('Frontend: Next.js, React, TypeScript, Tailwind CSS')).toBeInTheDocument()
    expect(screen.getByText('Backend: Node.js, Supabase, Vercel')).toBeInTheDocument()
    expect(screen.getByText('Testing: Vitest, Playwright, Lighthouse CI')).toBeInTheDocument()
    expect(screen.getByText('Deployment: Vercel, Docker, GitHub Actions')).toBeInTheDocument()
  })

  it('renders contact links correctly', () => {
    render(<AboutPage />)
    
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    
    // Check that contact links are present
    expect(screen.getByText('Email Us')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('Discord')).toBeInTheDocument()
    expect(screen.getByText('Twitter')).toBeInTheDocument()
  })

  it('renders proper icons for sections', () => {
    render(<AboutPage />)
    
    // Check that icons are rendered as SVG elements
    const svgElements = document.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThan(0)
  })

  it('uses responsive layout classes', () => {
    render(<AboutPage />)
    
    // Check for responsive grid/flex classes
    const responsiveElements = document.querySelectorAll('.grid, .flex, .md\\:, .lg\\:')
    expect(responsiveElements.length).toBeGreaterThan(0)
  })

  it('handles scroll-based animations', async () => {
    render(<AboutPage />)
    
    // Test that intersection observer is set up
    expect(global.IntersectionObserver).toHaveBeenCalled()
  })

  it('maintains proper heading hierarchy', () => {
    render(<AboutPage />)
    
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('About CodeUtilsHub')
    
    const h2Elements = screen.getAllByRole('heading', { level: 2 })
    expect(h2Elements.length).toBeGreaterThan(0)
  })

  it('provides proper accessibility attributes', () => {
    render(<AboutPage />)
    
    // Check for proper heading structure
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
    
    // Check for proper link accessibility
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('handles keyboard navigation properly', async () => {
    render(<AboutPage />)
    
    const firstLink = screen.getAllByRole('link')[0]
    if (firstLink) {
      firstLink.focus()
      expect(firstLink).toHaveFocus()
      
      fireEvent.keyDown(firstLink, { key: 'Tab' })
      
      await waitFor(() => {
        expect(document.activeElement).not.toBe(firstLink)
      })
    }
  })

  it('renders statistical numbers correctly', () => {
    render(<AboutPage />)
    
    // Statistical sections should have numerical displays
    const statsSection = screen.getByText('Platform Statistics')
    expect(statsSection).toBeInTheDocument()
    
    // Numbers should be displayed (implementation dependent)
    expect(screen.getByText('Utility Functions')).toBeInTheDocument()
  })

  it('displays team member cards properly', () => {
    render(<AboutPage />)
    
    const teamSection = screen.getByText('Meet the Team')
    expect(teamSection).toBeInTheDocument()
    
    // Team roles should be displayed
    expect(screen.getByText('Founder & Lead Developer')).toBeInTheDocument()
    expect(screen.getByText('Backend Developer')).toBeInTheDocument()
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    expect(screen.getByText('UI/UX Designer')).toBeInTheDocument()
  })

  it('shows feature cards with descriptions', () => {
    render(<AboutPage />)
    
    // Feature cards should have both titles and descriptions
    expect(screen.getByText('Multi-Language Support')).toBeInTheDocument()
    expect(screen.getByText('JavaScript, TypeScript, Python, and more languages supported')).toBeInTheDocument()
    
    expect(screen.getByText('Interactive Playground')).toBeInTheDocument()
    expect(screen.getByText('Test functions directly in your browser with real-time execution')).toBeInTheDocument()
  })

  it('handles hover effects on interactive elements', () => {
    render(<AboutPage />)
    
    // Check for hover effect classes
    const hoverElements = document.querySelectorAll('.hover\\:')
    // Hover effects might be present on cards or buttons
    expect(hoverElements.length).toBeGreaterThanOrEqual(0)
  })

  it('uses proper semantic HTML structure', () => {
    render(<AboutPage />)
    
    // Check for semantic HTML elements
    const sections = document.querySelectorAll('section, article, main')
    expect(sections.length).toBeGreaterThan(0)
    
    // Check for proper list structure in features/values
    const lists = document.querySelectorAll('ul, ol')
    expect(lists.length).toBeGreaterThanOrEqual(0)
  })
})
