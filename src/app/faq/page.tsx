'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  MessageCircle,
  Mail,
  Book
} from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

export default function FAQPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const categories = [
    'all',
    'gettingStarted',
    'functions',
    'community',
    'account',
    'technical',
    'billing'
  ]

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: t('faq.questions.whatIs.question'),
      answer: t('faq.questions.whatIs.answer'),
      category: 'gettingStarted',
      tags: ['platform', 'overview', 'basics']
    },
    {
      id: '2',
      question: t('faq.questions.howToUse.question'),
      answer: t('faq.questions.howToUse.answer'),
      category: 'functions',
      tags: ['usage', 'library', 'functions']
    },
    {
      id: '3',
      question: t('faq.questions.howToContribute.question'),
      answer: t('faq.questions.howToContribute.answer'),
      category: 'community',
      tags: ['contribute', 'community', 'submission']
    },
    {
      id: '4',
      question: t('faq.questions.isItFree.question'),
      answer: t('faq.questions.isItFree.answer'),
      category: 'billing',
      tags: ['free', 'pricing', 'cost']
    },
    {
      id: '5',
      question: t('faq.questions.whatLanguages.question'),
      answer: t('faq.questions.whatLanguages.answer'),
      category: 'technical',
      tags: ['languages', 'support', 'javascript', 'python']
    },
    {
      id: '6',
      question: t('faq.questions.howToSearch.question'),
      answer: t('faq.questions.howToSearch.answer'),
      category: 'functions',
      tags: ['search', 'filter', 'find']
    }
  ]

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const expandAll = () => {
    setExpandedItems(new Set(filteredFAQs.map(item => item.id)))
  }

  const collapseAll = () => {
    setExpandedItems(new Set())
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('faq.title')}</h1>
        <p className="text-muted-foreground">
          {t('faq.subtitle')}
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('faq.search.placeholder')}
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
                  {t(`faq.categories.${category}`)}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                {t('common.expandAll', 'Expand All')}
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                {t('common.collapseAll', 'Collapse All')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* FAQ List */}
        <div className="lg:col-span-3">
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('faq.noResults')}</h3>
                <p className="text-muted-foreground">
                  {t('faq.tryDifferentSearch', 'Try changing your search keywords or category')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((item) => (
                <Card key={item.id} className="transition-shadow hover:shadow-md">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{item.category}</Badge>
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="text-left text-lg">
                          {item.question}
                        </CardTitle>
                      </div>
                      {expandedItems.has(item.id) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedItems.has(item.id) && (
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{t('faq.stats.title', 'FAQ Stats')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">{t('faq.stats.totalQuestions', 'Total Questions')}</span>
                  <Badge variant="outline">{faqItems.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t('faq.stats.categories', 'Categories')}</span>
                  <Badge variant="outline">{categories.length - 1}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">{t('faq.stats.showing', 'Showing')}</span>
                  <Badge variant="outline">{filteredFAQs.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Categories */}
          <Card>
            <CardHeader>
              <CardTitle>{t('faq.popularCategories', 'Popular Categories')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.filter(cat => cat !== 'all').map((category) => {
                  const count = faqItems.filter(item => item.category === category).length
                  return (
                    <div key={category} className="flex justify-between items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {t(`faq.categories.${category}`)}
                      </Button>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Need More Help */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {t('faq.needMoreHelp', 'Need More Help?')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('faq.cantFindAnswer', 'Can\'t find the answer? We\'re here to help!')}
              </p>
              <div className="space-y-2">
                <Link href="/contact">
                  <Button className="w-full" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    {t('faq.contactSupport', 'Contact Support')}
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button className="w-full" variant="outline">
                    <Book className="w-4 h-4 mr-2" />
                    {t('faq.viewDocs', 'View Documentation')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
