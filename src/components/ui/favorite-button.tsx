'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  functionId: string
  functionName: string
  language: string
  category: string
  className?: string
  showLabel?: boolean
}

export function FavoriteButton({ 
  functionId, 
  functionName, 
  language, 
  category,
  className,
  showLabel = false
}: FavoriteButtonProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore()
  const [isAnimating, setIsAnimating] = useState(false)
  
  const isCurrentlyFavorite = isFavorite(functionId)
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent parent link navigation
    e.stopPropagation()
    
    setIsAnimating(true)
    
    if (isCurrentlyFavorite) {
      removeFromFavorites(functionId)
    } else {
      addToFavorites({
        id: functionId,
        name: functionName,
        language,
        category
      })
    }
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 200)
  }
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleFavorite}
      className={cn(
        "p-2 h-auto transition-all duration-200",
        isAnimating && "scale-110",
        className
      )}
      title={isCurrentlyFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        className={cn(
          "w-4 h-4 transition-all duration-200",
          isCurrentlyFavorite 
            ? "fill-red-500 text-red-500" 
            : "text-muted-foreground hover:text-red-500",
          isAnimating && "scale-125"
        )} 
      />
      {showLabel && (
        <span className="ml-2 text-sm">
          {isCurrentlyFavorite ? "Favorited" : "Add to favorites"}
        </span>
      )}
    </Button>
  )
}
