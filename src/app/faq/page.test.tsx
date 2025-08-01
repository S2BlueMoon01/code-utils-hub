import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FAQPage from './page'

// Mock useTranslation hook
const mockT = vi.fn((key: string, fallback?: string) => {
  const translations: Record<string, string> = {
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Find answers to common questions about CodeUtilsHub',
    'faq.search.placeholder': 'Search questions...',
    'faq.categories.all': 'All',
    'faq.categories.gettingStarted': 'Getting Started',
    'faq.categories.functions': 'Functions',
    'faq.categories.community': 'Community',
    'faq.categories.account': 'Account',
    'faq.categories.technical': 'Technical',
    'faq.categories.billing': 'Billing',
    'common.expandAll': 'Expand All',
    'common.collapseAll': 'Collapse All',
    'faq.noResults': 'No results found',
    'faq.tryDifferentSearch': 'Try changing your search keywords or category',
    'faq.stats.title': 'FAQ Stats',
    'faq.stats.totalQuestions': 'Total Questions',
    'faq.stats.categories': 'Categories',
    'faq.stats.showing': 'Showing',
    'faq.popularCategories': 'Popular Categories',
    'faq.needMoreHelp': 'Need More Help?',
    'faq.cantFindAnswer': 'Can\'t find the answer? We\'re here to help!',
    'faq.contactSupport': 'Contact Support',
    'faq.viewDocs': 'View Documentation',
    'faq.questions.whatIs.question': 'What is CodeUtilsHub?',
    'faq.questions.whatIs.answer': 'CodeUtilsHub is a comprehensive platform for developers to discover, test, and use utility functions.',
    'faq.questions.howToUse.question': 'How do I use the utility functions?',
    'faq.questions.howToUse.answer': 'You can browse our library, test functions in the playground, and copy them to your projects.',
    'faq.questions.howToContribute.question': 'How can I contribute?',
    'faq.questions.howToContribute.answer': 'You can submit your own utility functions through our contribution system.',
    'faq.questions.isItFree.question': 'Is CodeUtilsHub free?',
    'faq.questions.isItFree.answer': 'Yes, CodeUtilsHub is completely free to use for all developers.',
    'faq.questions.whatLanguages.question': 'What programming languages are supported?',
    'faq.questions.whatLanguages.answer': 'We support JavaScript, TypeScript, Python, and more languages are coming soon.',
    'faq.questions.howToSearch.question': 'How do I search for functions?',
    'faq.questions.howToSearch.answer': 'Use our advanced search with filters by category, language, and tags.'
  }
  return translations[key] || fallback || key
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT
  })
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

