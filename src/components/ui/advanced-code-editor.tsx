'use client'

import React, { useState, useRef, useEffect } from 'react'
import { editor } from 'monaco-editor'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { 
  Play, 
  Save, 
  Download, 
  Settings, 
  Copy, 
  RotateCcw, 
  Maximize2,
  Minimize2,
  FileText,
  Folder,
  Plus,
  X
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Label } from './label'
import { Switch } from './switch'
import { Slider } from './slider'
import { useAnalytics } from '@/lib/analytics'
import dynamic from 'next/dynamic'

// Dynamic import Monaco Editor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 w-full items-center justify-center rounded-md border bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto mb-2"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading advanced editor...</p>
      </div>
    </div>
  ),
})

interface EditorFile {
  id: string
  name: string
  language: string
  content: string
  modified: boolean
}

interface EditorSettings {
  theme: 'vs-dark' | 'light' | 'vs'
  fontSize: number
  wordWrap: boolean
  minimap: boolean
  lineNumbers: boolean
  autoComplete: boolean
  formatOnSave: boolean
  tabSize: number
}

const defaultSettings: EditorSettings = {
  theme: 'vs-dark',
  fontSize: 14,
  wordWrap: true,
  minimap: true,
  lineNumbers: true,
  autoComplete: true,
  formatOnSave: true,
  tabSize: 2
}

const languages = [
  { id: 'javascript', name: 'JavaScript', ext: 'js' },
  { id: 'typescript', name: 'TypeScript', ext: 'ts' },
  { id: 'python', name: 'Python', ext: 'py' },
  { id: 'java', name: 'Java', ext: 'java' },
  { id: 'cpp', name: 'C++', ext: 'cpp' },
  { id: 'csharp', name: 'C#', ext: 'cs' },
  { id: 'php', name: 'PHP', ext: 'php' },
  { id: 'go', name: 'Go', ext: 'go' },
  { id: 'rust', name: 'Rust', ext: 'rs' },
  { id: 'json', name: 'JSON', ext: 'json' },
  { id: 'html', name: 'HTML', ext: 'html' },
  { id: 'css', name: 'CSS', ext: 'css' },
  { id: 'markdown', name: 'Markdown', ext: 'md' }
]

