import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto container-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🌍</span>
              <span className="text-xl font-bold">World Foods</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Discover amazing recipes from around the world, learn from talented chefs, 
              and explore diverse culinary traditions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/recipes" className="text-gray-400 hover:text-white transition-colors">
                  All Recipes
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/authors" className="text-gray-400 hover:text-white transition-colors">
                  Chefs
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Cuisines</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/categories/italian-cuisine" className="text-gray-400 hover:text-white transition-colors">
                  Italian Cuisine
                </Link>
              </li>
              <li>
                <Link href="/categories/asian-cuisine" className="text-gray-400 hover:text-white transition-colors">
                  Asian Cuisine
                </Link>
              </li>
              <li>
                <Link href="/categories/desserts" className="text-gray-400 hover:text-white transition-colors">
                  Desserts
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} World Foods Recipe Collection. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Powered by{' '}
              <a 
                href="https://www.cosmicjs.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Cosmic
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}