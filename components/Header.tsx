import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌍</span>
            <span className="text-xl font-bold text-gray-900">
              World Foods
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/recipes" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Recipes
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Categories
            </Link>
            <Link 
              href="/authors" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Chefs
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-700 hover:text-primary-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-100 py-4">
          <nav className="flex flex-col space-y-2">
            <Link 
              href="/recipes" 
              className="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
            >
              Recipes
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
            >
              Categories
            </Link>
            <Link 
              href="/authors" 
              className="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
            >
              Chefs
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}