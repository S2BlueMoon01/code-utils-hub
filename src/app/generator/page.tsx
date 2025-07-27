'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Wand2, Copy, Download, Sparkles, Code2, FileText, ChevronDown, ChevronUp, Plus, X } from 'lucide-react'

interface TestCase {
  id: number
  input: string
  expectedOutput: string
  description: string
}

const codeTemplates = {
  javascript: {
    simple: (name: string, description: string) => `/**
 * ${description}
 * @param {any} input - Input parameter
 * @returns {any} - Function result
 */
function ${name}(input) {
  // TODO: Implement ${description.toLowerCase()}
  return input;
}

// Usage example:
console.log(${name}('example'));`,
    
    withValidation: (name: string, description: string) => `/**
 * ${description}
 * @param {any} input - Input parameter
 * @returns {any} - Function result
 * @throws {Error} - When input is invalid
 */
function ${name}(input) {
  if (input == null) {
    throw new Error('Input cannot be null or undefined');
  }
  
  // TODO: Implement ${description.toLowerCase()}
  return input;
}

// Usage example:
try {
  const result = ${name}('example');
  console.log(result);
} catch (error) {
  console.error('Error:', error.message);
}`,

    async: (name: string, description: string) => `/**
 * ${description}
 * @param {any} input - Input parameter
 * @returns {Promise<any>} - Promise resolving to function result
 */
async function ${name}(input) {
  return new Promise((resolve, reject) => {
    try {
      // TODO: Implement async ${description.toLowerCase()}
      setTimeout(() => resolve(input), 100);
    } catch (error) {
      reject(error);
    }
  });
}

// Usage example:
${name}('example')
  .then(result => console.log(result))
  .catch(error => console.error('Error:', error));`
  },

  typescript: {
    simple: (name: string, description: string) => `/**
 * ${description}
 * @param input Input parameter
 * @returns Function result
 */
function ${name}<T>(input: T): T {
  // TODO: Implement ${description.toLowerCase()}
  return input;
}

// Usage example:
console.log(${name}('example'));`,
    
    withInterface: (name: string, description: string) => `interface ${name}Options {
  // Add options here
  strict?: boolean;
  format?: string;
}

interface ${name}Result<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * ${description}
 * @param input Input parameter
 * @param options Function options
 * @returns Function result
 */
function ${name}<T>(
  input: T, 
  options: ${name}Options = {}
): ${name}Result<T> {
  // TODO: Implement ${description.toLowerCase()}
  return {
    data: input,
    success: true
  };
}

// Usage example:
const result = ${name}('example', { strict: true });
console.log(result);`,

    generic: (name: string, description: string) => `/**
 * ${description}
 * @template T The type of input/output
 * @param input Input parameter
 * @returns Function result
 */
function ${name}<T extends string | number>(input: T): T {
  // TODO: Implement ${description.toLowerCase()}
  return input;
}

// Usage examples:
console.log(${name}('string example'));
console.log(${name}(42));`
  },

  python: {
    simple: (name: string, description: string) => `def ${name}(input_data):
    """
    ${description}
    
    Args:
        input_data: Input parameter
        
    Returns:
        Function result
    """
    # TODO: Implement ${description.toLowerCase()}
    return input_data

# Usage example:
result = ${name}("example")
print(result)`,
    
    withTyping: (name: string, description: string) => `from typing import Any, Optional, Union

def ${name}(input_data: Any) -> Any:
    """
    ${description}
    
    Args:
        input_data (Any): Input parameter
        
    Returns:
        Any: Function result
        
    Raises:
        ValueError: When input is invalid
    """
    if input_data is None:
        raise ValueError("Input cannot be None")
    
    # TODO: Implement ${description.toLowerCase()}
    return input_data

# Usage example:
try:
    result = ${name}("example")
    print(result)
except ValueError as e:
    print(f"Error: {e}")`,

    withDataclass: (name: string, description: string) => `from dataclasses import dataclass
from typing import Any, Optional

@dataclass
class ${name}Result:
    data: Any
    success: bool
    message: Optional[str] = None

def ${name}(input_data: Any) -> ${name}Result:
    """
    ${description}
    
    Args:
        input_data (Any): Input parameter
        
    Returns:
        ${name}Result: Function result with metadata
    """
    try:
        # TODO: Implement ${description.toLowerCase()}
        return ${name}Result(
            data=input_data,
            success=True
        )
    except Exception as e:
        return ${name}Result(
            data=None,
            success=False,
            message=str(e)
        )

# Usage example:
result = ${name}("example")
if result.success:
    print(result.data)
else:
    print(f"Error: {result.message}")`
  }
}

