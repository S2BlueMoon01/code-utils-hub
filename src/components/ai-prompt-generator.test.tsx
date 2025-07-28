import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { AIPromptGenerator } from '@/components/ai-prompt-generator'
import * as playgroundStorage from '@/lib/playground-storage'

// Mock the playground storage module
vi.mock('@/lib/playground-storage')

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock clipboard
const mockWriteText = vi.fn().mockResolvedValue(undefined)
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText
  },
  writable: true
})

describe('AIPromptGenerator', () => {
  const mockFunction = {
    id: '1',
    name: 'isPalindrome',
    description: 'Check if a string is a palindrome',
    code: 'function isPalindrome(str) { return str === str.split("").reverse().join(""); }',
    language: 'javascript' as const,
    category: 'string' as const,
    difficulty: 'beginner' as const,
    examples: [],
    testCases: [
      {
        id: '1-t1',
        input: 'racecar',
        expected_output: true,
        description: 'Should detect palindrome'
      }
    ],
    tags: ['palindrome', 'string'],
    author: {
      id: 'user1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user' as const,
      reputation: 100,
      contributions_count: 5,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    },
    rating: 4.5,
    likes_count: 10,
    comments_count: 2,
    usage_count: 50,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    status: 'active' as const
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders AI prompt generator interface', () => {
    render(<AIPromptGenerator utilityFunction={mockFunction} />)
    
    expect(screen.getByText('AI Prompt Generator')).toBeInTheDocument()
    expect(screen.getByText(/Generate optimized prompts for AI code assistants/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate prompt/i })).toBeInTheDocument()
  })

  it('displays function information correctly', () => {
    render(<AIPromptGenerator utilityFunction={mockFunction} />)
    
    expect(screen.getByText('isPalindrome')).toBeInTheDocument()
    expect(screen.getByText('Check if a string is a palindrome')).toBeInTheDocument()
    expect(screen.getByText('javascript')).toBeInTheDocument()
    expect(screen.getByText('string')).toBeInTheDocument()
    expect(screen.getByText('beginner')).toBeInTheDocument()
  })

  it('shows test cases when available', () => {
    render(<AIPromptGenerator utilityFunction={mockFunction} />)
    
    expect(screen.getByText(/Test Cases \(1\)/)).toBeInTheDocument()
    expect(screen.getByText('Should detect palindrome')).toBeInTheDocument()
    expect(screen.getByText('"racecar"')).toBeInTheDocument()
    expect(screen.getByText('true')).toBeInTheDocument()
  })

  it('hides test cases section when no test cases available', () => {
    const functionWithoutTests = {
      ...mockFunction,
      testCases: []
    }
    
    render(<AIPromptGenerator utilityFunction={functionWithoutTests} />)
    
    expect(screen.queryByText(/Test Cases \(/)).not.toBeInTheDocument()
  })

  it('shows loading state when generating prompt', async () => {
    render(<AIPromptGenerator utilityFunction={mockFunction} />)
    
    const generateButton = screen.getByRole('button', { name: /generate prompt/i })
    fireEvent.click(generateButton)
    
    // Should show loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument()
    expect(generateButton).toBeDisabled()
  })

  it('generates and displays prompt after completion', async () => {
    render(<AIPromptGenerator utilityFunction={mockFunction} />)
    
    const generateButton = screen.getByRole('button', { name: /generate prompt/i })
    fireEvent.click(generateButton)
    
    // Wait for the prompt to be generated (1 second delay + rendering)
    await waitFor(() => {
      expect(screen.getByText('Generated AI Prompt')).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Check if the textarea is present and contains the prompt
    const textarea = screen.getByPlaceholderText('Generated prompt will appear here...')
    expect(textarea).toBeInTheDocument()
    
    // The prompt is generated correctly - we can see it contains "isPalindrome" 
    // from the error output, so let's check for multiple parts
    const promptValue = (textarea as HTMLTextAreaElement).value
    expect(promptValue).toContain('isPalindrome')
    expect(promptValue).toContain('Check if a string is a palindrome')
    expect(promptValue).toContain('JavaScript best practices')
    expect(promptValue).toContain('Test Cases:')
  })

  it('enables copy button after prompt is generated', async () => {
    render(<AIPromptGenerator utilityFunction={mockFunction} />)
    
    const generateButton = screen.getByRole('button', { name: /generate prompt/i })
    const copyButton = screen.getByRole('button', { name: /copy prompt/i })
    
    // Initially copy button should be disabled
    expect(copyButton).toBeDisabled()
    
    fireEvent.click(generateButton)
    
    // Wait for prompt generation and copy button to be enabled
    await waitFor(() => {
      expect(copyButton).not.toBeDisabled()
    }, { timeout: 2000 })
  })

  it('sends code to playground when button is clicked', async () => {
    const mockStoreCode = vi.mocked(playgroundStorage.storeCodeInPlayground)
    render(<AIPromptGenerator utilityFunction={mockFunction} />)
    
    const playgroundButton = screen.getByRole('button', { name: /send to playground/i })
    fireEvent.click(playgroundButton)
    
    expect(mockStoreCode).toHaveBeenCalledWith({
      code: mockFunction.code,
      language: mockFunction.language
    })
  })

  it('copies prompt to clipboard when copy button is clicked', async () => {
    render(<AIPromptGenerator utilityFunction={mockFunction} />)
    
    const generateButton = screen.getByRole('button', { name: /generate prompt/i })
    fireEvent.click(generateButton)
    
    // Wait for prompt generation
    await waitFor(() => {
      expect(screen.getByText('Generated AI Prompt')).toBeInTheDocument()
    }, { timeout: 2000 })
    
    const copyButton = screen.getByRole('button', { name: /copy prompt/i })
    fireEvent.click(copyButton)
    
    expect(mockWriteText).toHaveBeenCalledWith(
      expect.stringContaining('isPalindrome')
    )
  })
})
