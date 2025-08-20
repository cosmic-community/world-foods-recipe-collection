'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

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
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 relative z-50"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 relative">
              <span 
                className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'rotate-45 top-3' : 'top-1'
                }`}
              />
              <span 
                className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out top-3 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span 
                className={`absolute block h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? '-rotate-45 top-3' : 'top-5'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/recipes" 
                className="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Recipes
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/authors" 
                className="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Chefs
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}