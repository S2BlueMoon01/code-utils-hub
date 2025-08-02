import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})

// Mock Python Runtime globally to prevent Pyodide CDN access
vi.mock('@/lib/python-runtime', () => ({
  PythonRuntime: class MockPythonRuntime {
    static getInstance() {
      return new MockPythonRuntime()
    }
    
    async runCode() {
      return {
        output: 'Mocked Python output',
        error: null,
        executionTime: 100
      }
    }

    isReady() {
      return true
    }

    getLoadingStatus() {
      return {
        loading: false,
        ready: true
      }
    }

    getAvailablePackages() {
      return ['numpy', 'pandas', 'matplotlib']
    }

    async initialize() {
      return Promise.resolve()
    }
  },
  pythonRuntime: {
    runCode: vi.fn(async () => ({
      success: true,
      output: 'Mocked Python output',
      error: null,
      executionTime: 100
    })),
    isReady: vi.fn(() => true),
    getLoadingStatus: vi.fn(() => ({
      loading: false,
      ready: true
    })),
    getAvailablePackages: vi.fn(() => ['numpy', 'pandas', 'matplotlib']),
    initialize: vi.fn(async () => Promise.resolve())
  }
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    return { src, alt, ...props }
  },
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    button: 'button',
    section: 'section',
    article: 'article',
    header: 'header',
    nav: 'nav',
    main: 'main',
    footer: 'footer',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => true,
}))

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
  
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)
