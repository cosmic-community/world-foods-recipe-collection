// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
  status?: string;
  published_at?: string;
}

// Recipe object type with properly typed metadata
export interface Recipe extends CosmicObject {
  type: 'recipes';
  metadata: {
    name?: string;
    description?: string;
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    ingredients?: string; // HTML content
    instructions?: string; // HTML content
    prep_time?: number;
    cook_time?: number;
    servings?: number;
    difficulty?: {
      key: DifficultyLevel;
      value: string;
    };
    author?: Author;
    categories?: Category[];
  };
}

// Author object type
export interface Author extends CosmicObject {
  type: 'authors';
  metadata: {
    name?: string;
    photo?: {
      url: string;
      imgix_url: string;
    };
    bio?: string;
    specialty?: string;
    website?: string;
    social_links?: {
      instagram?: string;
      facebook?: string;
      linkedin?: string;
      youtube?: string;
      twitter?: string;
    };
  };
}

// Category object type
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    name?: string;
    description?: string;
    image?: {
      url: string;
      imgix_url: string;
    };
  };
}

// Type literals for select-dropdown values
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip?: number;
}

// Type guards for runtime validation
export function isRecipe(obj: CosmicObject): obj is Recipe {
  return obj.type === 'recipes';
}

export function isAuthor(obj: CosmicObject): obj is Author {
  return obj.type === 'authors';
}

export function isCategory(obj: CosmicObject): obj is Category {
  return obj.type === 'categories';
}

// Utility types for common patterns
export type OptionalMetadata<T> = Partial<T extends { metadata: infer M } ? M : never>;
export type CreateRecipeData = Omit<Recipe, 'id' | 'created_at' | 'modified_at'>;

// Component prop types
export interface RecipeCardProps {
  recipe: Recipe;
  showAuthor?: boolean;
  className?: string;
}

export interface AuthorCardProps {
  author: Author;
  className?: string;
}

export interface CategoryCardProps {
  category: Category;
  className?: string;
}