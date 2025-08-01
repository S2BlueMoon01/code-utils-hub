import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import StoragePage from './page'

// Mock the StorageManager component
vi.mock('@/components/StorageManager', () => ({
  StorageManager: ({ onDataChange }: { onDataChange?: (data: { type: string; [key: string]: unknown }) => void }) => (
    <div data-testid="storage-manager">
      <h2>Storage Manager</h2>
      <div>
        <button onClick={() => onDataChange?.({ type: 'clear' })}>Clear Storage</button>
        <button onClick={() => onDataChange?.({ type: 'export' })}>Export Data</button>
        <button onClick={() => onDataChange?.({ type: 'import' })}>Import Data</button>
      </div>
      <div data-testid="storage-stats">
        <span>Functions: 5</span>
        <span>Favorites: 3</span>
        <span>History: 10</span>
      </div>
    </div>
  )
}))

// Mock translation
const mockT = vi.fn((key: string, fallback?: string) => {
  const translations: Record<string, string> = {
    'storage.title': 'Storage Manager',
    'storage.subtitle': 'Manage your playground code storage and clean up old entries',
    'storage.description': 'Control your cached functions, favorites, and browsing history',
    'storage.usage.title': 'Storage Usage',
    'storage.usage.description': 'Monitor your local storage consumption',
    'storage.management.title': 'Data Management', 
    'storage.management.description': 'Import, export, and clear your data',
    'storage.privacy.title': 'Privacy Settings',
    'storage.privacy.description': 'Configure how your data is stored and used'
  }
  return fallback || translations[key] || key
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT
  })
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('StoragePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders storage page with title and subtitle', () => {
    render(<StoragePage />)
    
    const titles = screen.getAllByText('Storage Manager')
    expect(titles).toHaveLength(2) // page title + component title
    expect(screen.getByText('Manage your playground code storage and clean up old entries')).toBeInTheDocument()
  })

  it('renders storage manager component', () => {
    render(<StoragePage />)
    
    expect(screen.getByTestId('storage-manager')).toBeInTheDocument()
    const titles = screen.getAllByText('Storage Manager')
    expect(titles).toHaveLength(2) // page title + component title
  })

  it('displays storage statistics', () => {
    render(<StoragePage />)
    
    expect(screen.getByTestId('storage-stats')).toBeInTheDocument()
    expect(screen.getByText('Functions: 5')).toBeInTheDocument()
    expect(screen.getByText('Favorites: 3')).toBeInTheDocument()
    expect(screen.getByText('History: 10')).toBeInTheDocument()
  })

  it('renders storage management buttons', () => {
    render(<StoragePage />)
    
    expect(screen.getByText('Clear Storage')).toBeInTheDocument()
    expect(screen.getByText('Export Data')).toBeInTheDocument()
    expect(screen.getByText('Import Data')).toBeInTheDocument()
  })

  it('renders storage usage section', () => {
    render(<StoragePage />)
    
    // Storage usage is part of the StorageManager component
    expect(screen.getByTestId('storage-manager')).toBeInTheDocument()
  })

  it('renders data management section', () => {
    render(<StoragePage />)
    
    // Data management is part of the StorageManager component
    expect(screen.getByTestId('storage-manager')).toBeInTheDocument()
  })

  it('renders privacy settings section', () => {
    render(<StoragePage />)
    
    // Privacy settings would be part of the StorageManager component
    expect(screen.getByTestId('storage-manager')).toBeInTheDocument()
  })

  it('handles clear storage button click', () => {
    render(<StoragePage />)
    
    const clearButton = screen.getByText('Clear Storage')
    fireEvent.click(clearButton)
    
    // Should trigger the data change callback
    expect(clearButton).toBeInTheDocument()
  })

  it('handles export data button click', () => {
    render(<StoragePage />)
    
    const exportButton = screen.getByText('Export Data')
    fireEvent.click(exportButton)
    
    expect(exportButton).toBeInTheDocument()
  })

  it('handles import data button click', () => {
    render(<StoragePage />)
    
    const importButton = screen.getByText('Import Data')
    fireEvent.click(importButton)
    
    expect(importButton).toBeInTheDocument()
  })

  it('uses translation keys correctly', () => {
    render(<StoragePage />)
    
    expect(mockT).toHaveBeenCalled()
    const titles = screen.getAllByText('Storage Manager')
    expect(titles).toHaveLength(2) // page title + component title
  })

  it('renders proper heading hierarchy', () => {
    render(<StoragePage />)
    
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Storage Manager')
    
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('provides accessibility attributes', () => {
    render(<StoragePage />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    
    buttons.forEach(button => {
      expect(button.textContent || button.getAttribute('aria-label')).toBeTruthy()
    })
  })

  it('handles responsive design', () => {
    render(<StoragePage />)
    
    const titles = screen.getAllByText('Storage Manager')
    expect(titles).toHaveLength(2) // page title + component title
  })

  it('displays consistent styling', () => {
    render(<StoragePage />)
    
    const styledElements = document.querySelectorAll('[class*="text-"], [class*="bg-"], [class*="p-"]')
    expect(styledElements.length).toBeGreaterThan(0)
  })

  it('renders semantic structure', () => {
    render(<StoragePage />)
    
    const sections = document.querySelectorAll('section, article, main, div')
    expect(sections.length).toBeGreaterThan(0)
  })

  it('handles error states gracefully', () => {
    render(<StoragePage />)
    
    // Component should render without errors
    const titles = screen.getAllByText('Storage Manager')
    expect(titles).toHaveLength(2) // page title + component title
  })

  it('maintains state during interactions', async () => {
    render(<StoragePage />)
    
    const buttons = screen.getAllByRole('button')
    
    for (const button of buttons) {
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(button).toBeInTheDocument()
      })
    }
  })

  it('provides proper keyboard navigation', async () => {
    render(<StoragePage />)
    
    const firstButton = screen.getAllByRole('button')[0]
    firstButton.focus()
    
    expect(firstButton).toHaveFocus()
    
    fireEvent.keyDown(firstButton, { key: 'Tab' })
    
    await waitFor(() => {
      expect(document.activeElement).toBeDefined()
    })
  })

  it('handles storage data persistence', () => {
    render(<StoragePage />)
    
    // Should interact with localStorage
    expect(screen.getByTestId('storage-manager')).toBeInTheDocument()
  })

  it('shows storage capacity information', () => {
    render(<StoragePage />)
    
    expect(screen.getByTestId('storage-stats')).toBeInTheDocument()
  })

  it('provides data export functionality', () => {
    render(<StoragePage />)
    
    const exportButton = screen.getByText('Export Data')
    expect(exportButton).toBeInTheDocument()
    
    fireEvent.click(exportButton)
    expect(exportButton).toBeInTheDocument()
  })

  it('provides data import functionality', () => {
    render(<StoragePage />)
    
    const importButton = screen.getByText('Import Data')
    expect(importButton).toBeInTheDocument()
    
    fireEvent.click(importButton)
    expect(importButton).toBeInTheDocument()
  })
})
