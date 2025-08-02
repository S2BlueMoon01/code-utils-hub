'use client'

import React, { useState, useEffect } from 'react'
import { judge0API, SUPPORTED_LANGUAGES, DEFAULT_CODE_TEMPLATES } from '@/lib/judge0-api'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Textarea } from './textarea'
import { Loader2, Play, Code, Clock, MemoryStick } from 'lucide-react'

interface MultiLanguageExecutorProps {
  onCodeChange?: (code: string) => void
  initialLanguage?: string
  initialCode?: string
  showInput?: boolean
}

export function MultiLanguageExecutor({ 
  onCodeChange, 
  initialLanguage = 'cpp',
  initialCode,
  showInput = true
}: MultiLanguageExecutorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage)
  const [code, setCode] = useState(initialCode || DEFAULT_CODE_TEMPLATES[initialLanguage] || '')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [executionStats, setExecutionStats] = useState<{
    time?: string
    memory?: number
  } | null>(null)

  useEffect(() => {
    if (!initialCode) {
      const defaultCode = judge0API.getDefaultCode(selectedLanguage)
      setCode(defaultCode)
      onCodeChange?.(defaultCode)
    }
  }, [selectedLanguage, initialCode, onCodeChange])

  const handleLanguageChange = (languageKey: string) => {
    setSelectedLanguage(languageKey)
    if (!initialCode) {
      const defaultCode = judge0API.getDefaultCode(languageKey)
      setCode(defaultCode)
      onCodeChange?.(defaultCode)
    }
    setOutput('')
    setError('')
    setExecutionStats(null)
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    onCodeChange?.(newCode)
  }

  const executeCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to execute')
      return
    }

    setLoading(true)
    setOutput('')
    setError('')
    setExecutionStats(null)

    try {
      const result = await judge0API.executeCode(selectedLanguage, code, input)
      
      if (result.success) {
        setOutput(result.output)
        setExecutionStats({
          time: result.executionTime,
          memory: result.memory
        })
      } else {
        setError(result.error || 'Execution failed')
        if (result.output) {
          setOutput(result.output)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const supportedLanguages = judge0API.getSupportedLanguages()

  return (
    <div className="space-y-4">
      {/* Language Selection */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5" />
              Multi-Language Executor
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.key} value={lang.key}>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {lang.key.toUpperCase()}
                        </Badge>
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={executeCode} 
                disabled={loading || !code.trim()}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {loading ? 'Running...' : 'Run Code'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Code Editor */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Source Code ({SUPPORTED_LANGUAGES[selectedLanguage]?.name})
            </label>
            <Textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder={`Write your ${selectedLanguage} code here...`}
              className="font-mono text-sm min-h-[300px] resize-y"
            />
          </div>

          {/* Input Section */}
          {showInput && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Input (stdin) - Optional
              </label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input for your program..."
                className="font-mono text-sm min-h-[80px] resize-y"
              />
            </div>
          )}

          {/* Execution Stats */}
          {executionStats && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {executionStats.time && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Time: {executionStats.time}s</span>
                </div>
              )}
              {executionStats.memory && (
                <div className="flex items-center gap-1">
                  <MemoryStick className="h-4 w-4" />
                  <span>Memory: {Math.round(executionStats.memory / 1024)}KB</span>
                </div>
              )}
            </div>
          )}

          {/* Output Section */}
          {(output || error) && (
            <div className="space-y-2">
              <label className="text-sm font-medium block">
                Output
              </label>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <pre className="text-sm text-red-700 dark:text-red-400 whitespace-pre-wrap font-mono">
                    {error}
                  </pre>
                </div>
              )}
              
              {output && (
                <div className="bg-gray-50 dark:bg-gray-900 border rounded-md p-3">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {output}
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language Info */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="text-xs">
              {selectedLanguage.toUpperCase()}
            </Badge>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">
                {SUPPORTED_LANGUAGES[selectedLanguage]?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Server-side execution with 10s timeout and 128MB memory limit. 
                Code is executed in a secure sandboxed environment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
