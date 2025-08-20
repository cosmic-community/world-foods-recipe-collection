// app/recipes/[slug]/page.tsx
import { getRecipe, getRecipes } from '@/lib/cosmic'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import CommentSection from '@/components/CommentSection'
import RatingSystem from '@/components/RatingSystem'

interface RecipePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const recipes = await getRecipes(50)
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }))
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params
  const recipe = await getRecipe(slug)
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    }
  }

  return {
    title: `${recipe.title} - World Foods Recipe Collection`,
    description: recipe.metadata?.description || `Learn how to make ${recipe.title} with this detailed recipe.`,
    openGraph: {
      title: recipe.title,
      description: recipe.metadata?.description || `Learn how to make ${recipe.title} with this detailed recipe.`,
      images: recipe.metadata?.featured_image ? [
        {
          url: `${recipe.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
        }
      ] : [],
    },
  }
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  const recipe = await getRecipe(slug)

  if (!recipe) {
    notFound()
  }

  const featuredImage = recipe.metadata?.featured_image
  const author = recipe.metadata?.author
  const difficulty = recipe.metadata?.difficulty
  const prepTime = recipe.metadata?.prep_time
  const cookTime = recipe.metadata?.cook_time
  const servings = recipe.metadata?.servings
  const categories = recipe.metadata?.categories
  const totalTime = (prepTime && cookTime) ? prepTime + cookTime : null

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        {featuredImage && (
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <img
              src={`${featuredImage.imgix_url}?w=1600&h=800&fit=crop&auto=format,compress`}
              alt={recipe.title}
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
              {recipe.title}
            </h1>
            {recipe.metadata?.description && (
              <p className="text-lg md:text-xl max-w-3xl text-white drop-shadow-md mb-4">
                {recipe.metadata.description}
              </p>
            )}
            {/* Rating display in hero */}
            <div className="mt-4">
              <RatingSystem
                recipeId={recipe.id}
                readonly={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Details */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          {/* Recipe Meta */}
          <div className="bg-gray-50 rounded-xl p-6 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {prepTime && (
                <div>
                  <div className="text-2xl font-bold text-primary-600">{prepTime}</div>
                  <div className="text-sm text-gray-600">Prep Time (min)</div>
                </div>
              )}
              {cookTime && (
                <div>
                  <div className="text-2xl font-bold text-primary-600">{cookTime}</div>
                  <div className="text-sm text-gray-600">Cook Time (min)</div>
                </div>
              )}
              {servings && (
                <div>
                  <div className="text-2xl font-bold text-primary-600">{servings}</div>
                  <div className="text-sm text-gray-600">Servings</div>
                </div>
              )}
              {difficulty && (
                <div>
                  <div className="text-2xl font-bold text-primary-600">{difficulty.value}</div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Ingredients */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
              {recipe.metadata?.ingredients ? (
                <div 
                  className="recipe-content prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: recipe.metadata.ingredients }}
                />
              ) : (
                <p className="text-gray-600">No ingredients listed.</p>
              )}
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
              {recipe.metadata?.instructions ? (
                <div 
                  className="recipe-content prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: recipe.metadata.instructions }}
                />
              ) : (
                <p className="text-gray-600">No instructions provided.</p>
              )}
            </div>
          </div>

          {/* Author Section */}
          {author && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Chef</h2>
              <div className="flex items-start space-x-6">
                {author.metadata?.photo && (
                  <img
                    src={`${author.metadata.photo.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
                    alt={author.title}
                    width={100}
                    height={100}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <Link 
                    href={`/authors/${author.slug}`}
                    className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {author.title}
                  </Link>
                  {author.metadata?.specialty && (
                    <p className="text-primary-600 font-medium mt-1 mb-3">
                      {author.metadata.specialty}
                    </p>
                  )}
                  {author.metadata?.bio && (
                    <p className="text-gray-600">
                      {author.metadata.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Comments and Ratings Section */}
          <CommentSection recipeId={recipe.id} recipeSlug={recipe.slug} />
        </div>
      </section>
    </div>
  )
}