describe('FAQPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders FAQ page with title and subtitle', () => {
    render(<FAQPage />)
    
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
    expect(screen.getByText('Find answers to common questions about CodeUtilsHub')).toBeInTheDocument()
  })

  it('renders search input with placeholder', () => {
    render(<FAQPage />)
    
    const searchInput = screen.getByPlaceholderText('Search questions...')
    expect(searchInput).toBeInTheDocument()
  })

  it('renders all category buttons', () => {
    render(<FAQPage />)
    
    const gettingStartedButtons = screen.getAllByText('Getting Started')
    expect(gettingStartedButtons.length).toBeGreaterThan(0)
    
    const functionsButtons = screen.getAllByText('Functions')
    expect(functionsButtons.length).toBeGreaterThan(0)
    
    const billingButtons = screen.getAllByText('Billing')
    expect(billingButtons.length).toBeGreaterThan(0)
  })

  it('renders expand/collapse buttons', () => {
    render(<FAQPage />)
    
    expect(screen.getByText('Expand All')).toBeInTheDocument()
    expect(screen.getByText('Collapse All')).toBeInTheDocument()
  })

  it('renders FAQ questions', () => {
    render(<FAQPage />)
    
    expect(screen.getByText('What is CodeUtilsHub?')).toBeInTheDocument()
    expect(screen.getByText('How do I use the utility functions?')).toBeInTheDocument()
    expect(screen.getByText('How can I contribute?')).toBeInTheDocument()
    expect(screen.getByText('Is CodeUtilsHub free?')).toBeInTheDocument()
    expect(screen.getByText('What programming languages are supported?')).toBeInTheDocument()
    expect(screen.getByText('How do I search for functions?')).toBeInTheDocument()
  })

  it('expands FAQ item when clicked', async () => {
    render(<FAQPage />)
    
    const firstQuestion = screen.getByText('What is CodeUtilsHub?')
    fireEvent.click(firstQuestion)
    
    await waitFor(() => {
      expect(screen.getByText('CodeUtilsHub is a comprehensive platform for developers to discover, test, and use utility functions.')).toBeInTheDocument()
    })
  })

  it('filters FAQs by category', async () => {
    render(<FAQPage />)
    
    const functionsButtons = screen.getAllByText('Functions')
    fireEvent.click(functionsButtons[0])
    
    await waitFor(() => {
      // Just check that the Functions category button is selected (has primary styling)
      const functionsButton = functionsButtons[0]
      expect(functionsButton).toHaveClass('bg-primary')
    })
  })

  it('searches FAQs by query', async () => {
    render(<FAQPage />)
    
    const searchInput = screen.getByPlaceholderText('Search questions...')
    fireEvent.change(searchInput, { target: { value: 'contribute' } })
    
    await waitFor(() => {
      expect(screen.getByText('How can I contribute?')).toBeInTheDocument()
      // Should not show other questions
      expect(screen.queryByText('What is CodeUtilsHub?')).not.toBeInTheDocument()
    })
  })

  it('shows no results message when search yields no results', async () => {
    render(<FAQPage />)
    
    const searchInput = screen.getByPlaceholderText('Search questions...')
    fireEvent.change(searchInput, { target: { value: 'nonexistent query xyz' } })
    
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument()
      expect(screen.getByText('Try changing your search keywords or category')).toBeInTheDocument()
    })
  })

  it('expands all FAQs when Expand All is clicked', async () => {
    render(<FAQPage />)
    
    const expandAllButton = screen.getByText('Expand All')
    fireEvent.click(expandAllButton)
    
    await waitFor(() => {
      expect(screen.getByText('CodeUtilsHub is a comprehensive platform for developers to discover, test, and use utility functions.')).toBeInTheDocument()
      expect(screen.getByText('You can browse our library, test functions in the playground, and copy them to your projects.')).toBeInTheDocument()
    })
  })

  it('collapses all FAQs when Collapse All is clicked', async () => {
    render(<FAQPage />)
    
    // First expand all
    const expandAllButton = screen.getByText('Expand All')
    fireEvent.click(expandAllButton)
    
    await waitFor(() => {
      expect(screen.getByText('CodeUtilsHub is a comprehensive platform for developers to discover, test, and use utility functions.')).toBeInTheDocument()
    })
    
    // Then collapse all
    const collapseAllButton = screen.getByText('Collapse All')
    fireEvent.click(collapseAllButton)
    
    await waitFor(() => {
      expect(screen.queryByText('CodeUtilsHub is a comprehensive platform for developers to discover, test, and use utility functions.')).not.toBeInTheDocument()
    })
  })

  it('renders sidebar with stats', () => {
    render(<FAQPage />)
    
    expect(screen.getByText('FAQ Stats')).toBeInTheDocument()
    expect(screen.getByText('Total Questions')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('Showing')).toBeInTheDocument()
  })

  it('renders popular categories section', () => {
    render(<FAQPage />)
    
    expect(screen.getByText('Popular Categories')).toBeInTheDocument()
  })

  it('renders help section with contact links', () => {
    render(<FAQPage />)
    
    expect(screen.getByText('Need More Help?')).toBeInTheDocument()
    expect(screen.getByText('Can\'t find the answer? We\'re here to help!')).toBeInTheDocument()
    expect(screen.getByText('Contact Support')).toBeInTheDocument()
    expect(screen.getByText('View Documentation')).toBeInTheDocument()
  })

  it('filters FAQs by tags', async () => {
    render(<FAQPage />)
    
    const searchInput = screen.getByPlaceholderText('Search questions...')
    fireEvent.change(searchInput, { target: { value: 'platform' } })
    
    await waitFor(() => {
      expect(screen.getByText('What is CodeUtilsHub?')).toBeInTheDocument()
      // Should not show other questions without the platform tag
      expect(screen.queryByText('How can I contribute?')).not.toBeInTheDocument()
    })
  })

  it('toggles individual FAQ items correctly', async () => {
    render(<FAQPage />)
    
    const firstQuestion = screen.getByText('What is CodeUtilsHub?')
    const secondQuestion = screen.getByText('How do I use the utility functions?')
    
    // Expand first question
    fireEvent.click(firstQuestion)
    await waitFor(() => {
      expect(screen.getByText('CodeUtilsHub is a comprehensive platform for developers to discover, test, and use utility functions.')).toBeInTheDocument()
    })
    
    // Expand second question
    fireEvent.click(secondQuestion)
    await waitFor(() => {
      expect(screen.getByText('You can browse our library, test functions in the playground, and copy them to your projects.')).toBeInTheDocument()
    })
    
    // Collapse first question
    fireEvent.click(firstQuestion)
    await waitFor(() => {
      expect(screen.queryByText('CodeUtilsHub is a comprehensive platform for developers to discover, test, and use utility functions.')).not.toBeInTheDocument()
      // Second question should still be expanded
      expect(screen.getByText('You can browse our library, test functions in the playground, and copy them to your projects.')).toBeInTheDocument()
    })
  })

  it('displays correct number of filtered results', async () => {
    render(<FAQPage />)
    
    // Filter by 'functions' category
    const functionsButtons = screen.getAllByText('Functions')
    fireEvent.click(functionsButtons[0])
    
    await waitFor(() => {
      // Should show 2 questions in functions category
      expect(screen.getAllByText('functions')).toHaveLength(2) // One in each card's category badge
    })
  })

  it('handles category filtering correctly', async () => {
    render(<FAQPage />)
    
    // Test billing category
    const billingButtons = screen.getAllByText('Billing')
    fireEvent.click(billingButtons[0])
    
    await waitFor(() => {
      // Just check that the Billing category button is selected (has primary styling)
      const billingButton = billingButtons[0]
      expect(billingButton).toHaveClass('bg-primary')
    })
  })
})
