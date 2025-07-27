'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { dbHelpers, FunctionRating, FunctionComment } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { 
  Star, 
  MessageCircle, 
  ThumbsUp, 
  Send,
  User
} from 'lucide-react'

interface CommunityFeaturesProps {
  functionId: string
  functionTitle: string
}

export function CommunityFeatures({ functionId }: Pick<CommunityFeaturesProps, 'functionId'>) {
  const { t } = useTranslation()
  const { user, profile } = useAuthStore()
  const [ratings, setRatings] = useState<FunctionRating[]>([])
  const [comments, setComments] = useState<FunctionComment[]>([])
  const [userRating, setUserRating] = useState<number>(0)
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [averageRating, setAverageRating] = useState(0)

  const loadRatingsAndComments = useCallback(async () => {
    try {
      const [ratingsData, commentsData] = await Promise.all([
        dbHelpers.getFunctionRatings(functionId),
        dbHelpers.getFunctionComments(functionId)
      ])
      
      setRatings(ratingsData || [])
      setComments(commentsData || [])
      
      // Calculate average rating
      if (ratingsData && ratingsData.length > 0) {
        const avg = ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length
        setAverageRating(Math.round(avg * 10) / 10)
      }
      
      // Set user's current rating if exists
      if (user && ratingsData) {
        const userRatingData = ratingsData.find(r => r.user_id === user.id)
        if (userRatingData) {
          setUserRating(userRatingData.rating)
        }
      }
    } catch (error) {
      console.error('Error loading ratings and comments:', error)
    }
  }, [functionId, user])

  useEffect(() => {
    loadRatingsAndComments()
  }, [loadRatingsAndComments])

  const handleRating = async (rating: number) => {
    if (!user) return
    
    setLoading(true)
    try {
      await dbHelpers.rateFunction(functionId, user.id, rating)
      setUserRating(rating)
      await loadRatingsAndComments() // Reload to get updated average
    } catch (error) {
      console.error('Error rating function:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComment = async () => {
    if (!user || !newComment.trim()) return
    
    setLoading(true)
    try {
      await dbHelpers.addComment(functionId, user.id, newComment.trim())
      setNewComment('')
      await loadRatingsAndComments() // Reload comments
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number, interactive = false, size = 'w-4 h-4') => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && handleRating(star)}
            disabled={!interactive || loading}
            className={`${size} ${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            }`}
          >
            <Star
              className={`w-full h-full ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Đánh giá & Phản hồi</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Average Rating Display */}
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex flex-col">
              {renderStars(averageRating)}
              <div className="text-sm text-muted-foreground">
                {ratings.length} đánh giá
              </div>
            </div>
          </div>

          {/* User Rating */}
          {user ? (
            <div className="border-t pt-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">Đánh giá của bạn:</span>
                {renderStars(userRating, true, 'w-5 h-5')}
              </div>
            </div>
          ) : (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Đăng nhập để đánh giá function này
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <span>Bình luận ({comments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Comment */}
          {user ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.username} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Viết bình luận của bạn..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      onClick={handleComment}
                      disabled={!newComment.trim() || loading}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Gửi bình luận
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                Đăng nhập để tham gia thảo luận
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3 border-t pt-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.user.avatar_url} alt={comment.user.username} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{comment.user.username}</span>
                      <Badge variant="secondary" className="text-xs">
                        {comment.user.role === 'admin' ? 'Admin' : 
                         comment.user.role === 'contributor' ? 'Contributor' : 'Member'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button variant="ghost" size="sm" className="h-auto p-1">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        <span className="text-xs">Hữu ích</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
