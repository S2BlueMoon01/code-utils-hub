'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { Input } from './input'
import { Label } from './label'
import { Textarea } from './textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { 
  Plus, 
  Search, 
  Star, 
  Copy, 
  Edit, 
  Trash2, 
  Download,
  Eye,
  Code,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeSnippet {
  id: string
  title: string
  description: string
  code: string
  language: string
  tags: string[]
  author: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  likes: number
  views: number
  isLiked?: boolean
}

const languages = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'php', 'go', 'rust', 'html', 'css', 'sql'
]

const sampleSnippets: CodeSnippet[] = [
  {
    id: '1',
    title: 'Debounce Function',
    description: 'A utility function to debounce function calls',
    code: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
    language: 'javascript',
    tags: ['utility', 'performance', 'javascript'],
    author: 'CodeUtils Team',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    isPublic: true,
    likes: 42,
    views: 156,
    isLiked: false
  },
  {
    id: '2',
    title: 'Binary Search',
    description: 'Efficient binary search implementation',
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
    language: 'python',
    tags: ['algorithm', 'search', 'python'],
    author: 'Algorithm Expert',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
    isPublic: true,
    likes: 28,
    views: 98,
    isLiked: true
  },
  {
    id: '3',
    title: 'Responsive Grid CSS',
    description: 'CSS Grid layout that adapts to different screen sizes',
    code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}`,
    language: 'css',
    tags: ['css', 'responsive', 'grid'],
    author: 'UI Designer',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
    isPublic: true,
    likes: 15,
    views: 67,
    isLiked: false
  }
]

export function CodeSnippetManager() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>(sampleSnippets)
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>(sampleSnippets)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null)
  
  // New snippet form
  const [newSnippet, setNewSnippet] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: '',
    isPublic: true
  })

  // Get all unique tags
  const allTags = Array.from(new Set(snippets.flatMap(s => s.tags)))

  // Filter snippets
  useEffect(() => {
    let filtered = snippets

    if (searchQuery) {
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(snippet => snippet.language === selectedLanguage)
    }

    if (selectedTag !== 'all') {
      filtered = filtered.filter(snippet => snippet.tags.includes(selectedTag))
    }

    setFilteredSnippets(filtered)
  }, [snippets, searchQuery, selectedLanguage, selectedTag])

  const handleCreateSnippet = () => {
    const snippet: CodeSnippet = {
      id: Date.now().toString(),
      title: newSnippet.title,
      description: newSnippet.description,
      code: newSnippet.code,
      language: newSnippet.language,
      tags: newSnippet.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      author: 'You',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isPublic: newSnippet.isPublic,
      likes: 0,
      views: 0,
      isLiked: false
    }

    setSnippets([snippet, ...snippets])
    setNewSnippet({
      title: '',
      description: '',
      code: '',
      language: 'javascript',
      tags: '',
      isPublic: true
    })
    setShowCreateDialog(false)
  }

  const handleEditSnippet = (snippet: CodeSnippet) => {
    setEditingSnippet(snippet)
    setNewSnippet({
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      language: snippet.language,
      tags: snippet.tags.join(', '),
      isPublic: snippet.isPublic
    })
    setShowCreateDialog(true)
  }

  const handleUpdateSnippet = () => {
    if (!editingSnippet) return

    const updatedSnippet: CodeSnippet = {
      ...editingSnippet,
      title: newSnippet.title,
      description: newSnippet.description,
      code: newSnippet.code,
      language: newSnippet.language,
      tags: newSnippet.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      updatedAt: new Date().toISOString().split('T')[0],
      isPublic: newSnippet.isPublic
    }

    setSnippets(snippets.map(s => s.id === editingSnippet.id ? updatedSnippet : s))
    setEditingSnippet(null)
    setNewSnippet({
      title: '',
      description: '',
      code: '',
      language: 'javascript',
      tags: '',
      isPublic: true
    })
    setShowCreateDialog(false)
  }

  const handleDeleteSnippet = (id: string) => {
    setSnippets(snippets.filter(s => s.id !== id))
  }

  const handleLikeSnippet = (id: string) => {
    setSnippets(snippets.map(s => 
      s.id === id 
        ? { 
            ...s, 
            likes: s.isLiked ? s.likes - 1 : s.likes + 1,
            isLiked: !s.isLiked 
          }
        : s
    ))
  }

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      // Show success toast
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const handleDownloadSnippet = (snippet: CodeSnippet) => {
    const extension = snippet.language === 'javascript' ? 'js' : 
                     snippet.language === 'typescript' ? 'ts' :
                     snippet.language === 'python' ? 'py' :
                     snippet.language === 'java' ? 'java' :
                     snippet.language === 'cpp' ? 'cpp' :
                     snippet.language === 'csharp' ? 'cs' :
                     snippet.language === 'php' ? 'php' :
                     'txt'
    
    const blob = new Blob([snippet.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${snippet.title.replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Code Snippets</h2>
          <p className="text-muted-foreground">
            Save, organize, and share your favorite code snippets
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Snippet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSnippet ? 'Edit Snippet' : 'Create New Snippet'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newSnippet.title}
                  onChange={(e) => setNewSnippet({...newSnippet, title: e.target.value})}
                  placeholder="Enter snippet title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newSnippet.description}
                  onChange={(e) => setNewSnippet({...newSnippet, description: e.target.value})}
                  placeholder="Brief description of the snippet"
                />
              </div>
              
              <div>
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={newSnippet.language} 
                  onValueChange={(value) => setNewSnippet({...newSnippet, language: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newSnippet.tags}
                  onChange={(e) => setNewSnippet({...newSnippet, tags: e.target.value})}
                  placeholder="utility, algorithm, react"
                />
              </div>
              
              <div>
                <Label htmlFor="code">Code</Label>
                <Textarea
                  id="code"
                  value={newSnippet.code}
                  onChange={(e) => setNewSnippet({...newSnippet, code: e.target.value})}
                  placeholder="Paste your code here..."
                  className="font-mono text-sm min-h-[200px]"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newSnippet.isPublic}
                  onChange={(e) => setNewSnippet({...newSnippet, isPublic: e.target.checked})}
                />
                <Label htmlFor="isPublic">Make this snippet public</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={editingSnippet ? handleUpdateSnippet : handleCreateSnippet}
                  disabled={!newSnippet.title || !newSnippet.code}
                >
                  {editingSnippet ? 'Update' : 'Create'} Snippet
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowCreateDialog(false)
                    setEditingSnippet(null)
                    setNewSnippet({
                      title: '',
                      description: '',
                      code: '',
                      language: 'javascript',
                      tags: '',
                      isPublic: true
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map(lang => (
              <SelectItem key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Snippets Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSnippets.map((snippet) => (
          <Card key={snippet.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 min-w-0 flex-1">
                  <CardTitle className="text-lg leading-6 truncate">
                    {snippet.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {snippet.description}
                  </p>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSnippet(snippet)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSnippet(snippet.id)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="secondary" className="text-xs">
                  {snippet.language}
                </Badge>
                {snippet.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {snippet.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{snippet.tags.length - 2}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-md p-3">
                <pre className="text-xs overflow-x-auto">
                  <code className="line-clamp-6">
                    {snippet.code}
                  </code>
                </pre>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{snippet.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className={cn("h-3 w-3", snippet.isLiked && "fill-yellow-400 text-yellow-400")} />
                    <span>{snippet.likes}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[100px]">{snippet.author}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCode(snippet.code)}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLikeSnippet(snippet.id)}
                  className={cn(snippet.isLiked && "text-yellow-600")}
                >
                  <Star className={cn("h-4 w-4", snippet.isLiked && "fill-current")} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadSnippet(snippet)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredSnippets.length === 0 && (
        <div className="text-center py-12">
          <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No snippets found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedLanguage !== 'all' || selectedTag !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first snippet to get started'
            }
          </p>
          {!searchQuery && selectedLanguage === 'all' && selectedTag === 'all' && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Snippet
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
