'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Sparkles, Code, TestTube } from 'lucide-react'
import { UtilityFunction } from '@/types'
import { storeCodeInPlayground } from '@/lib/playground-storage'
import { toast } from 'sonner'

interface AIPromptGeneratorProps {
  utilityFunction: UtilityFunction
}

export function AIPromptGenerator({ utilityFunction }: AIPromptGeneratorProps) {
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePrompt = async () => {
    setIsGenerating(true)
    
    // Simulate AI prompt generation delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const prompt = `Please create a ${utilityFunction.language} function that meets the following specifications:

**Function Name:** ${utilityFunction.name}

**Description:** ${utilityFunction.description}

**Requirements:**
- Write clean, well-documented code
- Follow ${
  utilityFunction.language === 'javascript' ? 'JavaScript' : 
  utilityFunction.language === 'typescript' ? 'TypeScript' : 
  utilityFunction.language === 'python' ? 'Python' : 
  utilityFunction.language === 'java' ? 'Java' :
  utilityFunction.language === 'csharp' ? 'C#' :
  utilityFunction.language === 'cpp' ? 'C++' :
  utilityFunction.language === 'go' ? 'Go' :
  utilityFunction.language === 'rust' ? 'Rust' :
  utilityFunction.language === 'php' ? 'PHP' :
  utilityFunction.language === 'ruby' ? 'Ruby' :
  utilityFunction.language
} best practices
- Include proper error handling where appropriate
- Add comprehensive comments explaining the logic
- Ensure the function is reusable and maintainable

**Category:** ${utilityFunction.category}
**Difficulty Level:** ${utilityFunction.difficulty}

${utilityFunction.testCases && utilityFunction.testCases.length > 0 ? `
**Test Cases:**
${utilityFunction.testCases.map((testCase, index) => `
${index + 1}. Input: ${typeof testCase.input === 'string' ? `"${testCase.input}"` : testCase.input}
   Expected Output: ${typeof testCase.expected_output === 'string' ? `"${testCase.expected_output}"` : testCase.expected_output}
   Description: ${testCase.description}
`).join('')}

Please ensure your implementation passes all the test cases above.
` : ''}

**Additional Guidelines:**
- Write unit tests for the function if possible
- Optimize for both readability and performance
- Consider edge cases and handle them appropriately
- If using TypeScript, include proper type definitions
- Add examples of how to use the function

Please provide the complete implementation with explanations of your approach.`

    setGeneratedPrompt(prompt)
    setIsGenerating(false)
  }

  const copyPrompt = async () => {
    if (!generatedPrompt) return
    
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      toast.success('Prompt copied to clipboard!')
    } catch {
      toast.error('Failed to copy prompt')
    }
  }

  const sendToPlayground = () => {
    try {
      storeCodeInPlayground({
        code: utilityFunction.code,
        language: utilityFunction.language
      })
      toast.success('Code sent to playground!')
    } catch {
      toast.error('Failed to send code to playground')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Prompt Generator
        </CardTitle>
        <CardDescription>
          Generate optimized prompts for AI code assistants like ChatGPT, Claude, or GitHub Copilot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Function Overview */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Function Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><strong>Name:</strong> {utilityFunction.name}</p>
              <p><strong>Description:</strong> {utilityFunction.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <strong>Language:</strong>
                <Badge variant="secondary">{utilityFunction.language}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <strong>Category:</strong>
                <Badge variant="outline">{utilityFunction.category}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <strong>Difficulty:</strong>
                <Badge variant={
                  utilityFunction.difficulty === 'beginner' ? 'default' :
                  utilityFunction.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                }>
                  {utilityFunction.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cases Preview */}
        {utilityFunction.testCases && utilityFunction.testCases.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test Cases ({utilityFunction.testCases.length})
            </h3>
            <div className="space-y-2">
              {utilityFunction.testCases.slice(0, 3).map((testCase, index) => (
                <div key={testCase.id} className="bg-muted p-3 rounded-lg text-sm">
                  <p><strong>Test {index + 1}:</strong> {testCase.description}</p>
                  <p><strong>Input:</strong> {typeof testCase.input === 'string' ? `"${testCase.input}"` : String(testCase.input)}</p>
                  <p><strong>Expected:</strong> {typeof testCase.expected_output === 'string' ? `"${testCase.expected_output}"` : String(testCase.expected_output)}</p>
                </div>
              ))}
              {utilityFunction.testCases.length > 3 && (
                <p className="text-sm text-muted-foreground">
                  +{utilityFunction.testCases.length - 3} more test cases will be included in the prompt
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={generatePrompt} 
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate Prompt'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={copyPrompt} 
            disabled={!generatedPrompt}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Prompt
          </Button>
          
          <Button 
            variant="outline" 
            onClick={sendToPlayground}
            className="flex items-center gap-2"
          >
            <Code className="h-4 w-4" />
            Send to Playground
          </Button>
        </div>

        {/* Generated Prompt */}
        {generatedPrompt && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Generated AI Prompt</h3>
            <Textarea 
              value={generatedPrompt}
              readOnly
              className="min-h-[300px] font-mono text-sm"
              placeholder="Generated prompt will appear here..."
              aria-label="Generated prompt"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Prompt length: {generatedPrompt.length} characters</span>
              <span>Optimized for AI code assistants</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
