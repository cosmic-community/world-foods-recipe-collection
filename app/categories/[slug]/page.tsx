// app/categories/[slug]/page.tsx
import { getCategory, getCategories, getRecipesByCategory } from '@/lib/cosmic'
import RecipeCard from '@/components/RecipeCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const categories = await getCategories(50)
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.title} Recipes - World Foods Recipe Collection`,
    description: category.metadata?.description || `Discover delicious ${category.title.toLowerCase()} recipes from around the world.`,
    openGraph: {
      title: `${category.title} Recipes`,
      description: category.metadata?.description || `Discover delicious ${category.title.toLowerCase()} recipes from around the world.`,
      images: category.metadata?.image ? [
        {
          url: `${category.metadata.image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
        }
      ] : [],
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [category, recipes] = await Promise.all([
    getCategory(slug),
    getRecipesByCategory(slug, 50)
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-700">
        {category.metadata?.image && (
          <div className="absolute inset-0">
            <img
              src={`${category.metadata.image.imgix_url}?w=1600&h=600&fit=crop&auto=format,compress`}
              alt={category.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-primary-600 bg-opacity-60"></div>
          </div>
        )}
        
        <div className="relative section-spacing">
          <div className="max-w-7xl mx-auto container-padding text-center text-white">
            <nav className="mb-8">
              <Link 
                href="/categories"
                className="text-white hover:text-primary-200 transition-colors"
              >
                ← Back to Categories
              </Link>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {category.title}
            </h1>
            {category.metadata?.description && (
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white opacity-90">
                {category.metadata.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Recipes */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {category.title} Recipes ({recipes.length})
            </h2>
          </div>

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No Recipes Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                There are no recipes in this category yet. Check back later for delicious new additions!
              </p>
              <Link
                href="/recipes"
                className="btn-primary"
              >
                Browse All Recipes
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}