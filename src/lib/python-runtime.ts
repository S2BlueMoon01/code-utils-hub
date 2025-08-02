// Server-safe Python runtime wrapper
// Note: Python execution now uses Judge0 API instead of client-side Pyodide for better reliability

interface PythonRuntimeInterface {
  initialize(): Promise<void>;
  runCode(code: string): Promise<{
    success: boolean;
    output: string;
    error?: string;
    executionTime: number;
  }>;
  getLoadingStatus(): { loading: boolean; ready: boolean; error?: string };
  getAvailablePackages(): string[];
  installPackage(packageName: string): Promise<boolean>;
  isReady(): boolean;
}

// Mock implementation that directs users to use Judge0 API via multi-language executor
const mockRuntime: PythonRuntimeInterface = {
  async initialize() {
    // No initialization needed - use Judge0 API instead
  },
  async runCode() {
    return {
      success: false,
      output: '',
      error: 'Python execution now uses the Judge0 API. Please use the Multi-Language Executor instead.',
      executionTime: 0
    };
  },
  getLoadingStatus() {
    return { loading: false, ready: true, error: 'Use Judge0 API for Python execution' };
  },
  getAvailablePackages() {
    return ['numpy', 'pandas', 'matplotlib', 'requests', 'sys', 'os', 'json', 'datetime', 'math', 'random'];
  },
  async installPackage() {
    return false; // Packages are pre-installed on Judge0
  },
  isReady() {
    return true;
  }
};

// Export the mock runtime (Python now runs via Judge0 API)
export const pythonRuntime: PythonRuntimeInterface = mockRuntime;
