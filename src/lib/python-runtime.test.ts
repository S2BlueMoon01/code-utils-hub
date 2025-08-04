import { describe, it, expect, beforeEach, vi } from 'vitest'
import { pythonRuntime } from '@/lib/python-runtime'

// Mock fetch for Judge0 API
global.fetch = vi.fn()

describe('PythonRuntime', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize correctly', async () => {
      await pythonRuntime.initialize()
      expect(pythonRuntime.isReady()).toBe(true)
    })

    it('should return correct loading status', () => {
      const status = pythonRuntime.getLoadingStatus()
      expect(status.loading).toBe(false)
      expect(status.ready).toBe(true)
      expect(status.error).toBeDefined()
      expect(status.error).toEqual('Use Judge0 API for Python execution')
    })
  })

  describe('code execution', () => {
    it('should redirect to Judge0 API message', async () => {
      const code = 'print("Hello, World!")'
      
      const result = await pythonRuntime.runCode(code)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Python execution now uses the Judge0 API. Please use the Multi-Language Executor instead.')
      expect(result.executionTime).toBe(0)
    })

    it('should handle any code input consistently', async () => {
      const codes = [
        'print("Hello")',
        'x = 1 + 1',
        'import math\nprint(math.pi)',
        'invalid syntax here('
      ]
      
      for (const code of codes) {
        const result = await pythonRuntime.runCode(code)
        expect(result.success).toBe(false)
        expect(result.error).toBe('Python execution now uses the Judge0 API. Please use the Multi-Language Executor instead.')
      }
    })
  })

  describe('package management', () => {
    it('should return available packages', () => {
      const packages = pythonRuntime.getAvailablePackages()
      
      expect(Array.isArray(packages)).toBe(true)
      expect(packages).toContain('numpy')
      expect(packages).toContain('pandas')
      expect(packages).toContain('matplotlib')
      expect(packages).toContain('requests')
      expect(packages).toContain('sys')
      expect(packages).toContain('os')
      expect(packages).toContain('json')
      expect(packages).toContain('datetime')
      expect(packages).toContain('math')
      expect(packages).toContain('random')
    })

    it('should return false for package installation attempts', async () => {
      const packages = ['numpy', 'pandas', 'scipy', 'matplotlib']
      
      for (const pkg of packages) {
        const result = await pythonRuntime.installPackage(pkg)
        expect(result).toBe(false)
      }
    })

    it('should handle invalid package names', async () => {
      const result = await pythonRuntime.installPackage('nonexistent-package-xyz')
      expect(result).toBe(false)
    })
  })

  describe('runtime state', () => {
    it('should always report as ready', () => {
      expect(pythonRuntime.isReady()).toBe(true)
    })

    it('should maintain consistent state after multiple calls', async () => {
      // Multiple initialization calls
      await pythonRuntime.initialize()
      await pythonRuntime.initialize()
      
      expect(pythonRuntime.isReady()).toBe(true)
      
      // Multiple code execution attempts
      await pythonRuntime.runCode('print("test1")')
      await pythonRuntime.runCode('print("test2")')
      
      expect(pythonRuntime.isReady()).toBe(true)
    })
  })

  describe('integration guidance', () => {
    it('should provide clear guidance for Judge0 API usage', async () => {
      const result = await pythonRuntime.runCode('print("Integration test")')
      
      expect(result.error).toBe('Python execution now uses the Judge0 API. Please use the Multi-Language Executor instead.')
      expect(result.success).toBe(false)
    })

    it('should maintain consistent error messaging', async () => {
      const codes = [
        'simple code',
        'complex\nmultiline\ncode',
        'code with "quotes"',
        "code with 'apostrophes'",
        'code with special chars: !@#$%^&*()'
      ]
      
      for (const code of codes) {
        const result = await pythonRuntime.runCode(code)
        expect(result.error).toBe('Python execution now uses the Judge0 API. Please use the Multi-Language Executor instead.')
      }
    })
  })

  describe('performance characteristics', () => {
    it('should return immediately without actual execution', async () => {
      const startTime = performance.now()
      
      await pythonRuntime.runCode('print("Performance test")')
      
      const endTime = performance.now()
      const executionTime = endTime - startTime
      
      // Should be very fast since it's just returning a message
      expect(executionTime).toBeLessThan(100) // Less than 100ms
    })

    it('should handle multiple concurrent calls', async () => {
      const promises = Array.from({ length: 10 }, (_, i) => 
        pythonRuntime.runCode(`print("Concurrent test ${i}")`)
      )
      
      const results = await Promise.all(promises)
      
      results.forEach(result => {
        expect(result.success).toBe(false)
        expect(result.error).toBe('Python execution now uses the Judge0 API. Please use the Multi-Language Executor instead.')
      })
    })
  })
})
