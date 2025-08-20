import { NextRequest, NextResponse } from 'next/server'
import { createRecipeRating } from '@/lib/cosmic'
import type { RatingFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipeId, rating_value, user_email, user_name }: RatingFormData & { recipeId: string } = body

    // Basic validation
    if (!recipeId || !rating_value || !user_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Rating validation
    if (rating_value < 1 || rating_value > 5 || !Number.isInteger(rating_value)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(user_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Create or update rating in Cosmic
    const rating = await createRecipeRating(recipeId, {
      rating_value,
      user_email,
      user_name
    })

    if (!rating) {
      return NextResponse.json(
        { error: 'Failed to create rating' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Rating submitted successfully',
      rating
    })
  } catch (error) {
    console.error('Error in rating API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}