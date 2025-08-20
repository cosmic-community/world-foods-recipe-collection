import { getRecipes } from '@/lib/cosmic'
import RecipeCard from '@/components/RecipeCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'All Recipes - World Foods Recipe Collection',
  description: 'Browse our complete collection of recipes from around the world. Find the perfect dish for any occasion.',
}

export default async function RecipesPage() {
  const recipes = await getRecipes(12)

  return (
    <div className="min-h-screen bg-white section-spacing">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            All Recipes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of authentic recipes from around the world. 
            From quick weeknight dinners to elaborate weekend feasts.
          </p>
        </div>

        {/* Recipes Grid */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                showAuthor={true}
                className="animate-fade-in"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍳</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Recipes Found</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              We're working on adding delicious recipes to our collection. 
              Please check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}