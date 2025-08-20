import { getRecipes, getCategories, getAuthors, getHomePage } from '@/lib/cosmic'
import RecipeCard from '@/components/RecipeCard'
import CategoryCard from '@/components/CategoryCard'
import AuthorCard from '@/components/AuthorCard'
import Link from 'next/link'

export default async function HomePage() {
  const [recipes, categories, authors, homePage] = await Promise.all([
    getRecipes(6),
    getCategories(4),
    getAuthors(2),
    getHomePage()
  ])

  // Get hero background image from home page data or use default
  const heroBackgroundImage = homePage?.metadata?.hero_background_image?.imgix_url 
    ? `${homePage.metadata.hero_background_image.imgix_url}?w=2000&h=1200&fit=crop&auto=format,compress`
    : 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=2000&h=1200&fit=crop&auto=format,compress'

  const heroTitle = homePage?.metadata?.hero_title || 'Discover World Foods'
  const heroDescription = homePage?.metadata?.hero_description || 'Explore authentic recipes from around the globe, learn from talented chefs, and bring international flavors to your kitchen.'

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-br from-primary-50 to-orange-50 section-spacing overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto container-padding text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in drop-shadow-lg">
            {heroTitle}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 animate-slide-up drop-shadow-md">
            {heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/recipes" className="btn-primary">
              Browse Recipes
            </Link>
            <Link href="/categories" className="btn-secondary">
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="section-spacing bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Recipes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and delicious recipes from around the world
            </p>
          </div>

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No recipes available at the moment.</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/recipes" className="btn-primary">
              View All Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-spacing bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Cuisines
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dive into different culinary traditions and cooking styles
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id} 
                  category={category}
                  className="animate-slide-up"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No categories available at the moment.</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/categories" className="btn-secondary">
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Chefs */}
      {authors.length > 0 && (
        <section className="section-spacing bg-white">
          <div className="max-w-7xl mx-auto container-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Chefs
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Learn from talented chefs who share their culinary expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {authors.map((author) => (
                <AuthorCard 
                  key={author.id} 
                  author={author}
                  className="animate-fade-in"
                />
              ))}
            </div>

            <div className="text-center">
              <Link href="/authors" className="btn-primary">
                View All Chefs
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}