export default function GeneratorPage() {
  const [functionName, setFunctionName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof codeTemplates>('javascript')
  const [selectedTemplate, setSelectedTemplate] = useState('simple')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: 1, input: '', expectedOutput: '', description: '' }
  ])

  const addTestCase = () => {
    const newId = Math.max(...testCases.map(tc => tc.id)) + 1
    setTestCases([...testCases, { id: newId, input: '', expectedOutput: '', description: '' }])
  }

  const removeTestCase = (id: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter(tc => tc.id !== id))
    }
  }

  const updateTestCase = (id: number, field: 'input' | 'expectedOutput' | 'description', value: string) => {
    setTestCases(testCases.map(tc => 
      tc.id === id ? { ...tc, [field]: value } : tc
    ))
  }

  const generateTestCaseCode = (testCases: TestCase[]) => {
    if (!showAdvanced || testCases.every((tc: TestCase) => !tc.input.trim())) return ''
    
    const validTestCases = testCases.filter((tc: TestCase) => tc.input.trim())
    if (validTestCases.length === 0) return ''

    if (selectedLanguage === 'python') {
      return `

# Test cases
if __name__ == "__main__":
${validTestCases.map((tc: TestCase) => `    # ${tc.description || 'Test case'}
    test_input = ${tc.input}
    expected = ${tc.expectedOutput || 'None'}
    result = ${functionName.trim().replace(/[^a-zA-Z0-9]/g, '').replace(/^[0-9]/, '_$&')}(test_input)
    print(f"Input: {test_input}, Expected: {expected}, Got: {result}")
    assert result == expected, f"Expected {expected}, but got {result}"`).join('\n    \n')}`
    } else {
      return `

// Test cases
console.log('=== Test Cases ===');
${validTestCases.map((tc: TestCase) => `// ${tc.description || 'Test case'}
const testInput${tc.id} = ${tc.input};
const expected${tc.id} = ${tc.expectedOutput || 'undefined'};
const result${tc.id} = ${functionName.trim().replace(/[^a-zA-Z0-9]/g, '').replace(/^[0-9]/, '_$&')}(testInput${tc.id});
console.log(\`Input: \${testInput${tc.id}}, Expected: \${expected${tc.id}}, Got: \${result${tc.id}}\`);
console.assert(result${tc.id} === expected${tc.id}, \`Expected \${expected${tc.id}}, but got \${result${tc.id}}\`);`).join('\n\n')}`
    }
  }

  const generateCode = () => {
    if (!functionName.trim() || !description.trim()) return

    setIsGenerating(true)
    
    // Clean function name (remove spaces, special chars)
    const cleanName = functionName
      .trim()
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[0-9]/, '_$&')
    
    setTimeout(() => {
      const template = codeTemplates[selectedLanguage][selectedTemplate as keyof typeof codeTemplates[typeof selectedLanguage]]
      if (template) {
        const baseCode = template(cleanName, description.trim())
        const testCaseCode = generateTestCaseCode(testCases)
        const finalCode = baseCode + testCaseCode
        setGeneratedCode(finalCode)
      }
      setIsGenerating(false)
    }, 500)
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadCode = () => {
    const extension = selectedLanguage === 'python' ? 'py' : 
                    selectedLanguage === 'typescript' ? 'ts' : 'js'
    const filename = `${functionName || 'function'}.${extension}`
    
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Wand2 className="w-8 h-8 text-primary" />
            Code Generator
          </h1>
          <p className="text-muted-foreground">
            Generate utility function boilerplate from description
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Function Details
              </CardTitle>
              <CardDescription>
                Describe your function and we&apos;ll generate the code template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Function Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Function Name
                </label>
                <Input
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  placeholder="e.g., formatDate, validateEmail, debounce"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this function should do..."
                  rows={3}
                />
              </div>

              {/* Language Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Language
                </label>
                <Select value={selectedLanguage} onValueChange={(value: keyof typeof codeTemplates) => {
                  setSelectedLanguage(value)
                  setSelectedTemplate('simple')
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Template Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Template Style
                </label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(codeTemplates[selectedLanguage]).map((template) => (
                      <SelectItem key={template} value={template}>
                        {template.charAt(0).toUpperCase() + template.slice(1).replace(/([A-Z])/g, ' $1')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Advanced Settings
                  </label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="h-auto p-1"
                  >
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
                
                {showAdvanced && (
                  <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Test Cases
                      </label>
                      <div className="space-y-3">
                        {testCases.map((testCase, index) => (
                          <div key={testCase.id} className="space-y-2 border rounded-lg p-3 bg-background">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Test Case {index + 1}</span>
                              {testCases.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTestCase(testCase.id)}
                                  className="h-auto p-1 text-destructive hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <Input
                              placeholder="Description (optional)"
                              value={testCase.description}
                              onChange={(e) => updateTestCase(testCase.id, 'description', e.target.value)}
                              className="text-sm"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="Input value"
                                value={testCase.input}
                                onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                                className="text-sm"
                              />
                              <Input
                                placeholder="Expected output"
                                value={testCase.expectedOutput}
                                onChange={(e) => updateTestCase(testCase.id, 'expectedOutput', e.target.value)}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addTestCase}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Test Case
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateCode} 
                disabled={!functionName.trim() || !description.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Code */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  Generated Code
                  {generatedCode && (
                    <Badge variant="secondary">{selectedLanguage}</Badge>
                  )}
                </CardTitle>
                
                {generatedCode && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={copyCode}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadCode}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>
                Your generated function template ready to use
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedCode ? (
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                    {generatedCode}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Fill in the function details and click &quot;Generate Code&quot; to see your template</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Examples */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Examples</CardTitle>
            <CardDescription>
              Click on any example to auto-fill the form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => {
                  setFunctionName('formatDate')
                  setDescription('Format a date object into a readable string with various format options')
                }}
              >
                <div>
                  <div className="font-medium">Date Formatter</div>
                  <div className="text-sm text-muted-foreground">formatDate function</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => {
                  setFunctionName('validateEmail')
                  setDescription('Validate an email address using regex pattern and return boolean result')
                }}
              >
                <div>
                  <div className="font-medium">Email Validator</div>
                  <div className="text-sm text-muted-foreground">validateEmail function</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 text-left"
                onClick={() => {
                  setFunctionName('debounce')
                  setDescription('Create a debounced version of a function that delays execution until after a wait period')
                }}
              >
                <div>
                  <div className="font-medium">Debounce Utility</div>
                  <div className="text-sm text-muted-foreground">debounce function</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
