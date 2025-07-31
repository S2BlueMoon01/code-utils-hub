'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Wand2, Copy, Download, Sparkles, Code2, FileText, ChevronDown, ChevronUp, Plus, X, Play, MessageSquare, Zap } from 'lucide-react'
import { storePlaygroundCode } from '@/lib/playground-storage'

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
  const { t } = useTranslation()
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
  
  // New states for prompt functionality
  const [showPromptModal, setShowPromptModal] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  
  const generatePromptForAI = () => {
    if (!functionName.trim() || !description.trim()) {
      setGeneratedPrompt('Please fill in function name and description first.')
      return
    }

    // Clean function name
    const cleanName = functionName
      .trim()
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[0-9]/, '_$&')

    // Get the current template
    const template = codeTemplates[selectedLanguage][selectedTemplate as keyof typeof codeTemplates[typeof selectedLanguage]]
    const templateCode = template ? template(cleanName, description.trim()) : ''

    // Map language to proper name
    const languageMap: Record<string, string> = {
      javascript: 'JavaScript',
      typescript: 'TypeScript', 
      python: 'Python'
    }

    // Map template to code type
    const codeTypeMap: Record<string, string> = {
      simple: 'function',
      withValidation: 'function with validation',
      advanced: 'advanced function',
      generic: 'generic function',
      async: 'async function',
      class: 'class',
      withTypes: 'typed function'
    }

    const prompt = `Generate an optimized ${languageMap[selectedLanguage]} ${codeTypeMap[selectedTemplate] || 'function'} based on the provided template and requirements. The code should be efficient, follow best practices, handle edge cases, and be production-ready for web applications. Implement the functionality described in the template's comments or TODO section.

**Important:** Return only the completed code, no explanations or additional text.

## 📋 TEMPLATE
\`\`\`${selectedLanguage}
${templateCode}
\`\`\`

## 🎯 REQUIREMENTS
${description.trim()}

${testCases.length > 0 && testCases.some(tc => tc.input || tc.expectedOutput) ? `
## 🧪 TEST CASES
Expected behavior:
${testCases.filter(tc => tc.input || tc.expectedOutput).map((tc, index) => 
  `${index + 1}. ${tc.description || `Test case ${index + 1}`}
   - Input: ${tc.input || 'Not specified'}
   - Expected Output: ${tc.expectedOutput || 'Not specified'}`
).join('\n')}
` : ''}

## 🔧 TECHNICAL SPECIFICATIONS
- Language: ${languageMap[selectedLanguage]}
- Code Type: ${codeTypeMap[selectedTemplate] || 'function'}
- Performance: Optimize for efficiency and minimal resource usage
- Error Handling: Include comprehensive error handling for edge cases
- Type Safety: Use strict typing (if applicable)
- Best Practices: Follow language-specific conventions and patterns
- Browser Compatibility: Ensure compatibility with modern browsers
- Security: Implement proper input validation and sanitization

## 📝 OUTPUT FORMAT
- Return only the complete, executable code
- Include proper JSDoc comments for functions
- Use descriptive variable and function names
- Implement proper error boundaries
- Add inline comments for complex logic
- Follow consistent code formatting

## ✅ QUALITY CHECKLIST
Ensure the code has:
- ✅ Proper error handling
- ✅ Input validation
- ✅ Performance optimization
- ✅ Clear documentation
- ✅ Edge case handling
- ✅ Security considerations
- ✅ Type safety (if applicable)
- ✅ Clean, readable structure`

    setGeneratedPrompt(prompt)
    setShowPromptModal(true)
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy prompt:', err)
    }
  }

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

  const openInPlayground = () => {
    if (!generatedCode) {
      console.warn('No generated code to open in playground')
      return
    }
    
    try {
      const codeId = storePlaygroundCode({
        language: selectedLanguage,
        code: generatedCode,
        functionName: functionName.trim(),
        description: description.trim()
      })
      
      const playgroundUrl = `/playground?codeId=${codeId}`
      
      // Try to open in new tab with improved popup detection
      const newWindow = window.open(playgroundUrl, '_blank', 'noopener,noreferrer')
      
      // Better popup blocked detection
      if (!newWindow) {
        console.warn('Popup was blocked by browser. Playground could not be opened in new tab.')
        return
      }
      
      // Additional check after a brief delay to ensure window opened successfully
      setTimeout(() => {
        if (newWindow.closed) {
          console.warn('New tab was closed immediately, popup may have been blocked.')
        }
      }, 100)
    } catch (error) {
      console.error('Failed to open in playground:', error)
      // Fallback to URL encoding if storage fails
      try {
        const encodedCode = encodeURIComponent(generatedCode)
        const playgroundUrl = `/playground?language=${selectedLanguage}&code=${encodedCode}`
        const newWindow = window.open(playgroundUrl, '_blank', 'noopener,noreferrer')
        
        if (!newWindow) {
          console.warn('Popup was blocked by browser. Playground could not be opened in new tab.')
          return
        }
        
        // Additional check for fallback method too
        setTimeout(() => {
          if (newWindow.closed) {
            console.warn('New tab was closed immediately, popup may have been blocked.')
          }
        }, 100)
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError)
        alert('Failed to open playground. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Wand2 className="w-8 h-8 text-primary" />
            {t('generator.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('generator.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('generator.form.functionDetails', 'Function Details')}
              </CardTitle>
              <CardDescription>
                {t('generator.form.description', 'Describe your function and we\'ll generate the code template')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Function Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('generator.form.functionName', 'Function Name')}
                </label>
                <Input
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  placeholder={t('generator.form.functionNamePlaceholder', 'e.g., formatDate, validateEmail, debounce')}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('generator.form.descriptionLabel', 'Description')}
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('generator.form.descriptionPlaceholder', 'Describe what this function should do...')}
                  rows={3}
                />
              </div>

              {/* Language Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t('generator.form.language', 'Language')}
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
                  {t('generator.form.templateStyle', 'Template Style')}
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
                    {t('generator.form.advancedSettings', 'Advanced Settings')}
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
                        {t('generator.form.testCases', 'Test Cases')}
                      </label>
                      <div className="space-y-3">
                        {testCases.map((testCase, index) => (
                          <div key={testCase.id} className="space-y-2 border rounded-lg p-3 bg-background">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{t('generator.form.testCase', 'Test Case')} {index + 1}</span>
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
                              placeholder={t('generator.form.descriptionOptional', 'Description (optional)')}
                              value={testCase.description}
                              onChange={(e) => updateTestCase(testCase.id, 'description', e.target.value)}
                              className="text-sm"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder={t('generator.form.inputValue', 'Input value')}
                                value={testCase.input}
                                onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                                className="text-sm"
                              />
                              <Input
                                placeholder={t('generator.form.expectedOutput', 'Expected output')}
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
                          {t('generator.form.addTestCase', 'Add Test Case')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={generateCode} 
                  disabled={!functionName.trim() || !description.trim() || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                      {t('generator.buttons.generating', 'Generating...')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t('generator.buttons.generateCode', 'Generate Code')}
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={generatePromptForAI}
                  disabled={!functionName.trim() || !description.trim()}
                  className="w-full"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {t('generator.buttons.generateAIPrompt', 'Generate AI Prompt')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Code */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  {t('generator.output.title', 'Generated Code')}
                  {generatedCode && (
                    <Badge variant="secondary">{selectedLanguage}</Badge>
                  )}
                </CardTitle>
                
                {generatedCode && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={openInPlayground}>
                      <Play className="w-4 h-4 mr-2" />
                      {t('generator.output.runInPlayground', 'Run in Playground')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyCode}>
                      <Copy className="w-4 h-4 mr-2" />
                      {t('generator.output.copy', 'Copy')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadCode}>
                      <Download className="w-4 h-4 mr-2" />
                      {t('generator.output.download', 'Download')}
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>
                {t('generator.output.description', 'Your generated function template ready to use')}
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
                  <p>{t('generator.output.placeholder', 'Fill in the function details and click "Generate Code" to see your template')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Examples */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('generator.examples.title', 'Quick Examples')}</CardTitle>
            <CardDescription>
              {t('generator.examples.description', 'Click on any example to auto-fill the form')}
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
                  <div className="font-medium">{t('generator.examples.dateFormatter', 'Date Formatter')}</div>
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
                  <div className="font-medium">{t('generator.examples.emailValidator', 'Email Validator')}</div>
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
                  <div className="font-medium">{t('generator.examples.debounceUtility', 'Debounce Utility')}</div>
                  <div className="text-sm text-muted-foreground">debounce function</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Prompt Section */}
      {showPromptModal && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t('generator.prompt.title', 'AI Prompt Generated')}
              </CardTitle>
              <Button onClick={() => setShowPromptModal(false)} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>
              {t('generator.prompt.description', 'Copy this prompt and send it to any AI (GPT-4, Claude, Gemini) to generate your code')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                {t('generator.prompt.readyToCopy', 'Ready to copy & paste')}
              </Badge>
              <Button onClick={copyPrompt} variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                {t('generator.prompt.copyPrompt', 'Copy Prompt')}
              </Button>
            </div>
            
            <div className="bg-muted rounded-lg p-4 border max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {generatedPrompt}
              </pre>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 {t('generator.prompt.howToUse', 'How to use this prompt:')}
              </h4>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                <li>{t('generator.prompt.step1', 'Copy the prompt above using the "Copy Prompt" button')}</li>
                <li>{t('generator.prompt.step2', 'Go to your favorite AI (ChatGPT, Claude, Gemini, etc.)')}</li>
                <li>{t('generator.prompt.step3', 'Paste the prompt and send it')}</li>
                <li>{t('generator.prompt.step4', 'The AI will generate optimized, production-ready code')}</li>
                <li>{t('generator.prompt.step5', 'Copy the generated code back to your project')}</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
