'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Search, 
  Calendar, 
  Clock, 
  Tag,
  BookOpen,
  TrendingUp,
  Star,
  Eye,
  MessageCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  readTime: number
  category: string
  tags: string[]
  views: number
  likes: number
  comments: number
  featured: boolean
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    'all',
    'JavaScript',
    'TypeScript', 
    'React',
    'Next.js',
    'Node.js',
    'Best Practices',
    'Tutorials',
    'Tips & Tricks'
  ]

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: '10 JavaScript Utility Functions Every Developer Should Know',
      excerpt: 'Khám phá 10 utility functions JavaScript hữu ích nhất giúp bạn viết code hiệu quả hơn và tiết kiệm thời gian phát triển.',
      content: '',
      author: {
        name: 'Nguyễn Văn A',
        avatar: '/avatars/author1.jpg'
      },
      publishedAt: '2024-01-15',
      readTime: 8,
      category: 'JavaScript',
      tags: ['javascript', 'utilities', 'functions', 'tips'],
      views: 2340,
      likes: 156,
      comments: 23,
      featured: true
    },
    {
      id: '2',
      title: 'Building Type-Safe Utility Functions with TypeScript',
      excerpt: 'Hướng dẫn chi tiết cách xây dựng các utility functions an toàn kiểu dữ liệu với TypeScript.',
      content: '',
      author: {
        name: 'Trần Thị B',
        avatar: '/avatars/author2.jpg'
      },
      publishedAt: '2024-01-12',
      readTime: 12,
      category: 'TypeScript',
      tags: ['typescript', 'type-safety', 'utilities', 'advanced'],
      views: 1890,
      likes: 134,
      comments: 18,
      featured: true
    },
    {
      id: '3',
      title: 'React Hooks: Custom Utility Hooks for Better Code',
      excerpt: 'Tạo ra các custom hooks hữu ích để tái sử dụng logic và làm cho React components của bạn sạch sẽ hơn.',
      content: '',
      author: {
        name: 'Lê Văn C',
        avatar: '/avatars/author3.jpg'
      },
      publishedAt: '2024-01-10',
      readTime: 15,
      category: 'React',
      tags: ['react', 'hooks', 'custom-hooks', 'utilities'],
      views: 3120,
      likes: 245,
      comments: 31,
      featured: false
    },
    {
      id: '4',
      title: 'Next.js 15: New Features and Utility Improvements',
      excerpt: 'Tổng quan về các tính năng mới và cải tiến utility functions trong Next.js 15.',
      content: '',
      author: {
        name: 'Phạm Thị D',
        avatar: '/avatars/author4.jpg'
      },
      publishedAt: '2024-01-08',
      readTime: 10,
      category: 'Next.js',
      tags: ['nextjs', 'nextjs15', 'features', 'updates'],
      views: 1567,
      likes: 98,
      comments: 12,
      featured: false
    },
    {
      id: '5',
      title: 'Code Performance: Optimizing JavaScript Utilities',
      excerpt: 'Các kỹ thuật tối ưu hóa performance cho JavaScript utility functions để đạt hiệu suất tối đa.',
      content: '',
      author: {
        name: 'Hoàng Văn E',
        avatar: '/avatars/author5.jpg'
      },
      publishedAt: '2024-01-05',
      readTime: 18,
      category: 'Best Practices',
      tags: ['performance', 'optimization', 'javascript', 'utilities'],
      views: 2890,
      likes: 187,
      comments: 25,
      featured: false
    },
    {
      id: '6',
      title: 'Testing Your Utility Functions: A Complete Guide',
      excerpt: 'Hướng dẫn toàn diện về việc test các utility functions với Jest, Vitest và các công cụ testing khác.',
      content: '',
      author: {
        name: 'Vũ Thị F',
        avatar: '/avatars/author6.jpg'
      },
      publishedAt: '2024-01-03',
      readTime: 14,
      category: 'Best Practices',
      tags: ['testing', 'jest', 'vitest', 'utilities', 'tdd'],
      views: 1745,
      likes: 123,
      comments: 19,
      featured: false
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const featuredPosts = blogPosts.filter(post => post.featured)
  const trendingPosts = [...blogPosts].sort((a, b) => b.views - a.views).slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog & Tutorials</h1>
        <p className="text-muted-foreground">
          Chia sẻ kiến thức, tips và tutorials về utility functions và web development
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'Tất cả' : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Bài viết nổi bật
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          <Badge variant="outline">Featured</Badge>
                        </div>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Avatar className="w-4 h-4">
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{post.author.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.readTime} min</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Tất cả bài viết ({filteredPosts.length})
            </h2>
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Không tìm thấy bài viết</h3>
                  <p className="text-muted-foreground">
                    Thử thay đổi từ khóa tìm kiếm hoặc category
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{post.category}</Badge>
                              {post.featured && <Badge variant="outline">Featured</Badge>}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-4">
                              {post.tags.slice(0, 4).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Meta info */}
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Avatar className="w-5 h-5">
                                    <AvatarImage src={post.author.avatar} />
                                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{post.author.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{post.readTime} min đọc</span>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <div className="flex gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.filter(cat => cat !== 'all').map((category) => {
                  const count = blogPosts.filter(post => post.category === category).length
                  return (
                    <div key={category} className="flex justify-between items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Newsletter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Đăng ký để nhận những bài viết mới nhất về utility functions và web development.
              </p>
              <div className="space-y-2">
                <Input placeholder="Email của bạn" />
                <Button className="w-full">Đăng ký</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
