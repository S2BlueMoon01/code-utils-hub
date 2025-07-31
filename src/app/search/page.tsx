'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { sampleUtilityFunctions, categories, popularTags } from '@/data/sample-functions'
import { UtilityFunction } from '@/types'
import { Search, Filter, SortAsc, SortDesc, Star, Eye } from 'lucide-react'
import { formatDownloads, formatRating } from '@/lib/utils/formatters'
import { FavoriteButton } from '@/components/ui/favorite-button'
import Link from 'next/link'

export default function SearchPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filteredFunctions, setFilteredFunctions] = useState<UtilityFunction[]>(sampleUtilityFunctions)
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState('all')

  const filterAndSortFunctions = useCallback(() => {
    setIsLoading(true)
    
    let filtered = [...sampleUtilityFunctions]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(func =>
        func.name.toLowerCase().includes(query) ||
        func.description.toLowerCase().includes(query) ||
        func.tags.some(tag => tag.toLowerCase().includes(query)) ||
        func.category.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(func => func.category === selectedCategory)
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(func => func.tags.includes(selectedTag))
    }

    // Filter by minimum rating
    if (minRating > 0) {
      filtered = filtered.filter(func => (func.rating || 0) >= minRating)
    }

    // Filter by language
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(func => func.language === selectedLanguage)
    }

    // Sort functions
    filtered.sort((a, b) => {
      let aValue: number | string = 0
      let bValue: number | string = 0

      switch (sortBy) {
        case 'popularity':
          aValue = a.usage_count || 0
          bValue = b.usage_count || 0
          break
        case 'rating':
          aValue = a.rating || 0
          bValue = b.rating || 0
          break
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'date':
          aValue = new Date(a.created_at || '').getTime()
          bValue = new Date(b.created_at || '').getTime()
          break
        default:
          aValue = a.usage_count || 0
          bValue = b.usage_count || 0
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
    })

    setFilteredFunctions(filtered)
    setIsLoading(false)
  }, [searchQuery, selectedCategory, selectedTag, sortBy, sortOrder, minRating, selectedLanguage])

  useEffect(() => {
    filterAndSortFunctions()
  }, [filterAndSortFunctions])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedTag('all')
    setSortBy('popularity')
    setSortOrder('desc')
    setMinRating(0)
    setSelectedLanguage('all')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('search.title')}</h1>
        <p className="text-muted-foreground">
          {t('search.subtitle')}
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            {t('search.filters.title', 'Search Filters')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('search.placeholder', 'Search functions, tags, or categories...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('search.filters.category', 'Category')}</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('search.filters.selectCategory', 'Select category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.filters.allCategories', 'All categories')}</SelectItem>
                  {categories.map((category, index) => (
                    <SelectItem key={`search-category-${index}-${category.id}`} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('search.filters.tag', 'Tag')}</label>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue placeholder={t('search.filters.selectTag', 'Select tag')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('search.filters.allTags', 'All tags')}</SelectItem>
                  {popularTags.map((tag, index) => (
                    <SelectItem key={`search-tag-select-${index}-${tag.name}`} value={tag.name}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('search.filters.sortBy', 'Sort by')}</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder={t('search.filters.sortBy', 'Sort by')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">{t('search.filters.views', 'Views')}</SelectItem>
                  <SelectItem value="rating">{t('search.filters.rating', 'Rating')}</SelectItem>
                  <SelectItem value="name">{t('search.filters.nameAZ', 'Name A-Z')}</SelectItem>
                  <SelectItem value="date">{t('search.filters.dateCreated', 'Date Created')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="text-sm font-medium mb-2 block">{t('search.filters.order', 'Order')}</label>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="w-full justify-start"
              >
                {sortOrder === 'asc' ? (
                  <>
                    <SortAsc className="w-4 h-4 mr-2" />
                    {t('search.filters.ascending', 'Ascending')}
                  </>
                ) : (
                  <>
                    <SortDesc className="w-4 h-4 mr-2" />
                    {t('search.filters.descending', 'Descending')}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showAdvancedFilters ? t('search.filters.hideAdvanced', 'Hide advanced filters') : t('search.filters.showAdvanced', 'Show advanced filters')}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              {/* Language Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t('search.filters.language', 'Language')}</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('search.filters.selectLanguage', 'Select language')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('search.filters.allLanguages', 'All languages')}</SelectItem>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Java">Java</SelectItem>
                    <SelectItem value="C#">C#</SelectItem>
                    <SelectItem value="Go">Go</SelectItem>
                    <SelectItem value="Rust">Rust</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Minimum Rating Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t('search.filters.minRating', 'Minimum Rating')}</label>
                <Select value={minRating.toString()} onValueChange={(value: string) => setMinRating(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('search.filters.selectRating', 'Select rating')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">{t('common.all', 'All')}</SelectItem>
                    <SelectItem value="1">⭐ {t('search.filters.onePlusStar', '1+ stars')}</SelectItem>
                    <SelectItem value="2">⭐ {t('search.filters.twoPlusStar', '2+ stars')}</SelectItem>
                    <SelectItem value="3">⭐ {t('search.filters.threePlusStar', '3+ stars')}</SelectItem>
                    <SelectItem value="4">⭐ {t('search.filters.fourPlusStar', '4+ stars')}</SelectItem>
                    <SelectItem value="4.5">⭐ {t('search.filters.fourHalfPlusStar', '4.5+ stars')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Placeholder for future filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t('search.filters.complexity', 'Complexity')}</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder={t('search.filters.selectComplexity', 'Select complexity')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all', 'All')}</SelectItem>
                    <SelectItem value="easy">{t('search.filters.easy', 'Easy')}</SelectItem>
                    <SelectItem value="medium">{t('search.filters.medium', 'Medium')}</SelectItem>
                    <SelectItem value="hard">{t('search.filters.hard', 'Hard')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Clear Filters */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              {t('search.results.found', 'Found {{count}} results', { count: filteredFunctions.length })}
            </span>
            <Button variant="outline" onClick={clearFilters}>
              {t('search.filters.clearFilters', 'Clear Filters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={`search-loading-skeleton-${i}`} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFunctions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('search.results.noResults', 'No results found')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('search.results.tryDifferent', 'Try changing your search keywords or filters')}
              </p>
              <Button onClick={clearFilters}>{t('search.filters.clearFilters', 'Clear Filters')}</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFunctions.map((func, index) => (
              <Link key={`search-result-${func.id}-${index}`} href={`/utils/${func.id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{func.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1 w-fit">
                          {func.category}
                        </Badge>
                      </div>
                      <FavoriteButton
                        functionId={func.id}
                        functionName={func.name}
                        language={func.language}
                        category={func.category}
                      />
                    </div>
                    <CardDescription className="line-clamp-2">
                      {func.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {func.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={`search-tag-${func.id}-${tagIndex}-${tag}`} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {func.tags.length > 3 && (
                          <Badge key={`search-more-tags-${func.id}`} variant="outline" className="text-xs">
                            +{func.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{formatRating(func.rating || 0).replace('⭐ ', '')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{formatDownloads(func.usage_count || 0).replace(' downloads', ' uses')}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {func.language}
                        </Badge>
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
  )
}
