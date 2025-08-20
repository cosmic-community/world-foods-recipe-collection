'use client'

import { useState, useEffect } from 'react'
import type { RatingSystemProps, RatingStats } from '@/types'

export default function RatingSystem({ 
  recipeId, 
  currentRating = 0, 
  totalRatings = 0,
  onRatingChange,
  readonly = false 
}: RatingSystemProps) {
  const [rating, setRating] = useState<number>(currentRating)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    fetchRatingStats()
  }, [recipeId])

  const fetchRatingStats = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/ratings/${recipeId}`)
      if (response.ok) {
        const stats: RatingStats = await response.json()
        setRatingStats(stats)
        setRating(stats.averageRating)
      }
    } catch (error) {
      console.error('Error fetching rating stats:', error)
    }
  }

  const handleRatingClick = async (newRating: number): Promise<void> => {
    if (readonly || !onRatingChange) return
    
    if (!userEmail) {
      const email = prompt('Please enter your email to rate this recipe:')
      if (!email) return
      setUserEmail(email)
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId,
          rating_value: newRating,
          user_email: userEmail,
        }),
      })

      if (response.ok) {
        await fetchRatingStats()
        onRatingChange(newRating)
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMouseEnter = (starRating: number): void => {
    if (!readonly) {
      setHoveredRating(starRating)
    }
  }

  const handleMouseLeave = (): void => {
    if (!readonly) {
      setHoveredRating(0)
    }
  }

  const displayRating = hoveredRating || rating
  const displayTotalRatings = ratingStats?.totalRatings || totalRatings

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly || isLoading}
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={`transition-colors duration-200 ${
              readonly 
                ? 'cursor-default' 
                : 'cursor-pointer hover:scale-110 transform transition-transform'
            } ${isLoading ? 'opacity-50' : ''}`}
          >
            <svg
              className={`w-5 h-5 ${
                star <= displayRating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
              fill={star <= displayRating ? 'currentColor' : 'none'}
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
          </button>
        ))}
      </div>
      
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span className="font-medium">
          {displayRating > 0 ? displayRating.toFixed(1) : 'No ratings yet'}
        </span>
        {displayTotalRatings > 0 && (
          <span>
            ({displayTotalRatings} rating{displayTotalRatings !== 1 ? 's' : ''})
          </span>
        )}
      </div>
      
      {isLoading && (
        <div className="text-sm text-gray-500">
          Saving...
        </div>
      )}
    </div>
  )
}