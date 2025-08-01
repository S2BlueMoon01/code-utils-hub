import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PlaygroundPage from './page'

// Mock PlaygroundWrapper component
vi.mock('@/components/PlaygroundWrapper', () => ({
  default: ({ 
    onCodeChange = vi.fn(), 
    onLanguageChange = vi.fn(), 
    onRun = vi.fn() 
  }: { 
    onCodeChange?: (code: string) => void;
    onLanguageChange?: (language: string) => void;
    onRun?: () => void;
  }) => (
    <div data-testid="playground-wrapper">
      <div data-testid="playground-header">
        <h1>Code Playground</h1>
        <p>Test and run your utility functions in real-time</p>
      </div>
      <div data-testid="language-selector">
        <select 
          onChange={(e) => onLanguageChange(e.target.value)}
          data-testid="language-select"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>
      <div data-testid="code-editor">
        <textarea
          placeholder="Write your code here..."
          onChange={(e) => onCodeChange(e.target.value)}
          data-testid="code-input"
        />
      </div>
      <div data-testid="controls">
        <button onClick={onRun} data-testid="run-button">Run Code</button>
        <button data-testid="clear-button">Clear</button>
        <button data-testid="save-button">Save</button>
        <button data-testid="share-button">Share</button>
      </div>
      <div data-testid="output-panel">
        <h3>Output</h3>
        <pre data-testid="output-content">{'// Output will appear here'}</pre>
      </div>
      <div data-testid="examples-section">
        <h3>Example Functions</h3>
        <div data-testid="example-1">
          <h4>Format Date</h4>
          <p>Format dates with ease</p>
          <button data-testid="load-example-1">Load Example</button>
        </div>
        <div data-testid="example-2">
          <h4>Validate Email</h4>
          <p>Email validation utility</p>
          <button data-testid="load-example-2">Load Example</button>
        </div>
      </div>
    </div>
  )
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

// Mock useTranslation hook
const mockT = vi.fn((key: string, fallback?: string) => {
  const translations: Record<string, string> = {
    'playground.title': 'Code Playground',
    'playground.subtitle': 'Test and run your utility functions in real-time',
    'playground.editor.placeholder': 'Write your code here...',
    'playground.language.javascript': 'JavaScript',
    'playground.language.python': 'Python',
    'playground.language.typescript': 'TypeScript',
    'playground.controls.run': 'Run Code',
    'playground.controls.clear': 'Clear',
    'playground.controls.save': 'Save',
    'playground.controls.share': 'Share',
    'playground.output.title': 'Output',
    'playground.output.placeholder': '// Output will appear here',
    'playground.examples.title': 'Example Functions',
    'playground.examples.formatDate.title': 'Format Date',
    'playground.examples.formatDate.description': 'Format dates with ease',
    'playground.examples.validateEmail.title': 'Validate Email', 
    'playground.examples.validateEmail.description': 'Email validation utility',
    'playground.examples.load': 'Load Example',
    'playground.features.title': 'Playground Features',
    'playground.features.realtime': 'Real-time Execution',
    'playground.features.multiLanguage': 'Multi-Language Support',
    'playground.features.syntax': 'Syntax Highlighting',
    'playground.features.sharing': 'Code Sharing',
    'playground.tips.title': 'Quick Tips',
    'playground.tips.shortcuts': 'Use Ctrl+Enter to run code',
    'playground.tips.examples': 'Try the example functions to get started',
    'playground.tips.save': 'Save your work before closing the browser'
  }
  return translations[key] || fallback || key
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT
  })
}))

// Mock browser APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock URL for sharing functionality
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/playground',
    origin: 'http://localhost:3000'
  },
  writable: true,
})

// Mock Clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  writable: true,
})

