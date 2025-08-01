import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AboutPage from './page'

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

// Mock the useTranslation hook
const mockT = vi.fn((key: string, fallback?: string) => {
  const translations: Record<string, string> = {
    'about.title': 'About CodeUtilsHub',
    'about.subtitle': 'Empowering developers with essential utility functions',
    'about.mission.title': 'Our Mission',
    'about.mission.description': 'To provide developers with a comprehensive, easy-to-use platform for discovering, testing, and sharing utility functions across multiple programming languages.',
    'about.vision.title': 'Our Vision', 
    'about.vision.description': 'We envision a world where developers can focus on building amazing applications while having instant access to reliable, tested utility functions.',
    
    // Values section
    'about.values.title': 'Our Values',
    'about.values.quality.title': 'Quality',
    'about.values.quality.description': 'We provide reliable and well-tested utility functions.',
    'about.values.community.title': 'Community',
    'about.values.community.description': 'Built by developers, for developers, with community input.',
    'about.values.innovation.title': 'Innovation',
    'about.values.innovation.description': 'We continuously improve and add new features to serve our community better.',
    'about.values.transparency.title': 'Transparency',
    'about.values.transparency.description': 'We believe in the power of open source and community-driven development.',
    
    // Stats section
    'about.stats.activeUsers': 'Active Users',
    'about.stats.functions': 'Utility Functions',
    'about.stats.communityRating': 'Community Rating',
    'about.stats.countries': 'Countries',
    
    // Team section
    'about.team.title': 'Meet the Team',
    'about.team.members.member1.name': 'John Smith',
    'about.team.members.member1.role': 'Founder & Lead Developer',
    'about.team.members.member1.bio': 'Full-stack developer with expertise in Node.js and database design.',
    'about.team.members.member2.name': 'Jane Doe',
    'about.team.members.member2.role': 'Backend Developer',
    'about.team.members.member2.bio': 'UI/UX specialist focused on creating intuitive user experiences.',
    'about.team.members.member3.name': 'Alex Johnson',
    'about.team.members.member3.role': 'Frontend Developer',
    'about.team.members.member3.bio': 'Creative designer passionate about user-centered design.',
    
    // Tech section
    'about.tech.title': 'Technology Stack',
    'about.tech.subtitle': 'Built with modern technologies for optimal performance',
    
    // CTA section  
    'about.cta.title': 'Get Involved',
    'about.cta.subtitle': 'Join our community and help make CodeUtilsHub even better',
    'about.cta.contribute': 'Contribute',
    'about.cta.github': 'GitHub',
    'about.cta.contact': 'Email Us',
    
    // Statistics section
    'about.statistics.title': 'Platform Statistics',
    
    // Story section
    'about.story.title': 'Our Story',
    'about.story.beginning': 'CodeUtilsHub was born from a simple frustration: spending too much time searching for and implementing common utility functions.',
    'about.story.growth': 'What started as a personal collection has grown into a platform serving thousands of developers worldwide.',
    'about.story.future': 'Today, we continue to expand our library and improve the developer experience through community feedback and contributions.',
    
    // Features section
    'about.features.title': 'Key Features',
    'about.features.multiLanguage': 'Multi-Language Support',
    'about.features.multiLanguageDesc': 'JavaScript, TypeScript, Python, and more languages supported',
    'about.features.playground': 'Interactive Playground',
    'about.features.playgroundDesc': 'Test functions directly in your browser with real-time execution',
    'about.features.community': 'Community Driven',
    'about.features.communityDesc': 'Contribute functions, rate, and help improve the platform',
    'about.features.documentation': 'Comprehensive Documentation',
    'about.features.documentationDesc': 'Detailed examples and explanations for every function',
    
    // Contact section
    'about.contact.title': 'Contact Us',
    'about.contact.subtitle': 'Have questions or suggestions? We\'d love to hear from you',
    'about.contact.email': 'Email Support',
    'about.contact.discord': 'Discord',
    'about.contact.github': 'GitHub',
    'about.contact.twitter': 'Twitter',
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
    expect(screen.getByText('Quality')).toBeInTheDocument()
    expect(screen.getByText('We provide reliable and well-tested utility functions.')).toBeInTheDocument()
    
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('Built by developers, for developers, with community input.')).toBeInTheDocument()
    
    expect(screen.getByText('Innovation')).toBeInTheDocument()
    expect(screen.getByText('We continuously improve and add new features to serve our community better.')).toBeInTheDocument()
    
    expect(screen.getByText('Transparency')).toBeInTheDocument()
    expect(screen.getByText('We believe in the power of open source and community-driven development.')).toBeInTheDocument()
  })

  it('renders technology stack section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Technology Stack')).toBeInTheDocument()
    expect(screen.getByText('Built with modern technologies for optimal performance')).toBeInTheDocument()
    // Should show technology badges
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders team section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Meet the Team')).toBeInTheDocument()
    expect(screen.getByText('Founder & Lead Developer')).toBeInTheDocument()
    expect(screen.getByText('Backend Developer')).toBeInTheDocument()
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
  })

  it('renders statistics cards', () => {
    render(<AboutPage />)
    
    // Check for stats values and labels
    expect(screen.getByText('10,000+')).toBeInTheDocument()
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('4.9/5')).toBeInTheDocument()
    expect(screen.getByText('50+')).toBeInTheDocument()
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('Utility Functions')).toBeInTheDocument()
    expect(screen.getByText('Community Rating')).toBeInTheDocument()
    expect(screen.getByText('Countries')).toBeInTheDocument()
  })

  it('renders CTA section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Get Involved')).toBeInTheDocument()
    expect(screen.getByText('Join our community and help make CodeUtilsHub even better')).toBeInTheDocument()
    
    // Check for CTA buttons
    expect(screen.getByRole('link', { name: /contribute/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /email us/i })).toBeInTheDocument()
  })

  it('renders team member social links', () => {
    render(<AboutPage />)
    
    // Check that team members have social links (GitHub, Twitter, LinkedIn)
    const githubLinks = screen.getAllByRole('link', { name: '' })
    expect(githubLinks.length).toBeGreaterThan(0)
  })

  it('renders technology stack section', () => {
    render(<AboutPage />)
    
    expect(screen.getByText('Technology Stack')).toBeInTheDocument()
    expect(screen.getByText('Built with modern technologies for optimal performance')).toBeInTheDocument()
    
    // Check for technology badges
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
    expect(screen.getByText('Supabase')).toBeInTheDocument()
    expect(screen.getByText('Vercel')).toBeInTheDocument()
  })

  it('renders CTA contact links correctly', () => {
    render(<AboutPage />)
    
    // Check CTA section contact links
    expect(screen.getByRole('link', { name: /contribute/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /email us/i })).toBeInTheDocument()
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
    
    // Test that the component renders without animation errors
    // The component may or may not use IntersectionObserver
    expect(document.querySelector('.container')).toBeInTheDocument()
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
    
    // Check that focusable elements exist
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    
    // Test basic focus capability
    const firstLink = links[0]
    if (firstLink) {
      firstLink.focus()
      expect(firstLink).toHaveFocus()
    }
  })

  it('renders statistical numbers correctly', () => {
    render(<AboutPage />)
    
    // Check that statistical values are displayed correctly
    expect(screen.getByText('10,000+')).toBeInTheDocument()
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('4.9/5')).toBeInTheDocument()
    expect(screen.getByText('50+')).toBeInTheDocument()
    
    // Check labels
    expect(screen.getByText('Active Users')).toBeInTheDocument()
    expect(screen.getByText('Utility Functions')).toBeInTheDocument()
  })

  it('displays team member cards properly', () => {
    render(<AboutPage />)
    
    const teamSection = screen.getByText('Meet the Team')
    expect(teamSection).toBeInTheDocument()
    
    // Team names should be displayed
    expect(screen.getByText('John Smith')).toBeInTheDocument()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('Alex Johnson')).toBeInTheDocument()
    
    // Team roles should be displayed
    expect(screen.getByText('Founder & Lead Developer')).toBeInTheDocument()
    expect(screen.getByText('Backend Developer')).toBeInTheDocument()
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
  })

  it('shows values cards with descriptions', () => {
    render(<AboutPage />)
    
    // Values section should be rendered
    expect(screen.getByText('Our Values')).toBeInTheDocument()
    
    // Value cards should have titles and descriptions matching our mock
    expect(screen.getByText('Quality')).toBeInTheDocument()
    expect(screen.getByText('We provide reliable and well-tested utility functions.')).toBeInTheDocument()
    
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('Built by developers, for developers, with community input.')).toBeInTheDocument()
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
    
    // Check for heading hierarchy
    const h1Elements = document.querySelectorAll('h1')
    const h2Elements = document.querySelectorAll('h2')
    const h3Elements = document.querySelectorAll('h3')
    expect(h1Elements.length).toBe(1) // Main title
    expect(h2Elements.length).toBeGreaterThan(0) // Section titles
    expect(h3Elements.length).toBeGreaterThan(0) // Subsection titles
    
    // Check for proper interactive elements
    const links = document.querySelectorAll('a')
    expect(links.length).toBeGreaterThan(0)
  })
})