export function AdvancedCodeEditor() {
  const [files, setFiles] = useState<EditorFile[]>([
    {
      id: '1',
      name: 'main.js',
      language: 'javascript',
      content: '// Welcome to Advanced Code Editor\nconsole.log("Hello, World!");',
      modified: false
    }
  ])
  const [activeFileId, setActiveFileId] = useState('1')
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showFileExplorer, setShowFileExplorer] = useState(true)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null) // Monaco editor reference
  const { trackCodeExecution, trackEvent } = useAnalytics()

  const activeFile = files.find(f => f.id === activeFileId)

  const createNewFile = () => {
    const fileNumber = files.length + 1
    const newFile: EditorFile = {
      id: Date.now().toString(),
      name: `file${fileNumber}.js`,
      language: 'javascript',
      content: '// New file\n',
      modified: false
    }
    setFiles([...files, newFile])
    setActiveFileId(newFile.id)
    
    trackEvent('file_created', {
      fileName: newFile.name,
      language: newFile.language,
      totalFiles: files.length + 1
    })
  }

  const closeFile = (fileId: string) => {
    if (files.length === 1) return // Keep at least one file
    
    const newFiles = files.filter(f => f.id !== fileId)
    setFiles(newFiles)
    
    if (activeFileId === fileId) {
      setActiveFileId(newFiles[0]?.id || '')
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFile || value === undefined) return
    
    const updatedFiles = files.map(f =>
      f.id === activeFileId
        ? { ...f, content: value, modified: true }
        : f
    )
    setFiles(updatedFiles)
  }

  const handleEditorMount = (editorInstance: editor.IStandaloneCodeEditor) => { // Monaco editor instance
    editorRef.current = editorInstance
    
    // Add custom keybindings (commented out due to monaco not being available in build)
    // editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    //   saveFile()
    // })
    
    // editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
    //   runCode()
    // })
  }

  const saveFile = () => {
    if (!activeFile) return
    
    setFiles(files.map(f =>
      f.id === activeFileId
        ? { ...f, modified: false }
        : f
    ))
    
    // Save to localStorage
    localStorage.setItem('advanced-editor-files', JSON.stringify(files))
    
    trackEvent('file_saved', {
      fileName: activeFile.name,
      language: activeFile.language,
      contentLength: activeFile.content.length
    })
  }

  const downloadFile = () => {
    if (!activeFile) return
    
    const blob = new Blob([activeFile.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = activeFile.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!activeFile) return
    
    try {
      await navigator.clipboard.writeText(activeFile.content)
      // Show success toast
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const runCode = async () => {
    if (!activeFile) return
    
    setIsRunning(true)
    setOutput('Running...')
    
    try {
      // Use Judge0 API instead of direct import
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: activeFile.content, 
          language: activeFile.language 
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to execute code')
      }
      
      const result = await response.json()
      const success = !result.error
      setOutput(result.output || result.error || 'Code executed')
      
      trackCodeExecution(activeFile.language, success)
    } catch (error) {
      const errorMessage = `Execution Error: ${(error as Error).message}`
      setOutput(errorMessage)
      trackCodeExecution(activeFile.language, false)
    } finally {
      setIsRunning(false)
    }
  }

  const formatCode = () => {
    if (editorRef.current) {
      const action = editorRef.current.getAction('editor.action.formatDocument')
      if (action) {
        action.run()
      }
    }
  }

  useEffect(() => {
    // Load saved files from localStorage
    const savedFiles = localStorage.getItem('advanced-editor-files')
    if (savedFiles) {
      try {
        const parsedFiles = JSON.parse(savedFiles)
        setFiles(parsedFiles)
      } catch (err) {
        console.error('Failed to load saved files:', err)
      }
    }
  }, [])

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'relative'}`}>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Advanced Code Editor
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFileExplorer(!showFileExplorer)}
              >
                <Folder className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editor Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select
                        value={settings.theme}
                        onValueChange={(value: 'vs-dark' | 'light' | 'vs') => setSettings({...settings, theme: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vs-dark">Dark</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="vs">Visual Studio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Font Size: {settings.fontSize}px</Label>
                      <Slider
                        value={[settings.fontSize]}
                        onValueChange={([value]: number[]) => setSettings({...settings, fontSize: value})}
                        min={10}
                        max={24}
                        step={1}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Word Wrap</Label>
                      <Switch
                        checked={settings.wordWrap}
                        onCheckedChange={(checked: boolean) => setSettings({...settings, wordWrap: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Minimap</Label>
                      <Switch
                        checked={settings.minimap}
                        onCheckedChange={(checked: boolean) => setSettings({...settings, minimap: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Line Numbers</Label>
                      <Switch
                        checked={settings.lineNumbers}
                        onCheckedChange={(checked: boolean) => setSettings({...settings, lineNumbers: checked})}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="flex h-[600px]">
            {/* File Explorer */}
            {showFileExplorer && (
              <div className="w-64 border-r bg-muted/30">
                <div className="p-2 border-b">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={createNewFile}
                    className="w-full justify-start"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New File
                  </Button>
                </div>
                
                <div className="p-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-muted ${
                        activeFileId === file.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setActiveFileId(file.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {file.name}
                          {file.modified && <span className="text-yellow-500 ml-1">●</span>}
                        </span>
                      </div>
                      
                      {files.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            closeFile(file.id)
                          }}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col">
              {/* File Tabs */}
              <div className="flex items-center border-b bg-muted/30">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-2 px-4 py-2 border-r cursor-pointer hover:bg-muted ${
                      activeFileId === file.id ? 'bg-background border-b-2 border-primary' : ''
                    }`}
                    onClick={() => setActiveFileId(file.id)}
                  >
                    <span className="text-sm">
                      {file.name}
                      {file.modified && <span className="text-yellow-500 ml-1">●</span>}
                    </span>
                    
                    {files.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          closeFile(file.id)
                        }}
                        className="h-4 w-4 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
                <Button
                  variant="default"
                  size="sm"
                  onClick={runCode}
                  disabled={isRunning}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run'}
                </Button>
                
                <Button variant="outline" size="sm" onClick={saveFile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                
                <Button variant="outline" size="sm" onClick={downloadFile}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                
                <Button variant="outline" size="sm" onClick={formatCode}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Format
                </Button>
                
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="secondary">
                    {languages.find(l => l.id === activeFile?.language)?.name || 'Unknown'}
                  </Badge>
                </div>
              </div>
              
              {/* Editor and Output */}
              <div className="flex-1 flex">
                <div className="flex-1">
                  {activeFile && (
                    <MonacoEditor
                      height="100%"
                      language={activeFile.language}
                      value={activeFile.content}
                      onChange={handleEditorChange}
                      onMount={handleEditorMount}
                      theme={settings.theme}
                      options={{
                        fontSize: settings.fontSize,
                        wordWrap: settings.wordWrap ? 'on' : 'off',
                        minimap: { enabled: settings.minimap },
                        lineNumbers: settings.lineNumbers ? 'on' : 'off',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        tabSize: settings.tabSize,
                        formatOnPaste: true,
                        formatOnType: true,
                      }}
                    />
                  )}
                </div>
                
                {/* Output Panel */}
                {output && (
                  <div className="w-1/3 border-l bg-muted/30">
                    <div className="p-2 border-b">
                      <h3 className="text-sm font-medium">Output</h3>
                    </div>
                    <div className="p-4">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {output}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
