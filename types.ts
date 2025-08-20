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

// Home page object type
export interface HomePage extends CosmicObject {
  type: 'home';
  metadata: {
    hero_title?: string;
    hero_description?: string;
    hero_background_image?: {
      url: string;
      imgix_url: string;
    };
  };
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

// Recipe Comment object type
export interface RecipeComment extends CosmicObject {
  type: 'recipe-comments';
  metadata: {
    recipe?: Recipe;
    author_name?: string;
    author_email?: string;
    comment_text?: string;
    rating?: number;
    status?: {
      key: CommentStatus;
      value: string;
    };
  };
}

// Recipe Rating object type
export interface RecipeRating extends CosmicObject {
  type: 'recipe-ratings';
  metadata: {
    recipe?: Recipe;
    rating_value?: number;
    user_email?: string;
    user_name?: string;
  };
}

// Type literals for select-dropdown values
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type CommentStatus = 'pending' | 'approved' | 'rejected';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip?: number;
}

// Rating aggregation interface
export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
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

export function isHomePage(obj: CosmicObject): obj is HomePage {
  return obj.type === 'home';
}

export function isRecipeComment(obj: CosmicObject): obj is RecipeComment {
  return obj.type === 'recipe-comments';
}

export function isRecipeRating(obj: CosmicObject): obj is RecipeRating {
  return obj.type === 'recipe-ratings';
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

// Comment and rating component props
export interface CommentSectionProps {
  recipeId: string;
  recipeSlug: string;
}

export interface RatingSystemProps {
  recipeId: string;
  currentRating?: number;
  totalRatings?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}

export interface CommentFormProps {
  recipeId: string;
  onCommentSubmitted?: () => void;
}

// Form data interfaces
export interface CommentFormData {
  author_name: string;
  author_email: string;
  comment_text: string;
  rating?: number;
}

export interface RatingFormData {
  rating_value: number;
  user_email: string;
  user_name?: string;
}