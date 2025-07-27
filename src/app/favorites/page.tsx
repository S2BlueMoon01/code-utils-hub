'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { FavoriteButton } from '@/components/ui/favorite-button'
import { Heart, Trash2, Calendar, Filter } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  const { favorites, clearFavorites, getFavoritesByLanguage, getFavoritesByCategory } = useFavoritesStore()
  const [filterBy, setFilterBy] = useState<'all' | 'language' | 'category'>('all')
  const [filterValue, setFilterValue] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'language'>('date')

  // Get unique languages and categories
  const uniqueLanguages = Array.from(new Set(favorites.map(fav => fav.language)))
  const uniqueCategories = Array.from(new Set(favorites.map(fav => fav.category)))

  // Filter favorites
  const getFilteredFavorites = () => {
    let filtered = [...favorites]
    
    if (filterBy === 'language' && filterValue !== 'all') {
      filtered = getFavoritesByLanguage(filterValue)
    } else if (filterBy === 'category' && filterValue !== 'all') {
      filtered = getFavoritesByCategory(filterValue)
    }
    
    // Sort favorites
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'language':
          return a.language.localeCompare(b.language)
        case 'date':
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })
    
    return filtered
  }

  const filteredFavorites = getFilteredFavorites()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Favorites</h1>
            <p className="text-muted-foreground">
              Your saved utility functions
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start exploring utility functions and add them to your favorites!
                </p>
                <Button asChild>
                  <Link href="/search">
                    Browse Functions
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Favorites</h1>
              <p className="text-muted-foreground">
                {favorites.length} saved utility functions
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={clearFavorites}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Sorting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filter Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by</label>
                <Select value={filterBy} onValueChange={(value: typeof filterBy) => {
                  setFilterBy(value)
                  setFilterValue('all')
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All favorites</SelectItem>
                    <SelectItem value="language">Language</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter Value */}
              <div>
                <label className="text-sm font-medium mb-2 block">Value</label>
                <Select 
                  value={filterValue} 
                  onValueChange={setFilterValue}
                  disabled={filterBy === 'all'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {filterBy === 'language' && uniqueLanguages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                    {filterBy === 'category' && uniqueCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort by</label>
                <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date added</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="language">Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results count */}
              <div className="flex items-end">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredFavorites.length} of {favorites.length} favorites
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((favorite) => (
            <Link key={favorite.id} href={`/utils/${favorite.id}`}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {favorite.name}
                        <Badge variant="secondary">{favorite.language}</Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Category: {favorite.category}
                      </CardDescription>
                    </div>
                    <FavoriteButton
                      functionId={favorite.id}
                      functionName={favorite.name}
                      language={favorite.language}
                      category={favorite.category}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Added {formatDate(favorite.addedAt)}</span>
                    </div>
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredFavorites.length === 0 && favorites.length > 0 && (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <Filter className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see more results.
                </p>
                <Button variant="outline" onClick={() => {
                  setFilterBy('all')
                  setFilterValue('all')
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
