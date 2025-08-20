import Link from 'next/link'
import type { AuthorCardProps } from '@/types'

export default function AuthorCard({ author, className = '' }: AuthorCardProps) {
  const authorPhoto = author.metadata?.photo
  const socialLinks = author.metadata?.social_links

  return (
    <div className={`card p-8 group hover:shadow-lg transition-all duration-300 ${className}`}>
      <div className="flex items-start space-x-6">
        {/* Author Photo */}
        {authorPhoto && (
          <Link href={`/authors/${author.slug}`}>
            <img
              src={`${authorPhoto.imgix_url}?w=200&h=200&fit=crop&auto=format,compress`}
              alt={author.title}
              width={100}
              height={100}
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}

        <div className="flex-1">
          {/* Author Name */}
          <Link href={`/authors/${author.slug}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {author.title}
            </h3>
          </Link>

          {/* Specialty */}
          {author.metadata?.specialty && (
            <p className="text-primary-600 font-medium mb-3">
              {author.metadata.specialty}
            </p>
          )}

          {/* Bio */}
          {author.metadata?.bio && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {author.metadata.bio}
            </p>
          )}

          {/* Social Links */}
          {socialLinks && (
            <div className="flex items-center space-x-3">
              {socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${socialLinks.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-600 transition-colors"
                  aria-label={`${author.title} on Instagram`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}

              {socialLinks.youtube && (
                <a
                  href={`https://youtube.com/@${socialLinks.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  aria-label={`${author.title} on YouTube`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}

              {socialLinks.website || author.metadata?.website && (
                <a
                  href={socialLinks.website || author.metadata?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label={`${author.title}'s website`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}