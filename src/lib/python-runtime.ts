import { loadPyodide, PyodideInterface } from 'pyodide'

export class PythonRuntime {
  private static instance: PythonRuntime
  private pyodide: PyodideInterface | null = null
  private loading = false

  constructor() {}

  static getInstance(): PythonRuntime {
    if (!PythonRuntime.instance) {
      PythonRuntime.instance = new PythonRuntime()
    }
    return PythonRuntime.instance
  }

  async initialize(): Promise<void> {
    if (this.pyodide) return
    if (this.loading) {
      // Wait for loading to complete
      while (this.loading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return
    }

    this.loading = true
    try {
      this.pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        packages: ['numpy', 'matplotlib-pyodide', 'pandas', 'micropip']
      })
      
      // Install common packages
      await this.pyodide.loadPackage(['numpy', 'pandas'])
      
      // Setup standard output capture
      await this.pyodide.runPython(`
import sys
import io
from contextlib import redirect_stdout, redirect_stderr

class OutputCapture:
    def __init__(self):
        self.stdout = io.StringIO()
        self.stderr = io.StringIO()
        
    def capture_output(self, code):
        self.stdout = io.StringIO()
        self.stderr = io.StringIO()
        
        try:
            with redirect_stdout(self.stdout), redirect_stderr(self.stderr):
                # Execute the code
                exec(code, globals())
                
            return {
                'success': True,
                'stdout': self.stdout.getvalue(),
                'stderr': self.stderr.getvalue(),
                'error': None
            }
        except Exception as e:
            return {
                'success': False,
                'stdout': self.stdout.getvalue(),
                'stderr': self.stderr.getvalue(),
                'error': str(e)
            }

# Global output capture instance
_output_capture = OutputCapture()
      `)
    } catch (error) {
      console.error('Failed to initialize Pyodide:', error)
      throw error
    } finally {
      this.loading = false
    }
  }

  async runCode(code: string): Promise<{
    success: boolean
    output: string
    error?: string
    executionTime: number
  }> {
    const startTime = performance.now()
    
    if (!this.pyodide) {
      await this.initialize()
    }

    if (!this.pyodide) {
      return {
        success: false,
        output: '',
        error: 'Python runtime not initialized',
        executionTime: 0
      }
    }

    try {
      // Run the code with output capture
      const result = this.pyodide.runPython(`
_output_capture.capture_output('''${code.replace(/'''/g, "\\'\\'\\'")}''')
      `)

      const executionTime = performance.now() - startTime

      if (result.success) {
        return {
          success: true,
          output: result.stdout || 'Code executed successfully',
          executionTime
        }
      } else {
        return {
          success: false,
          output: result.stdout || '',
          error: result.error || result.stderr || 'Unknown error',
          executionTime
        }
      }
    } catch (error) {
      const executionTime = performance.now() - startTime
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Runtime error occurred',
        executionTime
      }
    }
  }

  async installPackage(packageName: string): Promise<boolean> {
    if (!this.pyodide) {
      await this.initialize()
    }

    if (!this.pyodide) {
      return false
    }

    try {
      await this.pyodide.loadPackage([packageName])
      return true
    } catch (error) {
      console.error(`Failed to install package ${packageName}:`, error)
      
      // Try with micropip as fallback
      try {
        await this.pyodide.runPython(`
import micropip
await micropip.install('${packageName}')
        `)
        return true
      } catch (micropipError) {
        console.error(`Failed to install ${packageName} with micropip:`, micropipError)
        return false
      }
    }
  }

  getAvailablePackages(): string[] {
    return [
      // Pre-installed packages
      'numpy', 'pandas', 'matplotlib', 'scipy', 'scikit-learn',
      'sympy', 'requests', 'pillow', 'networkx', 'bokeh',
      
      // Common packages that can be installed via micropip
      'beautifulsoup4', 'lxml', 'pyyaml', 'jsonschema',
      'dateutil', 'pytz', 'urllib3', 'certifi'
    ]
  }

  reset(): void {
    if (this.pyodide) {
      // Reset the Python namespace
      this.pyodide.runPython(`
# Clear user-defined variables but keep system modules
import sys
to_delete = []
for name in list(globals().keys()):
    if not name.startswith('_') and name not in sys.modules:
        to_delete.append(name)

for name in to_delete:
    del globals()[name]

# Reset output capture
_output_capture = OutputCapture()
      `)
    }
  }

  isReady(): boolean {
    return this.pyodide !== null && !this.loading
  }

  getLoadingStatus(): { loading: boolean; ready: boolean } {
    return {
      loading: this.loading,
      ready: this.isReady()
    }
  }
}

// Export singleton instance
export const pythonRuntime = PythonRuntime.getInstance()
