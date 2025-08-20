import { getAuthors } from '@/lib/cosmic'
import AuthorCard from '@/components/AuthorCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Chefs - World Foods Recipe Collection',
  description: 'Meet the talented chefs behind our delicious recipes from around the world.',
  openGraph: {
    title: 'Our Chefs - World Foods Recipe Collection',
    description: 'Meet the talented chefs behind our delicious recipes from around the world.',
  },
}

export default async function AuthorsPage() {
  const authors = await getAuthors(50)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white section-spacing">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Meet Our Chefs
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white opacity-90">
            Discover the talented culinary experts sharing their passion for food from around the world
          </p>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          {authors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authors.map((author) => (
                <AuthorCard key={author.id} author={author} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👨‍🍳</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No Chefs Found
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Our chef profiles will appear here once they've been added to your Cosmic CMS.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}