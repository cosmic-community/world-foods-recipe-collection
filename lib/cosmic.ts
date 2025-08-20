import { createBucketClient } from '@cosmicjs/sdk'
import type { Recipe, Author, Category, HomePage, RecipeComment, RecipeRating, CosmicResponse, RatingStats, CommentFormData } from '@/types'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Get home page data
export async function getHomePage(): Promise<HomePage | null> {
  try {
    const { object } = await cosmic.objects
      .findOne({
        type: 'home',
        slug: 'home'
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return object as HomePage
  } catch (error) {
    console.error('Error fetching home page:', error)
    return null
  }
}

// Get all recipes with optional filtering
export async function getRecipes(limit: number = 20): Promise<Recipe[]> {
  try {
    const { objects } = await cosmic.objects
      .find({
        type: 'recipes'
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .limit(limit)

    return objects as Recipe[]
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}

// Get a single recipe by slug
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const { object } = await cosmic.objects
      .findOne({
        type: 'recipes',
        slug: slug
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    return object as Recipe
  } catch (error) {
    console.error('Error fetching recipe by slug:', error)
    return null
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const { objects } = await cosmic.objects
      .find({
        type: 'categories'
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return objects as Category[]
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Get a single category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { object } = await cosmic.objects
      .findOne({
        type: 'categories',
        slug: slug
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return object as Category
  } catch (error) {
    console.error('Error fetching category by slug:', error)
    return null
  }
}

// Get recipes by category
export async function getRecipesByCategory(categoryId: string): Promise<Recipe[]> {
  try {
    const { objects } = await cosmic.objects
      .find({
        type: 'recipes',
        'metadata.categories': categoryId
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    return objects as Recipe[]
  } catch (error) {
    console.error('Error fetching recipes by category:', error)
    return []
  }
}

// Get all authors
export async function getAuthors(): Promise<Author[]> {
  try {
    const { objects } = await cosmic.objects
      .find({
        type: 'authors'
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return objects as Author[]
  } catch (error) {
    console.error('Error fetching authors:', error)
    return []
  }
}

// Get a single author by slug
export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  try {
    const { object } = await cosmic.objects
      .findOne({
        type: 'authors',
        slug: slug
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)

    return object as Author
  } catch (error) {
    console.error('Error fetching author by slug:', error)
    return null
  }
}

// Get recipes by author
export async function getRecipesByAuthor(authorId: string): Promise<Recipe[]> {
  try {
    const { objects } = await cosmic.objects
      .find({
        type: 'recipes',
        'metadata.author': authorId
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    return objects as Recipe[]
  } catch (error) {
    console.error('Error fetching recipes by author:', error)
    return []
  }
}

// Get comments for a recipe
export async function getRecipeComments(recipeId: string): Promise<RecipeComment[]> {
  try {
    const { objects } = await cosmic.objects
      .find({
        type: 'recipe-comments',
        'metadata.recipe': recipeId,
        'metadata.status': 'approved'
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .sort('-created_at')

    return objects as RecipeComment[]
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    console.error('Error fetching recipe comments:', error)
    return []
  }
}

// Create a new recipe comment
export async function createRecipeComment(recipeId: string, commentData: CommentFormData): Promise<RecipeComment | null> {
  try {
    // Generate a title for the comment
    const title = `${commentData.author_name}'s comment`
    
    // Create the comment object
    const { object } = await cosmic.objects.insertOne({
      title,
      type: 'recipe-comments',
      status: 'published',
      metadata: {
        recipe: recipeId,
        author_name: commentData.author_name,
        author_email: commentData.author_email,
        comment_text: commentData.comment_text,
        rating: commentData.rating || null,
        status: 'pending' // Always set to pending for moderation
      }
    })

    return object as RecipeComment
  } catch (error) {
    console.error('Error creating recipe comment:', error)
    return null
  }
}

// Get ratings for a recipe
export async function getRecipeRatings(recipeId: string): Promise<RecipeRating[]> {
  try {
    const { objects } = await cosmic.objects
      .find({
        type: 'recipe-ratings',
        'metadata.recipe': recipeId
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    return objects as RecipeRating[]
  } catch (error) {
    if (error.status === 404) {
      return []
    }
    console.error('Error fetching recipe ratings:', error)
    return []
  }
}

// Create a new recipe rating
export async function createRecipeRating(recipeId: string, ratingData: { rating_value: number; user_email: string; user_name?: string }): Promise<RecipeRating | null> {
  try {
    // Check if user has already rated this recipe
    const existingRatings = await cosmic.objects
      .find({
        type: 'recipe-ratings',
        'metadata.recipe': recipeId,
        'metadata.user_email': ratingData.user_email
      })
      .props(['id'])

    // If user has already rated, update the existing rating
    if (existingRatings.objects && existingRatings.objects.length > 0) {
      const existingRating = existingRatings.objects[0]
      const { object } = await cosmic.objects.updateOne(existingRating.id, {
        metadata: {
          rating_value: ratingData.rating_value,
          user_name: ratingData.user_name
        }
      })
      return object as RecipeRating
    }

    // Create new rating
    const title = `${ratingData.user_name || ratingData.user_email}'s rating`
    
    const { object } = await cosmic.objects.insertOne({
      title,
      type: 'recipe-ratings',
      status: 'published',
      metadata: {
        recipe: recipeId,
        rating_value: ratingData.rating_value,
        user_email: ratingData.user_email,
        user_name: ratingData.user_name || ''
      }
    })

    return object as RecipeRating
  } catch (error) {
    console.error('Error creating recipe rating:', error)
    return null
  }
}

// Get rating statistics for a recipe
export async function getRecipeRatingStats(recipeId: string): Promise<RatingStats> {
  try {
    const ratings = await getRecipeRatings(recipeId)
    
    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    }

    const ratingValues = ratings.map(rating => rating.metadata.rating_value || 0)
    const totalRatings = ratingValues.length
    const averageRating = ratingValues.reduce((sum, rating) => sum + rating, 0) / totalRatings

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratingValues.forEach(rating => {
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating as keyof typeof ratingDistribution]++
      }
    })

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings,
      ratingDistribution
    }
  } catch (error) {
    console.error('Error calculating rating stats:', error)
    return {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }
  }
}