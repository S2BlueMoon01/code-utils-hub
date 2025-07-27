import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './footer'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('Footer', () => {
  it('renders the footer content', () => {
    render(<Footer />)

    // Check for brand name
    expect(screen.getByText('CodeUtilsHub')).toBeInTheDocument()
    
    // Check for copyright text
    expect(screen.getByText(/© 2024 CodeUtilsHub\. All rights reserved\./)).toBeInTheDocument()
  })

  it('renders footer navigation links', () => {
    render(<Footer />)

    // Check for main navigation links
    expect(screen.getByText('Utils Library')).toBeInTheDocument()
    expect(screen.getByText('Playground')).toBeInTheDocument()
    expect(screen.getByText('API')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
  })

  it('renders social media and additional links', () => {
    render(<Footer />)

    // Check for additional links
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText('Privacy')).toBeInTheDocument()
    expect(screen.getByText('Terms')).toBeInTheDocument()
  })

  it('has correct href attributes for navigation links', () => {
    render(<Footer />)

    expect(screen.getByText('Utils Library').closest('a')).toHaveAttribute('href', '/utils')
    expect(screen.getByText('Playground').closest('a')).toHaveAttribute('href', '/playground')
    expect(screen.getByText('API').closest('a')).toHaveAttribute('href', '/api')
    expect(screen.getByText('Pricing').closest('a')).toHaveAttribute('href', '/pricing')
  })

  it('has correct href attributes for additional links', () => {
    render(<Footer />)

    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
    expect(screen.getByText('Contact').closest('a')).toHaveAttribute('href', '/contact')
    expect(screen.getByText('Privacy').closest('a')).toHaveAttribute('href', '/privacy')
    expect(screen.getByText('Terms').closest('a')).toHaveAttribute('href', '/terms')
  })

  it('has proper semantic structure', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('displays social media icons', () => {
    render(<Footer />)

    // Check for social media links (assuming they exist in the footer)
    const socialLinks = screen.getAllByRole('link')
    expect(socialLinks.length).toBeGreaterThan(0)
  })

  it('renders footer in a responsive layout', () => {
    render(<Footer />)

    // Footer should have proper container styling
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('border-t')
  })
})
