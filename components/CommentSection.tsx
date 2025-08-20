'use client'

import { useState, useEffect } from 'react'
import CommentForm from './CommentForm'
import RatingSystem from './RatingSystem'
import type { CommentSectionProps, RecipeComment, RatingStats } from '@/types'

export default function CommentSection({ recipeId, recipeSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<RecipeComment[]>([])
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false)

  useEffect(() => {
    fetchComments()
    fetchRatingStats()
  }, [recipeId])

  const fetchComments = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/comments/${recipeId}`)
      if (response.ok) {
        const commentData: RecipeComment[] = await response.json()
        setComments(commentData)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRatingStats = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/ratings/${recipeId}`)
      if (response.ok) {
        const stats: RatingStats = await response.json()
        setRatingStats(stats)
      }
    } catch (error) {
      console.error('Error fetching rating stats:', error)
    }
  }

  const handleCommentSubmitted = (): void => {
    setShowCommentForm(false)
    // Note: New comments won't appear immediately since they need approval
  }

  const handleRatingChange = (): void => {
    fetchRatingStats()
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="mt-16 pt-12 border-t border-gray-200">
      {/* Rating Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ratings & Reviews</h2>
        <RatingSystem
          recipeId={recipeId}
          currentRating={ratingStats?.averageRating || 0}
          totalRatings={ratingStats?.totalRatings || 0}
          onRatingChange={handleRatingChange}
        />
        
        {ratingStats && ratingStats.totalRatings > 0 && (
          <div className="mt-4 grid grid-cols-5 gap-2 max-w-md">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center text-sm">
                <span className="w-3">{rating}</span>
                <svg className="w-3 h-3 mx-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-1">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${ratingStats.totalRatings > 0 
                        ? (ratingStats.ratingDistribution[rating as keyof typeof ratingStats.ratingDistribution] / ratingStats.totalRatings) * 100 
                        : 0}%`
                    }}
                  />
                </div>
                <span className="w-6 text-xs text-gray-500">
                  {ratingStats.ratingDistribution[rating as keyof typeof ratingStats.ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Comments ({comments.length})
          </h3>
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            {showCommentForm ? 'Cancel' : 'Add Comment'}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">
                        {comment.metadata?.author_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {comment.metadata?.author_name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  {comment.metadata?.rating && (
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (comment.metadata?.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                          fill={star <= (comment.metadata?.rating || 0) ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      ))}
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {comment.metadata?.comment_text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <CommentForm
          recipeId={recipeId}
          onCommentSubmitted={handleCommentSubmitted}
        />
      )}
    </div>
  )
}