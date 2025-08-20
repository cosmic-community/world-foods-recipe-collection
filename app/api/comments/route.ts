import { NextRequest, NextResponse } from 'next/server'
import { createRecipeComment } from '@/lib/cosmic'
import type { CommentFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipeId, author_name, author_email, comment_text, rating }: CommentFormData & { recipeId: string } = body

    console.log('Received comment data:', { recipeId, author_name, author_email, comment_text, rating })

    // Basic validation
    if (!recipeId || !author_name || !author_email || !comment_text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(author_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Rating validation (if provided)
    if (rating !== undefined && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      )
    }

    // Create comment in Cosmic
    const comment = await createRecipeComment(recipeId, {
      author_name,
      author_email,
      comment_text,
      rating
    })

    if (!comment) {
      console.error('Failed to create comment in Cosmic')
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    console.log('Comment created successfully:', comment.id)

    return NextResponse.json({
      success: true,
      message: 'Comment submitted successfully and is pending approval',
      comment: {
        id: comment.id,
        title: comment.title,
        created_at: comment.created_at
      }
    })
  } catch (error) {
    console.error('Error in comment API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}