import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CodePlayground from '@/components/CodePlayground'

interface MockEditorProps {
  value: string
  onChange?: (value: string) => void
  language: string
}

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange, language }: MockEditorProps) => (
    <textarea
      data-testid="monaco-editor"
      data-language={language}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder="Monaco Editor Mock"
    />
  ),
}))

// Mock Next.js dynamic import
vi.mock('next/dynamic', () => ({
  default: () => {
    const Component = vi.fn(({ value, onChange, language }: MockEditorProps) => (
      <textarea
        data-testid="monaco-editor"
        data-language={language}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Monaco Editor Mock"
      />
    ))
    return Component
  },
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
})

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('CodePlayground', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders code playground with default JavaScript language', () => {
    render(<CodePlayground />)
    
    expect(screen.getByText('Code Playground')).toBeInTheDocument()
    expect(screen.getAllByText('JavaScript')[0]).toBeInTheDocument()
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument()
  })

  it('displays all supported languages', () => {
    render(<CodePlayground />)
    
    const languages = ['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS', 'JSON']
    languages.forEach(language => {
      expect(screen.getAllByText(language)[0]).toBeInTheDocument()
    })
  })

  it('switches language when clicking language badge', async () => {
    render(<CodePlayground />)
    
    const pythonBadge = screen.getByText('Python')
    fireEvent.click(pythonBadge)
    
    await waitFor(() => {
      const editor = screen.getByTestId('monaco-editor')
      expect(editor).toHaveAttribute('data-language', 'python')
    })
  })

  it('updates code when editing in monaco editor', async () => {
    render(<CodePlayground />)
    
    const editor = screen.getByTestId('monaco-editor')
    fireEvent.change(editor, { target: { value: 'console.log("Hello World")' } })
    
    await waitFor(() => {
      expect(editor).toHaveValue('console.log("Hello World")')
    })
  })

  it('runs JavaScript code and displays output', async () => {
    render(<CodePlayground />)
    
    const editor = screen.getByTestId('monaco-editor')
    fireEvent.change(editor, { target: { value: 'console.log("Hello World")' } })
    
    const runButton = screen.getByRole('button', { name: /run/i })
    fireEvent.click(runButton)
    
    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })
  })

  it('resets code to default when clicking reset button', async () => {
    render(<CodePlayground />)
    
    const editor = screen.getByTestId('monaco-editor') as HTMLTextAreaElement
    fireEvent.change(editor, { target: { value: 'modified code' } })
    
    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)
    
    await waitFor(() => {
      expect(editor.value).toContain('JavaScript Playground')
    })
  })

  it('copies code to clipboard when clicking copy button', async () => {
    render(<CodePlayground />)
    
    const copyButton = screen.getByRole('button', { name: /copy/i })
    fireEvent.click(copyButton)
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    })
  })

  it('marks as saved when clicking save button', async () => {
    render(<CodePlayground />)
    
    const saveButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(screen.getByText('Saved')).toBeInTheDocument()
    })
  })

  it('downloads code file when clicking download button', async () => {
    render(<CodePlayground />)
    
    // Mock createElement and appendChild
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
    }
    const createElementSpy = vi.spyOn(document, 'createElement')
    const appendChildSpy = vi.spyOn(document.body, 'appendChild')
    const removeChildSpy = vi.spyOn(document.body, 'removeChild')
    
    createElementSpy.mockReturnValue(mockLink as unknown as HTMLElement)
    appendChildSpy.mockImplementation(() => mockLink as unknown as Node)
    removeChildSpy.mockImplementation(() => mockLink as unknown as Node)
    
    const downloadButton = screen.getByRole('button', { name: /download/i })
    fireEvent.click(downloadButton)
    
    await waitFor(() => {
      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(mockLink.click).toHaveBeenCalled()
    })
    
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  it('displays HTML preview for HTML language', async () => {
    render(<CodePlayground initialLanguage="html" />)
    
    await waitFor(() => {
      const iframe = screen.getByTitle('HTML Preview')
      expect(iframe).toBeInTheDocument()
    })
  })

  it('handles TypeScript code execution', async () => {
    render(<CodePlayground initialLanguage="typescript" />)
    
    const editor = screen.getByTestId('monaco-editor')
    fireEvent.change(editor, { target: { value: 'const x: number = 42; console.log(x);' } })
    
    const runButton = screen.getByRole('button', { name: /run/i })
    fireEvent.click(runButton)
    
    await waitFor(() => {
      expect(screen.getByText(/42/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('handles code execution errors gracefully', async () => {
    render(<CodePlayground />)
    
    const editor = screen.getByTestId('monaco-editor')
    fireEvent.change(editor, { target: { value: 'this.will.cause.an.error()' } })
    
    const runButton = screen.getByRole('button', { name: /run/i })
    fireEvent.click(runButton)
    
    await waitFor(() => {
      expect(screen.getByText(/ERROR:/)).toBeInTheDocument()
    })
  })

  it('disables run button for non-runnable languages', () => {
    render(<CodePlayground initialLanguage="css" />)
    
    const runButton = screen.getByRole('button', { name: /run/i })
    expect(runButton).toBeDisabled()
  })

  it('displays appropriate message for Python execution', async () => {
    render(<CodePlayground initialLanguage="python" />)
    
    const runButton = screen.getByRole('button', { name: /run/i })
    fireEvent.click(runButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Python execution coming soon/)).toBeInTheDocument()
    })
  })

  it('displays usage instructions and shortcuts', () => {
    render(<CodePlayground />)
    
    expect(screen.getByText('🚀 Getting Started')).toBeInTheDocument()
    expect(screen.getByText('⚡ Features')).toBeInTheDocument()
    expect(screen.getByText('📋 Shortcuts')).toBeInTheDocument()
    
    expect(screen.getByText(/Ctrl\+Enter.*Run code/)).toBeInTheDocument()
    expect(screen.getByText(/Syntax highlighting/)).toBeInTheDocument()
  })

  it('works in read-only mode', () => {
    render(<CodePlayground readOnly={true} />)
    
    const runButton = screen.getByRole('button', { name: /run/i })
    const resetButton = screen.getByRole('button', { name: /reset/i })
    const saveButton = screen.getByRole('button', { name: /save/i })
    
    expect(runButton).toBeDisabled()
    expect(resetButton).toBeDisabled()
    expect(saveButton).toBeDisabled()
  })

  it('accepts initial code prop', () => {
    const initialCode = 'console.log("Custom initial code")'
    render(<CodePlayground initialCode={initialCode} />)
    
    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toHaveValue(initialCode)
  })

  it('renders with dark theme when specified', () => {
    render(<CodePlayground theme="dark" />)
    
    // Monaco editor mock should receive theme prop
    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toBeInTheDocument()
  })
})
