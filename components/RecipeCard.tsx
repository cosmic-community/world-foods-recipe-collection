import Link from 'next/link'
import type { RecipeCardProps } from '@/types'

export default function RecipeCard({ recipe, showAuthor = true, className = '' }: RecipeCardProps) {
  const featuredImage = recipe.metadata?.featured_image
  const author = recipe.metadata?.author
  const difficulty = recipe.metadata?.difficulty
  const prepTime = recipe.metadata?.prep_time
  const cookTime = recipe.metadata?.cook_time
  const totalTime = (prepTime && cookTime) ? prepTime + cookTime : null

  return (
    <article className={`card overflow-hidden group ${className}`}>
      <Link href={`/recipes/${recipe.slug}`}>
        {/* Recipe Image */}
        {featuredImage && (
          <div className="aspect-w-16 aspect-h-10 relative overflow-hidden">
            <img
              src={`${featuredImage.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
              alt={recipe.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Recipe Content */}
        <div className="p-6">
          {/* Difficulty Badge */}
          {difficulty && (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-3">
              {difficulty.value}
            </div>
          )}

          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {recipe.title}
          </h3>

          {recipe.metadata?.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">
              {recipe.metadata.description}
            </p>
          )}

          {/* Recipe Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            {totalTime && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{totalTime} min</span>
              </div>
            )}

            {recipe.metadata?.servings && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{recipe.metadata.servings} servings</span>
              </div>
            )}
          </div>

          {/* Author */}
          {showAuthor && author && (
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
              {author.metadata?.photo && (
                <img
                  src={`${author.metadata.photo.imgix_url}?w=80&h=80&fit=crop&auto=format,compress`}
                  alt={author.title}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {author.title}
                </p>
                {author.metadata?.specialty && (
                  <p className="text-xs text-gray-500">
                    {author.metadata.specialty}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}