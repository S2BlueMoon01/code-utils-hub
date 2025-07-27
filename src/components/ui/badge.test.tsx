import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Badge, badgeVariants } from './badge'

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge data-testid="badge">Default Badge</Badge>)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Default Badge')
    expect(badge).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('renders with secondary variant', () => {
    render(<Badge variant="secondary" data-testid="badge">Secondary Badge</Badge>)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground')
  })

  it('renders with destructive variant', () => {
    render(<Badge variant="destructive" data-testid="badge">Destructive Badge</Badge>)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground')
  })

  it('renders with outline variant', () => {
    render(<Badge variant="outline" data-testid="badge">Outline Badge</Badge>)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('text-foreground')
  })

  it('applies base styling classes', () => {
    render(<Badge data-testid="badge">Badge</Badge>)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold'
    )
  })

  it('accepts additional className', () => {
    render(<Badge className="custom-class" data-testid="badge">Badge</Badge>)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveClass('custom-class')
  })

  it('supports custom HTML attributes', () => {
    render(<Badge id="custom-badge" data-testid="badge">Badge</Badge>)
    
    const badge = screen.getByTestId('badge')
    expect(badge).toHaveAttribute('id', 'custom-badge')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(
      <Badge 
        onClick={handleClick} 
        data-testid="clickable-badge"
      >
        Clickable Badge
      </Badge>
    )
    
    const badge = screen.getByTestId('clickable-badge')
    fireEvent.click(badge)
    expect(handleClick).toHaveBeenCalled()
  })

  describe('badgeVariants', () => {
    it('returns correct classes for default variant', () => {
      const classes = badgeVariants()
      expect(classes).toContain('bg-primary')
      expect(classes).toContain('text-primary-foreground')
    })

    it('returns correct classes for secondary variant', () => {
      const classes = badgeVariants({ variant: 'secondary' })
      expect(classes).toContain('bg-secondary')
      expect(classes).toContain('text-secondary-foreground')
    })

    it('returns correct classes for destructive variant', () => {
      const classes = badgeVariants({ variant: 'destructive' })
      expect(classes).toContain('bg-destructive')
      expect(classes).toContain('text-destructive-foreground')
    })

    it('returns correct classes for outline variant', () => {
      const classes = badgeVariants({ variant: 'outline' })
      expect(classes).toContain('text-foreground')
    })
  })

  it('renders with different content types', () => {
    render(
      <div>
        <Badge data-testid="text-badge">Text Only</Badge>
        <Badge data-testid="number-badge">{42}</Badge>
        <Badge data-testid="mixed-badge">
          <span>Mixed</span> Content
        </Badge>
      </div>
    )

    expect(screen.getByTestId('text-badge')).toHaveTextContent('Text Only')
    expect(screen.getByTestId('number-badge')).toHaveTextContent('42')
    expect(screen.getByTestId('mixed-badge')).toHaveTextContent('Mixed Content')
  })
})
