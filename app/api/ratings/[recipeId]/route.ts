// app/api/ratings/[recipeId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { calculateRatingStats } from '@/lib/cosmic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    const { recipeId } = await params
    
    if (!recipeId) {
      return NextResponse.json(
        { error: 'Recipe ID is required' },
        { status: 400 }
      )
    }

    const ratingStats = await calculateRatingStats(recipeId)
    
    return NextResponse.json(ratingStats)
  } catch (error) {
    console.error('Error fetching rating stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rating statistics' },
      { status: 500 }
    )
  }
}