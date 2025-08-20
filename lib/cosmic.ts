import { createBucketClient } from "@cosmicjs/sdk"
import type { Recipe, Author, Category } from "@/types"

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG!,
  readKey: process.env.COSMIC_READ_KEY!,
  writeKey: process.env.COSMIC_WRITE_KEY,
  apiEnvironment: "staging"
})

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

export default cosmic