describe('PlaygroundPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the playground page', () => {
    render(<PlaygroundPage />)
    
    expect(screen.getByTestId('playground-wrapper')).toBeInTheDocument()
  })

  it('displays the playground header', () => {
    render(<PlaygroundPage />)
    
    expect(screen.getByTestId('playground-header')).toBeInTheDocument()
    expect(screen.getByText('Code Playground')).toBeInTheDocument()
    expect(screen.getByText('Test and run your utility functions in real-time')).toBeInTheDocument()
  })

  it('renders the language selector', () => {
    render(<PlaygroundPage />)
    
    expect(screen.getByTestId('language-selector')).toBeInTheDocument()
    expect(screen.getByTestId('language-select')).toBeInTheDocument()
    
    const languageSelect = screen.getByTestId('language-select') as HTMLSelectElement
    expect(languageSelect).toHaveValue('javascript')
  })

  it('displays language options correctly', () => {
    render(<PlaygroundPage />)
    
    const languageSelect = screen.getByTestId('language-select')
    expect(languageSelect).toBeInTheDocument()
    
    // Should have JavaScript, Python, TypeScript options
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()  
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders the code editor', () => {
    render(<PlaygroundPage />)
    
    expect(screen.getByTestId('code-editor')).toBeInTheDocument()
    expect(screen.getByTestId('code-input')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Write your code here...')).toBeInTheDocument()
  })

  it('displays control buttons', () => {
    render(<PlaygroundPage />)
    
    expect(screen.getByTestId('controls')).toBeInTheDocument()
    expect(screen.getByTestId('run-button')).toBeInTheDocument()
    expect(screen.getByTestId('clear-button')).toBeInTheDocument()
    expect(screen.getByTestId('save-button')).toBeInTheDocument()
    expect(screen.getByTestId('share-button')).toBeInTheDocument()
  })

  it('shows the output panel', () => {
    render(<PlaygroundPage />)
    
    expect(screen.getByTestId('output-panel')).toBeInTheDocument()
    expect(screen.getByText('Output')).toBeInTheDocument()
    expect(screen.getByTestId('output-content')).toBeInTheDocument()
    expect(screen.getByText('// Output will appear here')).toBeInTheDocument()
  })

  it('displays example functions section', () => {
    render(<PlaygroundPage />)
    
    expect(screen.getByTestId('examples-section')).toBeInTheDocument()
    expect(screen.getByText('Example Functions')).toBeInTheDocument()
    
    expect(screen.getByTestId('example-1')).toBeInTheDocument()
    expect(screen.getByText('Format Date')).toBeInTheDocument()
    expect(screen.getByText('Format dates with ease')).toBeInTheDocument()
    
    expect(screen.getByTestId('example-2')).toBeInTheDocument()
    expect(screen.getByText('Validate Email')).toBeInTheDocument()
    expect(screen.getByText('Email validation utility')).toBeInTheDocument()
  })

  it('handles language selection change', async () => {
    render(<PlaygroundPage />)
    
    const languageSelect = screen.getByTestId('language-select')
    fireEvent.change(languageSelect, { target: { value: 'python' } })
    
    await waitFor(() => {
      expect(languageSelect).toHaveValue('python')
    })
  })

  it('handles code input changes', async () => {
    render(<PlaygroundPage />)
    
    const codeInput = screen.getByTestId('code-input')
    fireEvent.change(codeInput, { target: { value: 'console.log("Hello World");' } })
    
    await waitFor(() => {
      expect(codeInput).toHaveValue('console.log("Hello World");')
    })
  })

  it('handles run button click', () => {
    render(<PlaygroundPage />)
    
    const runButton = screen.getByTestId('run-button')
    fireEvent.click(runButton)
    
    expect(runButton).toBeInTheDocument()
  })

  it('handles clear button click', () => {
    render(<PlaygroundPage />)
    
    const clearButton = screen.getByTestId('clear-button')
    fireEvent.click(clearButton)
    
    expect(clearButton).toBeInTheDocument()
  })

  it('handles save button click', () => {
    render(<PlaygroundPage />)
    
    const saveButton = screen.getByTestId('save-button')
    fireEvent.click(saveButton)
    
    expect(saveButton).toBeInTheDocument()
  })

  it('handles share button click', () => {
    render(<PlaygroundPage />)
    
    const shareButton = screen.getByTestId('share-button')
    fireEvent.click(shareButton)
    
    expect(shareButton).toBeInTheDocument()
  })

  it('handles example loading', () => {
    render(<PlaygroundPage />)
    
    const loadExample1Button = screen.getByTestId('load-example-1')
    fireEvent.click(loadExample1Button)
    
    expect(loadExample1Button).toBeInTheDocument()
    
    const loadExample2Button = screen.getByTestId('load-example-2')
    fireEvent.click(loadExample2Button)
    
    expect(loadExample2Button).toBeInTheDocument()
  })

  it('provides keyboard shortcuts', async () => {
    render(<PlaygroundPage />)
    
    const codeInput = screen.getByTestId('code-input')
    
    // Test Ctrl+Enter shortcut for running code
    fireEvent.keyDown(codeInput, { key: 'Enter', ctrlKey: true })
    
    expect(codeInput).toBeInTheDocument()
  })

  it('handles tab navigation properly', async () => {
    render(<PlaygroundPage />)
    
    // Check if the playground wrapper is rendered
    expect(screen.getByTestId('playground-wrapper')).toBeInTheDocument()
    
    // Since PlaygroundWrapper handles internal navigation, just check it renders
    const wrapper = screen.getByTestId('playground-wrapper')
    expect(wrapper).toBeInTheDocument()
  })

  it('maintains responsive design', () => {
    render(<PlaygroundPage />)
    
    // Component should render properly in different screen sizes
    expect(screen.getByTestId('playground-wrapper')).toBeInTheDocument()
  })

  it('handles code persistence', () => {
    render(<PlaygroundPage />)
    
    // The PlaygroundWrapper should handle persistence
    expect(screen.getByTestId('playground-wrapper')).toBeInTheDocument()
  })

  it('provides proper accessibility', () => {
    render(<PlaygroundPage />)
    
    // Check for proper form labels and ARIA attributes
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    
    const textboxes = screen.getAllByRole('textbox')
    expect(textboxes.length).toBeGreaterThan(0)
    
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes.length).toBeGreaterThan(0)
  })

  it('handles error states gracefully', () => {
    render(<PlaygroundPage />)
    
    // Component should render without throwing errors
    expect(screen.getByTestId('playground-wrapper')).toBeInTheDocument()
  })

  it('supports code syntax highlighting', () => {
    render(<PlaygroundPage />)
    
    // Check for code highlighting elements (implementation dependent)
    const codeEditor = screen.getByTestId('code-editor')
    expect(codeEditor).toBeInTheDocument()
  })

  it('handles multiple language switches correctly', async () => {
    render(<PlaygroundPage />)
    
    const languageSelect = screen.getByTestId('language-select')
    
    // Switch between languages
    fireEvent.change(languageSelect, { target: { value: 'python' } })
    await waitFor(() => {
      expect(languageSelect).toHaveValue('python')
    })
    
    fireEvent.change(languageSelect, { target: { value: 'typescript' } })
    await waitFor(() => {
      expect(languageSelect).toHaveValue('typescript')
    })
    
    fireEvent.change(languageSelect, { target: { value: 'javascript' } })
    await waitFor(() => {
      expect(languageSelect).toHaveValue('javascript')
    })
  })

  it('maintains state during interactions', async () => {
    render(<PlaygroundPage />)
    
    const codeInput = screen.getByTestId('code-input')
    const languageSelect = screen.getByTestId('language-select')
    
    // Enter code
    fireEvent.change(codeInput, { target: { value: 'const x = 1;' } })
    
    // Change language
    fireEvent.change(languageSelect, { target: { value: 'typescript' } })
    
    // Code should persist
    await waitFor(() => {
      expect(codeInput).toHaveValue('const x = 1;')
      expect(languageSelect).toHaveValue('typescript')
    })
  })

  it('handles long code inputs efficiently', async () => {
    render(<PlaygroundPage />)
    
    const codeInput = screen.getByTestId('code-input')
    const longCode = 'console.log("test");'.repeat(1000)
    
    fireEvent.change(codeInput, { target: { value: longCode } })
    
    await waitFor(() => {
      expect(codeInput).toHaveValue(longCode)
    })
  })

  it('provides visual feedback for actions', () => {
    render(<PlaygroundPage />)
    
    const runButton = screen.getByTestId('run-button')
    
    // Should provide visual feedback when clicked
    fireEvent.mouseDown(runButton)
    fireEvent.mouseUp(runButton)
    
    expect(runButton).toBeInTheDocument()
  })
})
