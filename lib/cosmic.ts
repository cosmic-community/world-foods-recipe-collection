import { createBucketClient } from '@cosmicjs/sdk'
import type { Recipe, Author, Category, CosmicResponse } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
  apiEnvironment: 'staging'
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all recipes with depth for related objects
export async function getRecipes(limit = 10, skip = 0): Promise<Recipe[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'recipes' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit)
      .skip(skip);
    
    return response.objects as Recipe[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch recipes');
  }
}

// Fetch single recipe by slug
export async function getRecipe(slug: string): Promise<Recipe | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'recipes',
      slug
    }).depth(2);
    
    const recipe = response.object as Recipe;
    
    if (!recipe || !recipe.metadata) {
      return null;
    }
    
    return recipe;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Fetch all authors
export async function getAuthors(limit = 10): Promise<Author[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'authors' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit);
    
    return response.objects as Author[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch authors');
  }
}

// Fetch single author by slug
export async function getAuthor(slug: string): Promise<Author | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'authors',
      slug
    }).depth(1);
    
    const author = response.object as Author;
    
    if (!author || !author.metadata) {
      return null;
    }
    
    return author;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Fetch all categories
export async function getCategories(limit = 10): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit);
    
    return response.objects as Category[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch categories');
  }
}

// Fetch single category by slug
export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'categories',
      slug
    }).depth(1);
    
    const category = response.object as Category;
    
    if (!category || !category.metadata) {
      return null;
    }
    
    return category;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Fetch recipes by category
export async function getRecipesByCategory(categoryId: string, limit = 10): Promise<Recipe[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'recipes',
        'metadata.categories': categoryId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit);
    
    return response.objects as Recipe[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch recipes by category');
  }
}

// Fetch recipes by author
export async function getRecipesByAuthor(authorId: string, limit = 10): Promise<Recipe[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'recipes',
        'metadata.author': authorId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
      .limit(limit);
    
    return response.objects as Recipe[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch recipes by author');
  }
}