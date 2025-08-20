// app/authors/[slug]/page.tsx
import { getAuthor, getAuthors, getRecipesByAuthor } from '@/lib/cosmic'
import RecipeCard from '@/components/RecipeCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Recipe } from '@/types'

interface AuthorPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const authors = await getAuthors()
  return authors.map((author) => ({
    slug: author.slug,
  }))
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthor(slug)
  
  if (!author) {
    return {
      title: 'Chef Not Found',
    }
  }

  return {
    title: `${author.title} - World Foods Recipe Collection`,
    description: author.metadata?.bio || `Discover delicious recipes by ${author.title}.`,
    openGraph: {
      title: `${author.title} - Chef Profile`,
      description: author.metadata?.bio || `Discover delicious recipes by ${author.title}.`,
      images: author.metadata?.photo ? [
        {
          url: `${author.metadata.photo.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
        }
      ] : [],
    },
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params
  const [author, recipes] = await Promise.all([
    getAuthor(slug),
    getRecipesByAuthor(slug)
  ])

  if (!author) {
    notFound()
  }

  const socialLinks = author.metadata?.social_links as Record<string, string> | undefined

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <nav className="mb-8">
            <Link 
              href="/authors"
              className="text-white hover:text-primary-200 transition-colors"
            >
              ← Back to Chefs
            </Link>
          </nav>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {author.metadata?.photo && (
              <img
                src={`${author.metadata.photo.imgix_url}?w=400&h=400&fit=crop&auto=format,compress`}
                alt={author.title}
                width={200}
                height={200}
                className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-lg"
              />
            )}
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                {author.title}
              </h1>
              {author.metadata?.specialty && (
                <p className="text-xl mb-6 text-primary-200 font-medium">
                  Specialty: {author.metadata.specialty}
                </p>
              )}
              {author.metadata?.bio && (
                <p className="text-lg leading-relaxed text-white opacity-90 mb-6 max-w-3xl">
                  {author.metadata.bio}
                </p>
              )}
              
              {/* Social Links */}
              {socialLinks && Object.keys(socialLinks).length > 0 && (
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {socialLinks.website && (
                    <a
                      href={socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-primary-200 transition-colors"
                    >
                      🌐 Website
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a
                      href={`https://instagram.com/${socialLinks.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-primary-200 transition-colors"
                    >
                      📷 Instagram
                    </a>
                  )}
                  {socialLinks.youtube && (
                    <a
                      href={`https://youtube.com/${socialLinks.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-primary-200 transition-colors"
                    >
                      📺 YouTube
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={`https://twitter.com/${socialLinks.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-primary-200 transition-colors"
                    >
                      🐦 Twitter
                    </a>
                  )}
                  {socialLinks.facebook && (
                    <a
                      href={`https://facebook.com/${socialLinks.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-primary-200 transition-colors"
                    >
                      📘 Facebook
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recipes */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recipes by {author.title} ({recipes.length})
            </h2>
          </div>

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe: Recipe) => (
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
                {author.title} hasn't shared any recipes yet. Check back later for delicious new creations!
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