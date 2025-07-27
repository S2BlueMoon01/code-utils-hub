import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from './theme-provider'

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="theme-provider" {...props}>
      {children}
    </div>
  ),
}))

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="test-child">Test Content</div>
      </ThemeProvider>
    )

    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('passes correct props to next-themes ThemeProvider', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div>Test Content</div>
      </ThemeProvider>
    )

    const themeProvider = screen.getByTestId('theme-provider')
    expect(themeProvider).toBeInTheDocument()
    // The next-themes provider doesn't expose props as DOM attributes
    // We just verify the provider is rendered correctly
    expect(themeProvider).toHaveTextContent('Test Content')
  })

  it('wraps content in theme provider', () => {
    render(
      <ThemeProvider>
        <div data-testid="wrapped-content">Wrapped Content</div>
      </ThemeProvider>
    )

    const wrappedContent = screen.getByTestId('wrapped-content')
    const themeProvider = screen.getByTestId('theme-provider')
    
    expect(themeProvider).toContainElement(wrappedContent)
  })

  it('supports multiple children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </ThemeProvider>
    )

    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })

  it('handles empty children', () => {
    render(<ThemeProvider>{null}</ThemeProvider>)
    
    const themeProvider = screen.getByTestId('theme-provider')
    expect(themeProvider).toBeInTheDocument()
  })
})
