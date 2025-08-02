import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SnippetsPage from './page'

// Mock the CodeSnippetManager component
vi.mock('@/components/ui/code-snippet-manager', () => ({
  CodeSnippetManager: () => <div data-testid="code-snippet-manager">Code Snippet Manager</div>
}))

describe('SnippetsPage', () => {
  it('renders correctly', () => {
    render(<SnippetsPage />)
    
    expect(screen.getByText('Code Snippets')).toBeInTheDocument()
    expect(screen.getByText('Manage, organize, and share your code snippets with the community')).toBeInTheDocument()
    expect(screen.getByTestId('code-snippet-manager')).toBeInTheDocument()
  })

  it('has proper heading structure', () => {
    render(<SnippetsPage />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Code Snippets')
  })
})
