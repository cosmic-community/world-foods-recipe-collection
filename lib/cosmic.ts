import { createBucketClient } from "@cosmicjs/sdk"
import type { Recipe, Author, Category, HomePage, RecipeComment, RecipeRating, RatingStats, CommentFormData, RatingFormData } from "@/types"

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
  readKey: process.env.COSMIC_READ_KEY!,
  writeKey: process.env.COSMIC_WRITE_KEY,
  apiEnvironment: "staging"
})

// Home page function
export async function getHomePage(): Promise<HomePage | null> {
  try {
    const { object } = await cosmic.objects
      .findOne({ type: 'home', slug: 'home-page' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return object as HomePage
  } catch (error) {
    console.error('Error fetching home page:', error)
    return null
  }
}

// Recipe functions
export async function getRecipes(limit = 20): Promise<Recipe[]> {
  try {
    const { objects } = await cosmic.objects
      .find({ type: 'recipes' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit)
    
    return objects as Recipe[]
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
}

export async function getRecipe(slug: string): Promise<Recipe | null> {
  try {
    const { object } = await cosmic.objects
      .findOne({ type: 'recipes', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return object as Recipe
  } catch (error) {
    console.error(`Error fetching recipe ${slug}:`, error)
    return null
  }
}

export async function getRecipesByCategory(categorySlug: string, limit = 20): Promise<Recipe[]> {
  try {
    // First get the category to find its ID
    const category = await getCategory(categorySlug)
    if (!category) return []

    const { objects } = await cosmic.objects
      .find({ 
        type: 'recipes',
        'metadata.categories': category.id
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit)
    
    return objects as Recipe[]
  } catch (error) {
    console.error(`Error fetching recipes for category ${categorySlug}:`, error)
    return []
  }
}

export async function getRecipesByAuthor(authorSlug: string, limit = 20): Promise<Recipe[]> {
  try {
    // First get the author to find its ID
    const author = await getAuthor(authorSlug)
    if (!author) return []

    const { objects } = await cosmic.objects
      .find({ 
        type: 'recipes',
        'metadata.author': author.id
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit)
    
    return objects as Recipe[]
  } catch (error) {
    console.error(`Error fetching recipes for author ${authorSlug}:`, error)
    return []
  }
}

// Category functions
export async function getCategories(limit = 20): Promise<Category[]> {
  try {
    const { objects } = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit)
    
    return objects as Category[]
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const { object } = await cosmic.objects
      .findOne({ type: 'categories', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return object as Category
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error)
    return null
  }
}

// Author functions
export async function getAuthors(limit = 20): Promise<Author[]> {
  try {
    const { objects } = await cosmic.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit)
    
    return objects as Author[]
  } catch (error) {
    console.error('Error fetching authors:', error)
    return []
  }
}

export async function getAuthor(slug: string): Promise<Author | null> {
  try {
    const { object } = await cosmic.objects
      .findOne({ type: 'authors', slug })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return object as Author
  } catch (error) {
    console.error(`Error fetching author ${slug}:`, error)
    return null
  }
}

// Comment functions
export async function getRecipeComments(recipeId: string, limit = 50): Promise<RecipeComment[]> {
  try {
    const { objects } = await cosmic.objects
      .find({ 
        type: 'recipe-comments',
        'metadata.recipe': recipeId,
        'metadata.status': 'approved'
      })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)
      .limit(limit)
      .sort('created_at')
    
    return objects as RecipeComment[]
  } catch (error) {
    console.error(`Error fetching comments for recipe ${recipeId}:`, error)
    return []
  }
}

export async function createRecipeComment(recipeId: string, commentData: CommentFormData): Promise<RecipeComment | null> {
  try {
    if (!process.env.COSMIC_WRITE_KEY) {
      throw new Error('Write key not configured')
    }

    const { object } = await cosmic.objects.insertOne({
      title: `Comment by ${commentData.author_name}`,
      type: 'recipe-comments',
      status: 'published',
      metadata: {
        recipe: recipeId,
        author_name: commentData.author_name,
        author_email: commentData.author_email,
        comment_text: commentData.comment_text,
        rating: commentData.rating,
        status: 'pending' // Comments start as pending for moderation
      }
    })

    return object as RecipeComment
  } catch (error) {
    console.error('Error creating comment:', error)
    return null
  }
}

// Rating functions
export async function getRecipeRatings(recipeId: string): Promise<RecipeRating[]> {
  try {
    const { objects } = await cosmic.objects
      .find({ 
        type: 'recipe-ratings',
        'metadata.recipe': recipeId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(1000) // Get all ratings for calculation
    
    return objects as RecipeRating[]
  } catch (error) {
    console.error(`Error fetching ratings for recipe ${recipeId}:`, error)
    return []
  }
}

export async function createRecipeRating(recipeId: string, ratingData: RatingFormData): Promise<RecipeRating | null> {
  try {
    if (!process.env.COSMIC_WRITE_KEY) {
      throw new Error('Write key not configured')
    }

    // Check if user has already rated this recipe
    const existingRating = await getUserRecipeRating(recipeId, ratingData.user_email)
    
    if (existingRating) {
      // Update existing rating
      const { object } = await cosmic.objects.updateOne(existingRating.id, {
        metadata: {
          rating_value: ratingData.rating_value
        }
      })
      return object as RecipeRating
    } else {
      // Create new rating
      const { object } = await cosmic.objects.insertOne({
        title: `Rating by ${ratingData.user_name || ratingData.user_email}`,
        type: 'recipe-ratings',
        status: 'published',
        metadata: {
          recipe: recipeId,
          rating_value: ratingData.rating_value,
          user_email: ratingData.user_email,
          user_name: ratingData.user_name
        }
      })
      return object as RecipeRating
    }
  } catch (error) {
    console.error('Error creating/updating rating:', error)
    return null
  }
}

export async function getUserRecipeRating(recipeId: string, userEmail: string): Promise<RecipeRating | null> {
  try {
    const { objects } = await cosmic.objects
      .find({ 
        type: 'recipe-ratings',
        'metadata.recipe': recipeId,
        'metadata.user_email': userEmail
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(1)
    
    return objects.length > 0 ? objects[0] as RecipeRating : null
  } catch (error) {
    console.error(`Error fetching user rating for recipe ${recipeId}:`, error)
    return null
  }
}

export async function calculateRatingStats(recipeId: string): Promise<RatingStats> {
  const ratings = await getRecipeRatings(recipeId)
  
  if (ratings.length === 0) {
    return {
      averageRating: 0,
      totalRatings: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }
    }
  }

  const ratingValues = ratings.map(r => r.metadata?.rating_value || 0)
  const total = ratingValues.reduce((sum, rating) => sum + rating, 0)
  const averageRating = total / ratingValues.length

  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  }

  ratingValues.forEach(rating => {
    if (rating >= 1 && rating <= 5) {
      distribution[rating as keyof typeof distribution]++
    }
  })

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    totalRatings: ratings.length,
    ratingDistribution: distribution
  }
}

export default cosmic