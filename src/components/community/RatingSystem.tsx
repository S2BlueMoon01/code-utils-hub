"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { AnimatedList, AnimatedListItem, FadeIn } from '@/components/ui/motion'
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  MoreHorizontal,
  Flag,
  User
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface Review {
  id: string
  user_id: string
  function_id: string
  rating: number
  comment: string
  helpful_count: number
  created_at: string
  updated_at: string
  user: {
    id: string
    username: string
    avatar_url?: string
    reputation: number
  }
}

interface RatingStats {
  average: number
  total: number
  distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

interface RatingSystemProps {
  functionId: string
  initialRating?: number
  onRatingUpdate?: (newRating: RatingStats) => void
}

export function RatingSystem({ functionId, initialRating, onRatingUpdate }: RatingSystemProps) {
  const { user } = useAuthStore()
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingStats, setRatingStats] = useState<RatingStats>({
    average: initialRating || 0,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })
  const [userRating, setUserRating] = useState<number>(0)
  const [userComment, setUserComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadReviews = useCallback(async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockReviews: Review[] = [
        {
          id: '1',
          user_id: 'user1',
          function_id: functionId,
          rating: 5,
          comment: 'Excellent function! Very well documented and easy to use.',
          helpful_count: 12,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
          user: {
            id: 'user1',
            username: 'developer123',
            avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
            reputation: 150
          }
        },
        {
          id: '2',
          user_id: 'user2',
          function_id: functionId,
          rating: 4,
          comment: 'Good utility function, saved me a lot of time. Could use better TypeScript types.',
          helpful_count: 8,
          created_at: '2024-01-14T15:30:00Z',
          updated_at: '2024-01-14T15:30:00Z',
          user: {
            id: 'user2',
            username: 'codemaster',
            reputation: 89
          }
        }
      ]

      setReviews(mockReviews)

      // Calculate rating stats
      const total = mockReviews.length
      const sum = mockReviews.reduce((acc, review) => acc + review.rating, 0)
      const average = total > 0 ? sum / total : 0

      const distribution = mockReviews.reduce((acc, review) => {
        acc[review.rating as keyof typeof acc]++
        return acc
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })

      const stats = { average, total, distribution }
      setRatingStats(stats)
      
      if (onRatingUpdate) {
        onRatingUpdate(stats)
      }

    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [functionId, onRatingUpdate])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const handleSubmitReview = async () => {
    if (!user || !userRating) return

    setIsSubmitting(true)
    try {
      // Mock API call - replace with actual submission
      const newReview: Review = {
        id: Date.now().toString(),
        user_id: user.id,
        function_id: functionId,
        rating: userRating,
        comment: userComment,
        helpful_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: user.id,
          username: user.email?.split('@')[0] || 'user',
          avatar_url: user.user_metadata?.avatar_url,
          reputation: 0
        }
      }

      setReviews(prev => [newReview, ...prev])
      setUserRating(0)
      setUserComment('')

      // Recalculate stats
      loadReviews()

    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHelpfulVote = async (reviewId: string, isHelpful: boolean) => {
    if (!user) return

    try {
      // Mock API call - replace with actual vote submission
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful_count: review.helpful_count + (isHelpful ? 1 : -1) }
          : review
      ))
    } catch (error) {
      console.error('Failed to vote:', error)
    }
  }

  const StarRating = ({ 
    rating, 
    onRatingChange, 
    readonly = false, 
    size = 'default' 
  }: { 
    rating: number
    onRatingChange?: (rating: number) => void
    readonly?: boolean
    size?: 'small' | 'default' | 'large'
  }) => {
    const sizeClasses = {
      small: 'h-4 w-4',
      default: 'h-5 w-5',
      large: 'h-6 w-6'
    }

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onRatingChange?.(star)}
            className={cn(
              sizeClasses[size],
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform',
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            )}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Ratings & Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">
                {ratingStats.average.toFixed(1)}
              </div>
              <StarRating rating={Math.round(ratingStats.average)} readonly />
              <p className="text-sm text-muted-foreground mt-2">
                Based on {ratingStats.total} review{ratingStats.total !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm w-3">{stars}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{
                        width: `${ratingStats.total > 0 
                          ? (ratingStats.distribution[stars as keyof typeof ratingStats.distribution] / ratingStats.total) * 100 
                          : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {ratingStats.distribution[stars as keyof typeof ratingStats.distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Review Form */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Rating</label>
              <StarRating 
                rating={userRating} 
                onRatingChange={setUserRating}
                size="large"
              />
            </div>

            {userRating > 0 && (
              <FadeIn>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Comment (Optional)
                    </label>
                    <Textarea
                      placeholder="Share your experience with this function..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSubmitReview}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setUserRating(0)
                        setUserComment('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </FadeIn>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reviews ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatedList className="space-y-6">
              {reviews.map((review, index) => (
                <AnimatedListItem key={review.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.user.avatar_url} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.user.username}</span>
                            <Badge variant="secondary" className="text-xs">
                              {review.user.reputation} rep
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} readonly size="small" />
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {review.comment && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 ml-13">
                        {review.comment}
                      </p>
                    )}

                    <div className="flex items-center gap-4 ml-13">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpfulVote(review.id, true)}
                        className="flex items-center gap-1 text-muted-foreground hover:text-green-600"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Helpful ({review.helpful_count})
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-muted-foreground hover:text-blue-600"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Reply
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-muted-foreground hover:text-red-600"
                      >
                        <Flag className="h-4 w-4" />
                        Report
                      </Button>
                    </div>

                    {index < reviews.length - 1 && <Separator className="mt-6" />}
                  </div>
                </AnimatedListItem>
              ))}
            </AnimatedList>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">
              Be the first to review this function!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
