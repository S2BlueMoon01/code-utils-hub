"use client";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Play, Save, Download, Settings, Copy, RotateCcw, RefreshCw } from "lucide-react";
import { PythonStatus } from "./ui/python-status";
import { sampleUtilityFunctions } from "@/data/sample-functions";
import { convertToLanguage } from "@/data/multi-language-functions";
import { persistPlaygroundCode, getPersistedCode, clearPersistedCode, getPlaygroundCode } from "@/lib/playground-storage";
import { pythonRuntime } from "@/lib/python-runtime";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 w-full items-center justify-center rounded-md border bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-2"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading editor...</p>
      </div>
    </div>
  ),
});

export interface Language {
  id: string;
  name: string;
  extension: string;
  defaultCode: string;
  runnable: boolean;
}

const languages: Language[] = [
  {
    id: "javascript",
    name: "JavaScript",
    extension: "js",
    defaultCode: `// JavaScript Playground
// Write your code here and click Run to execute

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
console.log("Result:", 2 + 2);

// Try some utility functions
const numbers = [1, 2, 3, 4, 5];
console.log("Sum:", numbers.reduce((a, b) => a + b, 0));`,
    runnable: true,
  },
  {
    id: "typescript",
    name: "TypeScript",
    extension: "ts",
    defaultCode: `// TypeScript Playground
// Write your TypeScript code here

interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(name: string, email: string): User {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
  };
}

const user = createUser("John Doe", "john@example.com");
console.log("Created user:", user);

// Type-safe operations
const users: User[] = [user];
console.log("Users count:", users.length);`,
    runnable: true,
  },
  {
    id: "python",
    name: "Python",
    extension: "py",
    defaultCode: `# Python Playground
# Write your Python code here

def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
print("Result:", 2 + 2)

# List comprehension example
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
print("Squares:", squares)

# Dictionary example
user = {"name": "John", "age": 30}
print("User:", user)`,
    runnable: true,
  },
  {
    id: "html",
    name: "HTML",
    extension: "html",
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Playground</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .highlight {
            background-color: #f0f8ff;
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <h1>Welcome to HTML Playground</h1>
    <div class="highlight">
        <p>This is a sample HTML document. You can edit and preview it live!</p>
    </div>
    
    <h2>Interactive Elements</h2>
    <button onclick="alert('Hello from HTML!')">Click Me</button>
    
    <h2>Form Example</h2>
    <form>
        <input type="text" placeholder="Enter your name" />
        <button type="button" onclick="greet()">Greet</button>
    </form>
    
    <script>
        function greet() {
            const input = document.querySelector('input[type="text"]');
            alert('Hello, ' + input.value + '!');
        }
    </script>
</body>
</html>`,
    runnable: false,
  },
  {
    id: "css",
    name: "CSS",
    extension: "css",
    defaultCode: `/* CSS Playground */
/* Write your CSS styles here */

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
  padding: 20px;
  min-height: 100vh;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  display: inline-block;
  text-decoration: none;
}

.button:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}`,
    runnable: false,
  },
  {
    id: "json",
    name: "JSON",
    extension: "json",
    defaultCode: `{
  "name": "CodeUtils Hub",
  "version": "1.0.0",
  "description": "A comprehensive utility functions library and code playground",
  "features": {
    "playground": {
      "languages": ["JavaScript", "TypeScript", "Python", "HTML", "CSS"],
      "realTimeExecution": true,
      "codeSharing": true
    },
    "utilities": {
      "categories": ["String", "Array", "Object", "Date", "Math", "Validation"],
      "totalFunctions": 100,
      "searchable": true,
      "documented": true
    },
    "community": {
      "userContributions": true,
      "rating": true,
      "comments": true
    }
  },
  "technologies": [
    "Next.js 15",
    "TypeScript",
    "Tailwind CSS",
    "Monaco Editor",
    "Vitest",
    "Playwright"
  ],
  "author": {
    "name": "CodeUtils Team",
    "email": "team@codeutils.dev"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/codeutils/hub"
  },
  "keywords": [
    "utilities",
    "playground",
    "javascript",
    "typescript",
    "python",
    "developers",
    "tools"
  ]
}`,
    runnable: false,
  },
];

interface CodePlaygroundProps {
  initialLanguage?: string;
  initialCode?: string;
  readOnly?: boolean;
}

export default function CodePlayground({
  initialLanguage = "javascript",
  initialCode,
  readOnly = false,
}: CodePlaygroundProps) {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages.find(lang => lang.id === initialLanguage) || languages[0]
  );
  const [code, setCode] = useState<string>(
    initialCode || selectedLanguage.defaultCode
  );
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentUtilityId, setCurrentUtilityId] = useState<string | null>(null);
  const [hasLoadedSharedCode, setHasLoadedSharedCode] = useState(false);
  const [currentCodeId, setCurrentCodeId] = useState<string | null>(null);
  const [originalGeneratedCode, setOriginalGeneratedCode] = useState<string | null>(null);

  const handleLanguageChange = useCallback((language: Language) => {
    setSelectedLanguage(language);
    setCode(language.defaultCode);
    setOutput("");
    setIsSaved(false);
    setCurrentUtilityId(null); // Reset utility ID when manually switching
  }, []);

  // Handle URL parameters for utility function loading
  useEffect(() => {
    try {
      const utilityId = searchParams.get('utilityId');
      const languageParam = searchParams.get('language');
      const codeParam = searchParams.get('code');
      const codeId = searchParams.get('codeId');

      if (codeId && !hasLoadedSharedCode) {
        setCurrentCodeId(codeId);
        
        // Always try to get the original shared code to save as fallback
        const sharedCode = getPlaygroundCode(codeId);
        if (sharedCode) {
          setOriginalGeneratedCode(sharedCode.code);
        }
        
        // First try to get persisted code from localStorage
        const persistedCode = getPersistedCode(codeId);
        if (persistedCode) {
          const lang = languages.find(l => l.id === persistedCode.language);
          if (lang) {
            setSelectedLanguage(lang);
            setCode(persistedCode.code);
            setOutput("");
            setHasLoadedSharedCode(true);
            return;
          }
        }
        
        // If no persisted code, use shared code from generator
        if (sharedCode) {
          const lang = languages.find(l => l.id === sharedCode.language);
          if (lang) {
            setSelectedLanguage(lang);
            setCode(sharedCode.code);
            setOutput("");
            setHasLoadedSharedCode(true);
            // Persist the code immediately for future page reloads
            persistPlaygroundCode(codeId, sharedCode.code, sharedCode.language);
          }
        }
      } else if (utilityId) {
        // Find utility function by ID
        const utility = sampleUtilityFunctions.find(func => func.id === utilityId);
        if (utility) {
          setCurrentUtilityId(utilityId);
          const lang = languages.find(l => l.id === utility.language);
          if (lang) {
            setSelectedLanguage(lang);
            setCode(utility.code);
          }
        }
      } else if (languageParam && codeParam) {
        // Fallback to legacy URL parameters
        const lang = languages.find(l => l.id === languageParam);
        if (lang) {
          setSelectedLanguage(lang);
          setCode(decodeURIComponent(codeParam));
        }
      }
    } catch (error) {
      console.error('Error in playground URL parameter processing:', error);
      // Reset to default state on error
      setHasLoadedSharedCode(false);
      setCurrentCodeId(null);
    }
  }, [searchParams, hasLoadedSharedCode]);

  // Persist code changes when user modifies code
  useEffect(() => {
    if (currentCodeId && hasLoadedSharedCode && code !== selectedLanguage.defaultCode) {
      // Debounce the persist operation to avoid too many writes
      const timeoutId = setTimeout(() => {
        persistPlaygroundCode(currentCodeId, code, selectedLanguage.id);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [code, selectedLanguage.id, selectedLanguage.defaultCode, currentCodeId, hasLoadedSharedCode]);

  // Function to convert current utility to different language
  const convertUtilityToLanguage = useCallback((targetLanguage: Language) => {
    if (!currentUtilityId) {
      // No utility loaded, just switch to default
      handleLanguageChange(targetLanguage);
      return;
    }

    const utility = sampleUtilityFunctions.find(func => func.id === currentUtilityId);
    if (!utility) {
      handleLanguageChange(targetLanguage);
      return;
    }

    try {
      // Try to get the multi-language version
      const convertedCode = convertToLanguage(utility.name, targetLanguage.id as 'javascript' | 'typescript' | 'python');
      if (convertedCode) {
        setSelectedLanguage(targetLanguage);
        setCode(convertedCode);
        setOutput("");
        setIsSaved(false);
      } else {
        // Fallback to default language switch
        handleLanguageChange(targetLanguage);
      }
    } catch (error) {
      // If conversion fails, fallback to default language switch
      console.warn(`Could not convert ${utility.name} to ${targetLanguage.name}:`, error);
      handleLanguageChange(targetLanguage);
    }
  }, [currentUtilityId, handleLanguageChange]);

  const handleCodeChange = useCallback((value: string | undefined) => {
    setCode(value || "");
    setIsSaved(false);
  }, []);

  const runCode = useCallback(async () => {
    if (!selectedLanguage.runnable) {
      setOutput("This language cannot be executed in the browser.");
      return;
    }

    setIsRunning(true);
    setOutput("Running...");

    try {
      if (selectedLanguage.id === "javascript") {
        // Create a safe execution environment
        const logs: string[] = [];
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;

        // Override console methods to capture output
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };
        console.error = (...args) => {
          logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
        };
        console.warn = (...args) => {
          logs.push('WARNING: ' + args.map(arg => String(arg)).join(' '));
        };

        try {
          // Execute the code
          const func = new Function(code);
          const result = func();
          
          if (result !== undefined) {
            logs.push('Return value: ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)));
          }
        } catch (error) {
          logs.push('ERROR: ' + (error as Error).message);
        } finally {
          // Restore original console methods
          console.log = originalConsoleLog;
          console.error = originalConsoleError;
          console.warn = originalConsoleWarn;
        }

        setOutput(logs.length > 0 ? logs.join('\n') : 'No output');
      } else if (selectedLanguage.id === "typescript") {
        // For TypeScript, we need to compile to JavaScript first
        try {
          // Import TypeScript dynamically
          const ts = await import('typescript');
          
          // Compile TypeScript to JavaScript
          const compilerOptions = {
            target: ts.ScriptTarget.ES2020,
            module: ts.ModuleKind.None,
            strict: false,
            esModuleInterop: true,
            skipLibCheck: true,
            removeComments: true,
          } as const;

          const result = ts.transpile(code, compilerOptions);
          
          // Create a safe execution environment for the compiled JS
          const logs: string[] = [];
          const originalConsoleLog = console.log;
          const originalConsoleError = console.error;
          const originalConsoleWarn = console.warn;

          // Override console methods to capture output
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
          };
          console.error = (...args) => {
            logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
          };
          console.warn = (...args) => {
            logs.push('WARNING: ' + args.map(arg => String(arg)).join(' '));
          };

          try {
            // Execute the compiled JavaScript
            const func = new Function(result);
            const executionResult = func();
            
            if (executionResult !== undefined) {
              logs.push('Return value: ' + (typeof executionResult === 'object' ? JSON.stringify(executionResult, null, 2) : String(executionResult)));
            }
          } catch (error) {
            logs.push('ERROR: ' + (error as Error).message);
          } finally {
            // Restore original console methods
            console.log = originalConsoleLog;
            console.error = originalConsoleError;
            console.warn = originalConsoleWarn;
          }

          setOutput(logs.length > 0 ? logs.join('\n') : 'No output');
        } catch (tsError) {
          setOutput('TypeScript compilation error: ' + (tsError as Error).message);
        }
      } else if (selectedLanguage.id === "python") {
        // Python execution with Pyodide
        try {
          const result = await pythonRuntime.runCode(code);
          
          if (result.success) {
            const output = result.output || 'Code executed successfully (no output)';
            const timing = `\n\n--- Execution completed in ${result.executionTime.toFixed(2)}ms ---`;
            setOutput(output + timing);
          } else {
            setOutput(`Python Error: ${result.error}\n\nOutput: ${result.output}`);
          }
        } catch (error) {
          setOutput(`Python Runtime Error: ${(error as Error).message}`);
        }
      }
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLanguage]);

  const resetCode = useCallback(() => {
    // If we have original generated code, reset to that
    if (originalGeneratedCode && currentCodeId) {
      setCode(originalGeneratedCode);
      setOutput("");
      setIsSaved(false);
      // Re-persist the original code
      persistPlaygroundCode(currentCodeId, originalGeneratedCode, selectedLanguage.id);
    } else {
      // Otherwise reset to default language code
      setCode(selectedLanguage.defaultCode);
      setOutput("");
      setIsSaved(false);
      
      // Clear persisted code if from generator
      if (currentCodeId) {
        clearPersistedCode(currentCodeId);
      }
    }
  }, [selectedLanguage.defaultCode, selectedLanguage.id, currentCodeId, originalGeneratedCode]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  }, [code]);

  const saveCode = useCallback(() => {
    // In a real app, this would save to a backend or local storage
    setIsSaved(true);
    // You could add a toast notification here
  }, []);

  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground.${selectedLanguage.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, selectedLanguage]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Code Playground</h2>
          <p className="text-muted-foreground">Write, run, and experiment with code in multiple languages</p>
        </div>
        
        {/* Language Selector */}
        <div className="flex flex-wrap gap-2">
          {languages.map((language) => (
            <Badge
              key={language.id}
              variant={selectedLanguage.id === language.id ? "default" : "secondary"}
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => currentUtilityId ? convertUtilityToLanguage(language) : handleLanguageChange(language)}
            >
              {language.name}
              {language.runnable && <Play className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
          {currentUtilityId && (
            <div className="text-xs text-muted-foreground flex items-center ml-2">
              <RefreshCw className="h-3 w-3 mr-1" />
              Auto-convert enabled
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-muted rounded-lg border border-border">
        <Button 
          onClick={runCode} 
          disabled={isRunning || !selectedLanguage.runnable || readOnly}
          size="sm"
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          {isRunning ? "Running..." : "Run"}
        </Button>
        
        <Button onClick={resetCode} variant="outline" size="sm" disabled={readOnly}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        
        <Button onClick={copyCode} variant="outline" size="sm">
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        
        <Button 
          onClick={saveCode} 
          variant="outline" 
          size="sm" 
          disabled={readOnly}
          className={isSaved ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaved ? "Saved" : "Save"}
        </Button>
        
        <Button onClick={downloadCode} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        
        <div className="ml-auto">
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor and Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-card-foreground">
              Editor
              <Badge variant="outline" className="text-xs">
                {selectedLanguage.name}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <MonacoEditor
              height="400px"
              language={selectedLanguage.id}
              value={code}
              onChange={handleCodeChange}
              theme={theme === "dark" ? "vs-dark" : "vs"}
              options={{
                readOnly,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                folding: true,
                glyphMargin: false,
                contextmenu: true,
                renderLineHighlight: "line",
                selectOnLineNumbers: true,
                bracketPairColorization: { enabled: true },
              }}
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-card-foreground">
              Output
              {selectedLanguage.runnable && (
                <Badge variant="outline" className="text-xs">
                  Interactive
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedLanguage.id === "python" && (
              <PythonStatus showDetails={false} />
            )}
            <div className="h-96 overflow-auto rounded-md border border-border bg-muted p-4">
              {selectedLanguage.id === "html" ? (
                <iframe
                  srcDoc={code}
                  className="w-full h-full border-none"
                  title="HTML Preview"
                  sandbox="allow-scripts"
                />
              ) : (
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                  {output || "Click 'Run' to execute your code..."}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Instructions */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-card-foreground mb-2">🚀 Getting Started</h4>
              <p className="text-muted-foreground">
                Select a language, write your code, and click Run to see the results. 
                The playground supports multiple programming languages.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-2">⚡ Features</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Syntax highlighting</li>
                <li>• Auto-completion</li>
                <li>• Error detection</li>
                <li>• Code sharing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-2">📋 Shortcuts</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Ctrl+Enter: Run code</li>
                <li>• Ctrl+S: Save code</li>
                <li>• Ctrl+/: Toggle comment</li>
                <li>• Ctrl+D: Duplicate line</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
