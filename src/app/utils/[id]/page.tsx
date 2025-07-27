'use client'

import Link from 'next/link'
import { sampleUtilityFunctions } from '@/data/sample-functions';

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CommunityFeatures } from '@/components/community/CommunityFeatures'
import { UtilityFunction } from '@/types'
import { formatDate } from '@/lib/utils'
import { 
  Copy, 
  Star,
  Eye,
  Calendar,
  User,
  Code2,
  Play,
  Download,
  Share,
  Heart,
  MessageCircle,
  BookOpen
} from 'lucide-react'

export default function FunctionDetailPage() {
  const params = useParams()
  const [utility, setUtility] = useState<UtilityFunction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from database
    // For now, find from sample data
    const functionId = params.id as string
    const foundFunction = sampleUtilityFunctions.find((f: UtilityFunction) => f.id === functionId)
    
    if (foundFunction) {
      setUtility(foundFunction)
    }
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!utility) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Function not found</h1>
        <p className="text-muted-foreground mb-4">
          The function you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/utils">Browse Functions</Link>
        </Button>
      </div>
    )
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Show toast notification
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const openPlayground = () => {
    const playgroundUrl = `/playground?utilityId=${utility.id}`
    window.open(playgroundUrl, '_blank')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'javascript': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'typescript': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'python': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{utility.name}</h1>
            <p className="text-lg text-muted-foreground">{utility.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(utility.code)}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={openPlayground}>
              <Play className="w-4 h-4 mr-2" />
              Playground
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Badge className={getLanguageColor(utility.language)}>
            {utility.language}
          </Badge>
          <Badge className={getDifficultyColor(utility.difficulty)}>
            {utility.difficulty}
          </Badge>
          <Badge variant="outline">{utility.category}</Badge>
          
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{utility.rating?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{utility.usage_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{utility.likes_count || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{utility.comments_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center space-x-3 mt-4 p-4 bg-muted/50 rounded-lg">
          <Avatar className="w-10 h-10">
            <AvatarImage src={utility.author.avatar_url} alt={utility.author.username} />
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{utility.author.username}</div>
            <div className="text-sm text-muted-foreground flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Updated {formatDate(utility.updated_at)}</span>
            </div>
          </div>
          <div className="ml-auto">
            <Badge variant="outline">{utility.author.role}</Badge>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="code" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="code" className="flex items-center space-x-2">
            <Code2 className="w-4 h-4" />
            <span>Code</span>
          </TabsTrigger>
          <TabsTrigger value="examples" className="flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Examples</span>
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Documentation</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Community</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Source Code</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(utility.code)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{utility.code}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples">
          <div className="space-y-4">
            {utility.examples.map((example) => (
              <Card key={example.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Code</h4>
                      <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                    {example.output && (
                      <div>
                        <h4 className="font-medium mb-2">Output</h4>
                        <pre className="bg-primary/5 p-3 rounded-lg text-sm">
                          <code>{example.output}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Parameters</h3>
                {utility.testCases.length > 0 ? (
                  <div className="space-y-3">
                    {utility.testCases.map((testCase, index) => (
                      <div key={testCase.id} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Test Case {index + 1}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{testCase.description}</p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Input:</span>
                            <pre className="bg-muted p-2 rounded mt-1">
                              <code>{JSON.stringify(testCase.input, null, 2)}</code>
                            </pre>
                          </div>
                          <div>
                            <span className="font-medium">Expected Output:</span>
                            <pre className="bg-muted p-2 rounded mt-1">
                              <code>{JSON.stringify(testCase.expected_output, null, 2)}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No test cases available.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {utility.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <CommunityFeatures functionId={utility.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
