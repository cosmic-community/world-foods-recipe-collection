import { NextRequest, NextResponse } from 'next/server'
import { createRecipeComment } from '@/lib/cosmic'
import type { CommentFormData } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recipeId, author_name, author_email, comment_text, rating }: CommentFormData & { recipeId: string } = body

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

    // Create comment in Cosmic
    const comment = await createRecipeComment(recipeId, {
      author_name,
      author_email,
      comment_text,
      rating
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Comment submitted successfully',
      comment
    })
  } catch (error) {
    console.error('Error in comment API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}