import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GeneratorPage from './page'

// Mock storePlaygroundCode function
vi.mock('@/lib/playground-storage', () => ({
  storePlaygroundCode: vi.fn(() => 'mock-code-id')
}))

// Mock useTranslation hook
const mockT = vi.fn((key: string, fallback?: string) => {
  const translations: Record<string, string> = {
    'generator.title': 'Code Generator',
    'generator.subtitle': 'Generate code templates with AI assistance',
    'generator.form.functionDetails': 'Function Details',
    'generator.form.description': 'Describe your function and we\'ll generate the code template',
    'generator.form.functionName': 'Function Name',
    'generator.form.functionNamePlaceholder': 'e.g., formatDate, validateEmail, debounce',
    'generator.form.descriptionLabel': 'Description',
    'generator.form.descriptionPlaceholder': 'Describe what this function should do...',
    'generator.form.language': 'Language',
    'generator.form.templateStyle': 'Template Style',
    'generator.form.advancedSettings': 'Advanced Settings',
    'generator.form.testCases': 'Test Cases',
    'generator.form.testCase': 'Test Case',
    'generator.form.descriptionOptional': 'Description (optional)',
    'generator.form.inputValue': 'Input value',
    'generator.form.expectedOutput': 'Expected output',
    'generator.form.addTestCase': 'Add Test Case',
    'generator.buttons.generating': 'Generating...',
    'generator.buttons.generateCode': 'Generate Code',
    'generator.buttons.generateAIPrompt': 'Generate AI Prompt',
    'generator.output.title': 'Generated Code',
    'generator.output.runInPlayground': 'Run in Playground',
    'generator.output.copy': 'Copy',
    'generator.output.download': 'Download',
    'generator.output.description': 'Your generated function template ready to use',
    'generator.output.placeholder': 'Fill in the function details and click "Generate Code" to see your template',
    'generator.examples.title': 'Quick Examples',
    'generator.examples.description': 'Click on any example to auto-fill the form',
    'generator.examples.dateFormatter': 'Date Formatter',
    'generator.examples.emailValidator': 'Email Validator',
    'generator.examples.debounceUtility': 'Debounce Utility',
    'generator.prompt.title': 'AI Prompt Generated',
    'generator.prompt.description': 'Copy this prompt and send it to any AI (GPT-4, Claude, Gemini) to generate your code',
    'generator.prompt.readyToCopy': 'Ready to copy & paste',
    'generator.prompt.copyPrompt': 'Copy Prompt',
    'generator.prompt.howToUse': 'How to use this prompt:',
    'generator.prompt.step1': 'Copy the prompt above using the "Copy Prompt" button',
    'generator.prompt.step2': 'Go to your favorite AI (ChatGPT, Claude, Gemini, etc.)',
    'generator.prompt.step3': 'Paste the prompt and send it',
    'generator.prompt.step4': 'The AI will generate optimized, production-ready code',
    'generator.prompt.step5': 'Copy the generated code back to your project'
  }
  return translations[key] || fallback || key
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT
  })
}))

// Mock window.open
const mockOpen = vi.fn()
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true
})

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve())
  }
})

// Mock URL.createObjectURL and URL.revokeObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
  value: vi.fn(() => 'mock-url'),
  writable: true
})

Object.defineProperty(window.URL, 'revokeObjectURL', {
  value: vi.fn(),
  writable: true
})

