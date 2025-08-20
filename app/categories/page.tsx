import { getCategories } from '@/lib/cosmic'
import CategoryCard from '@/components/CategoryCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recipe Categories - World Foods Recipe Collection',
  description: 'Explore our collection of recipe categories including Italian cuisine, Asian dishes, desserts, and more.',
  openGraph: {
    title: 'Recipe Categories - World Foods Recipe Collection',
    description: 'Explore our collection of recipe categories including Italian cuisine, Asian dishes, desserts, and more.',
  },
}

export default async function CategoriesPage() {
  const categories = await getCategories(50)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white section-spacing">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Recipe Categories
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white opacity-90">
            Discover recipes organized by cuisine type, cooking style, and dish category
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌍</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No Categories Found
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Categories will appear here once they've been added to your Cosmic CMS.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}