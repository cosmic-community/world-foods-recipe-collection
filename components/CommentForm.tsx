'use client'

import { useState } from 'react'
import type { CommentFormProps, CommentFormData } from '@/types'

export default function CommentForm({ recipeId, onCommentSubmitted }: CommentFormProps) {
  const [formData, setFormData] = useState<CommentFormData>({
    author_name: '',
    author_email: '',
    comment_text: '',
    rating: undefined
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitMessage, setSubmitMessage] = useState<string>('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRatingChange = (rating: number): void => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId,
          ...formData
        }),
      })

      if (response.ok) {
        setSubmitMessage('Thank you! Your comment has been submitted and is pending approval.')
        setFormData({
          author_name: '',
          author_email: '',
          comment_text: '',
          rating: undefined
        })
        if (onCommentSubmitted) {
          onCommentSubmitted()
        }
      } else {
        setSubmitMessage('There was an error submitting your comment. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
      setSubmitMessage('There was an error submitting your comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="author_name"
              name="author_name"
              required
              value={formData.author_name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
            />
          </div>
          
          <div>
            <label htmlFor="author_email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="author_email"
              name="author_email"
              required
              value={formData.author_email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating (Optional)
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                disabled={isSubmitting}
                className="transition-colors duration-200 hover:scale-110 transform transition-transform disabled:opacity-50"
              >
                <svg
                  className={`w-6 h-6 ${
                    formData.rating && star <= formData.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                  fill={formData.rating && star <= formData.rating ? 'currentColor' : 'none'}
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
            {formData.rating && (
              <button
                type="button"
                onClick={() => handleRatingChange(0)}
                disabled={isSubmitting}
                className="ml-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="comment_text" className="block text-sm font-medium text-gray-700 mb-1">
            Comment *
          </label>
          <textarea
            id="comment_text"
            name="comment_text"
            required
            rows={4}
            value={formData.comment_text}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
            placeholder="Share your thoughts about this recipe..."
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            * Required fields. Comments are moderated before being published.
          </p>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </div>

        {submitMessage && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            submitMessage.includes('Thank you') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  )
}