describe('GeneratorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders generator page with title and subtitle', () => {
    render(<GeneratorPage />)
    
    expect(screen.getByText('Code Generator')).toBeInTheDocument()
    expect(screen.getByText('Generate code templates with AI assistance')).toBeInTheDocument()
  })

  it('renders function details form', () => {
    render(<GeneratorPage />)
    
    expect(screen.getByText('Function Details')).toBeInTheDocument()
    expect(screen.getByText('Describe your function and we\'ll generate the code template')).toBeInTheDocument()
    expect(screen.getByText('Function Name')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Language')).toBeInTheDocument()
    expect(screen.getByText('Template Style')).toBeInTheDocument()
  })

  it('renders input fields with placeholders', () => {
    render(<GeneratorPage />)
    
    expect(screen.getByPlaceholderText('e.g., formatDate, validateEmail, debounce')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Describe what this function should do...')).toBeInTheDocument()
  })

  it('renders generate buttons', () => {
    render(<GeneratorPage />)
    
    expect(screen.getByText('Generate Code')).toBeInTheDocument()
    expect(screen.getByText('Generate AI Prompt')).toBeInTheDocument()
  })

  it('renders generated code section', () => {
    render(<GeneratorPage />)
    
    expect(screen.getByText('Generated Code')).toBeInTheDocument()
    expect(screen.getByText('Your generated function template ready to use')).toBeInTheDocument()
    expect(screen.getByText('Fill in the function details and click "Generate Code" to see your template')).toBeInTheDocument()
  })

  it('renders quick examples section', () => {
    render(<GeneratorPage />)
    
    expect(screen.getByText('Quick Examples')).toBeInTheDocument()
    expect(screen.getByText('Click on any example to auto-fill the form')).toBeInTheDocument()
    expect(screen.getByText('Date Formatter')).toBeInTheDocument()
    expect(screen.getByText('Email Validator')).toBeInTheDocument()
    expect(screen.getByText('Debounce Utility')).toBeInTheDocument()
  })

  it('disables generate buttons when form is incomplete', () => {
    render(<GeneratorPage />)
    
    const generateButton = screen.getByText('Generate Code')
    const generatePromptButton = screen.getByText('Generate AI Prompt')
    
    expect(generateButton).toBeDisabled()
    expect(generatePromptButton).toBeDisabled()
  })

  it('enables generate buttons when form is complete', async () => {
    render(<GeneratorPage />)
    
    const functionNameInput = screen.getByPlaceholderText('e.g., formatDate, validateEmail, debounce')
    const descriptionInput = screen.getByPlaceholderText('Describe what this function should do...')
    
    fireEvent.change(functionNameInput, { target: { value: 'testFunction' } })
    fireEvent.change(descriptionInput, { target: { value: 'A test function' } })
    
    await waitFor(() => {
      const generateButton = screen.getByText('Generate Code')
      const generatePromptButton = screen.getByText('Generate AI Prompt')
      
      expect(generateButton).not.toBeDisabled()
      expect(generatePromptButton).not.toBeDisabled()
    })
  })

  it('fills form when quick example is clicked', async () => {
    render(<GeneratorPage />)
    
    const dateFormatterExample = screen.getByText('Date Formatter')
    fireEvent.click(dateFormatterExample)
    
    await waitFor(() => {
      const functionNameInput = screen.getByPlaceholderText('e.g., formatDate, validateEmail, debounce') as HTMLInputElement
      const descriptionInput = screen.getByPlaceholderText('Describe what this function should do...') as HTMLInputElement
      
      expect(functionNameInput.value).toBe('formatDate')
      expect(descriptionInput.value).toContain('Format a date object')
    })
  })

  it('generates code when generate button is clicked', async () => {
    render(<GeneratorPage />)
    
    const functionNameInput = screen.getByPlaceholderText('e.g., formatDate, validateEmail, debounce')
    const descriptionInput = screen.getByPlaceholderText('Describe what this function should do...')
    
    fireEvent.change(functionNameInput, { target: { value: 'testFunction' } })
    fireEvent.change(descriptionInput, { target: { value: 'A test function' } })
    
    const generateButton = screen.getByText('Generate Code')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('Generating...')).toBeInTheDocument()
    })
    
    await waitFor(() => {
      expect(screen.getByText('Run in Playground')).toBeInTheDocument()
      expect(screen.getByText('Copy')).toBeInTheDocument()
      expect(screen.getByText('Download')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('shows advanced settings when toggled', async () => {
    render(<GeneratorPage />)
    
    const advancedSettingsButton = screen.getByText('Advanced Settings')
    fireEvent.click(advancedSettingsButton)
    
    await waitFor(() => {
      expect(screen.getByText('Test Cases')).toBeInTheDocument()
      expect(screen.getByText('Add Test Case')).toBeInTheDocument()
    })
  })

  it('adds test case when add button is clicked', async () => {
    render(<GeneratorPage />)
    
    // Show advanced settings first
    const advancedSettingsButton = screen.getByText('Advanced Settings')
    fireEvent.click(advancedSettingsButton)
    
    await waitFor(() => {
      const addTestCaseButton = screen.getByText('Add Test Case')
      fireEvent.click(addTestCaseButton)
      
      expect(screen.getAllByText('Test Case')).toHaveLength(2) // Original + new one
    })
  })

  it('generates AI prompt when button is clicked', async () => {
    render(<GeneratorPage />)
    
    const functionNameInput = screen.getByPlaceholderText('e.g., formatDate, validateEmail, debounce')
    const descriptionInput = screen.getByPlaceholderText('Describe what this function should do...')
    
    fireEvent.change(functionNameInput, { target: { value: 'testFunction' } })
    fireEvent.change(descriptionInput, { target: { value: 'A test function' } })
    
    const generatePromptButton = screen.getByText('Generate AI Prompt')
    fireEvent.click(generatePromptButton)
    
    await waitFor(() => {
      expect(screen.getByText('AI Prompt Generated')).toBeInTheDocument()
      expect(screen.getByText('Copy this prompt and send it to any AI (GPT-4, Claude, Gemini) to generate your code')).toBeInTheDocument()
      expect(screen.getByText('Ready to copy & paste')).toBeInTheDocument()
      expect(screen.getByText('Copy Prompt')).toBeInTheDocument()
    })
  })

  it('shows AI prompt usage instructions', async () => {
    render(<GeneratorPage />)
    
    const functionNameInput = screen.getByPlaceholderText('e.g., formatDate, validateEmail, debounce')
    const descriptionInput = screen.getByPlaceholderText('Describe what this function should do...')
    
    fireEvent.change(functionNameInput, { target: { value: 'testFunction' } })
    fireEvent.change(descriptionInput, { target: { value: 'A test function' } })
    
    const generatePromptButton = screen.getByText('Generate AI Prompt')
    fireEvent.click(generatePromptButton)
    
    await waitFor(() => {
      expect(screen.getByText('How to use this prompt:')).toBeInTheDocument()
      expect(screen.getByText('Copy the prompt above using the "Copy Prompt" button')).toBeInTheDocument()
      expect(screen.getByText('Go to your favorite AI (ChatGPT, Claude, Gemini, etc.)')).toBeInTheDocument()
      expect(screen.getByText('Paste the prompt and send it')).toBeInTheDocument()
      expect(screen.getByText('The AI will generate optimized, production-ready code')).toBeInTheDocument()
      expect(screen.getByText('Copy the generated code back to your project')).toBeInTheDocument()
    })
  })

  it('copies code to clipboard when copy button is clicked', async () => {
    render(<GeneratorPage />)
    
    const functionNameInput = screen.getByPlaceholderText('e.g., formatDate, validateEmail, debounce')
    const descriptionInput = screen.getByPlaceholderText('Describe what this function should do...')
    
    fireEvent.change(functionNameInput, { target: { value: 'testFunction' } })
    fireEvent.change(descriptionInput, { target: { value: 'A test function' } })
    
    const generateButton = screen.getByText('Generate Code')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const copyButton = screen.getByText('Copy')
      fireEvent.click(copyButton)
      
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    }, { timeout: 2000 })
  })

  it('downloads code when download button is clicked', async () => {
    render(<GeneratorPage />)
    
    const functionNameInput = screen.getByPlaceholderText('e.g., formatDate, validateEmail, debounce')
    const descriptionInput = screen.getByPlaceholderText('Describe what this function should do...')
    
    fireEvent.change(functionNameInput, { target: { value: 'testFunction' } })
    fireEvent.change(descriptionInput, { target: { value: 'A test function' } })
    
    const generateButton = screen.getByText('Generate Code')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const downloadButton = screen.getByText('Download')
      fireEvent.click(downloadButton)
      
      expect(window.URL.createObjectURL).toHaveBeenCalled()
    }, { timeout: 2000 })
  })

  it('opens playground when run in playground button is clicked', async () => {
    render(<GeneratorPage />)
    
    const functionNameInput = screen.getByPlaceholderText('e.g., formatDate, validateEmail, debounce')
    const descriptionInput = screen.getByPlaceholderText('Describe what this function should do...')
    
    fireEvent.change(functionNameInput, { target: { value: 'testFunction' } })
    fireEvent.change(descriptionInput, { target: { value: 'A test function' } })
    
    const generateButton = screen.getByText('Generate Code')
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const playgroundButton = screen.getByText('Run in Playground')
      fireEvent.click(playgroundButton)
      
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('/playground?codeId=mock-code-id'),
        '_blank',
        'noopener,noreferrer'
      )
    }, { timeout: 2000 })
  })

  it('changes language selection', async () => {
    render(<GeneratorPage />)
    
    // Check if language selector is present
    expect(screen.getByText('Language')).toBeInTheDocument()
    
    // Language select functionality would need more complex testing
    // due to the Select component implementation
  })

  it('validates form inputs correctly', async () => {
    render(<GeneratorPage />)
    
    const generateButton = screen.getByText('Generate Code')
    
    // Initially disabled
    expect(generateButton).toBeDisabled()
    
    // Fill only function name
    const functionNameInput = screen.getByPlaceholderText('e.g., formatDate, validateEmail, debounce')
    fireEvent.change(functionNameInput, { target: { value: 'testFunction' } })
    
    // Still disabled without description
    expect(generateButton).toBeDisabled()
    
    // Fill description
    const descriptionInput = screen.getByPlaceholderText('Describe what this function should do...')
    fireEvent.change(descriptionInput, { target: { value: 'A test function' } })
    
    // Now enabled
    await waitFor(() => {
      expect(generateButton).not.toBeDisabled()
    })
  })
})
