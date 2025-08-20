import Link from 'next/link'
import type { CategoryCardProps } from '@/types'

export default function CategoryCard({ category, className = '' }: CategoryCardProps) {
  const categoryImage = category.metadata?.image

  return (
    <Link 
      href={`/categories/${category.slug}`}
      className={`card overflow-hidden group hover:shadow-lg transition-all duration-300 ${className}`}
    >
      {/* Category Image */}
      {categoryImage?.imgix_url && (
        <div className="aspect-w-16 aspect-h-10 relative overflow-hidden">
          <img
            src={`${categoryImage.imgix_url}?w=600&h=300&fit=crop&auto=format,compress`}
            alt={category.title}
            width={300}
            height={150}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {category.title}
        </h3>

        {category.metadata?.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {category.metadata.description}
          </p>
        )}

        <div className="flex items-center mt-4 text-primary-600 text-sm font-medium">
          <span>Explore recipes</span>
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}