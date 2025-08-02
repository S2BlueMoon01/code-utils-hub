'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Textarea } from './textarea'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Flag,
  MoreHorizontal,
  Reply,
  Heart
} from 'lucide-react'

interface Review {
  id: string
  userId: string
  username: string
  avatar?: string
  rating: number
  comment: string
  helpful: number
  notHelpful: number
  replies: ReviewReply[]
  createdAt: string
  isVerified: boolean
}

interface ReviewReply {
  id: string
  userId: string
  username: string
  avatar?: string
  comment: string
  createdAt: string
}

interface FunctionRatingProps {
  functionId: string
  currentRating: number
  totalRatings: number
  userRating?: number
  onRatingChange?: (rating: number) => void
  onReviewSubmit?: (rating: number, comment: string) => void
}

export function FunctionRating({
  functionId,
  currentRating,
  totalRatings,
  userRating,
  onRatingChange,
  onReviewSubmit
}: FunctionRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(userRating || 0)
  const [reviewComment, setReviewComment] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'johndoe',
      avatar: '/api/placeholder/32/32',
      rating: 5,
      comment: 'Excellent utility function! Very well documented and handles edge cases perfectly. I\'ve been using this in production for months without any issues.',
      helpful: 12,
      notHelpful: 1,
      replies: [
        {
          id: 'r1',
          userId: 'author',
          username: 'functionauthor',
          comment: 'Thank you for the feedback! Glad it\'s working well in production.',
          createdAt: '2024-01-20T10:30:00Z'
        }
      ],
      createdAt: '2024-01-18T14:22:00Z',
      isVerified: true
    },
    {
      id: '2',
      userId: 'user2',
      username: 'codereviewer',
      rating: 4,
      comment: 'Good function overall, but could benefit from better TypeScript types. The performance is great though!',
      helpful: 8,
      notHelpful: 0,
      replies: [],
      createdAt: '2024-01-17T09:15:00Z',
      isVerified: false
    },
    {
      id: '3',
      userId: 'user3',
      username: 'devexpert',
      rating: 5,
      comment: 'Perfect implementation! Clean code, well-tested, and solves exactly what I needed.',
      helpful: 15,
      notHelpful: 0,
      replies: [],
      createdAt: '2024-01-16T16:45:00Z',
      isVerified: true
    }
  ])

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating)
    onRatingChange?.(rating)
    if (!showReviewForm) {
      setShowReviewForm(true)
    }
  }

  const handleReviewSubmit = () => {
    if (selectedRating && reviewComment.trim()) {
      onReviewSubmit?.(selectedRating, reviewComment.trim())
      setReviewComment('')
      setShowReviewForm(false)
    }
  }

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      const isFilled = interactive 
        ? starValue <= (hoveredRating || selectedRating)
        : starValue <= rating

      return (
        <Star
          key={index}
          className={`${size} ${
            isFilled 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300 dark:text-gray-600'
          } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={interactive ? () => handleRatingClick(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        />
      )
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Rating & Reviews</span>
            <Badge variant="secondary">{totalRatings} reviews</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{currentRating.toFixed(1)}</div>
              <div className="flex items-center gap-1 mb-1">
                {renderStars(currentRating)}
              </div>
              <div className="text-sm text-muted-foreground">out of 5</div>
            </div>
            
            <div className="flex-1">
              {/* Rating Distribution */}
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = Math.floor(Math.random() * 20) + 1 // Mock data
                const percentage = (count / totalRatings) * 100
                
                return (
                  <div key={stars} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-3">{stars}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* User Rating */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Rate this function</h4>
            <div className="flex items-center gap-2">
              {renderStars(selectedRating, true, 'w-6 h-6')}
              <span className="text-sm text-muted-foreground ml-2">
                {selectedRating ? `${selectedRating} star${selectedRating !== 1 ? 's' : ''}` : 'Click to rate'}
              </span>
            </div>
            
            {/* Review Form */}
            {showReviewForm && (
              <div className="mt-4 space-y-3">
                <Textarea
                  placeholder="Write your review... (optional)"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button onClick={handleReviewSubmit} disabled={!selectedRating}>
                    Submit Review
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={review.avatar} />
                    <AvatarFallback>{review.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.username}</span>
                      {review.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(review.rating, false, 'w-4 h-4')}
                    </div>
                    
                    <p className="text-sm mb-3">{review.comment}</p>
                    
                    {/* Review Actions */}
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                        <ThumbsUp className="w-4 h-4" />
                        {review.helpful}
                      </button>
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                        <ThumbsDown className="w-4 h-4" />
                        {review.notHelpful}
                      </button>
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                        <Reply className="w-4 h-4" />
                        Reply
                      </button>
                      <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                        <Flag className="w-4 h-4" />
                        Report
                      </button>
                    </div>
                    
                    {/* Replies */}
                    {review.replies.length > 0 && (
                      <div className="mt-4 ml-4 space-y-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                        {review.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={reply.avatar} />
                              <AvatarFallback className="text-xs">
                                {reply.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{reply.username}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm">{reply.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
