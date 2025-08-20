import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'

export const metadata: Metadata = {
  title: 'World Foods Recipe Collection',
  description: 'Discover amazing recipes from around the world, learn from talented chefs, and explore diverse culinary traditions.',
  keywords: 'recipes, cooking, world food, international cuisine, chefs, food blog',
  authors: [{ name: 'World Foods Recipe Collection' }],
  openGraph: {
    title: 'World Foods Recipe Collection',
    description: 'Discover amazing recipes from around the world, learn from talented chefs, and explore diverse culinary traditions.',
    type: 'website',
    images: ['https://imgix.cosmicjs.com/880adca0-7df8-11f0-8dcc-651091f6a7c0-photo-1551218808-94e220e084d2-1755716683430.jpg?w=1200&h=630&fit=crop&auto=format,compress'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World Foods Recipe Collection',
    description: 'Discover amazing recipes from around the world, learn from talented chefs, and explore diverse culinary traditions.',
    images: ['https://imgix.cosmicjs.com/880adca0-7df8-11f0-8dcc-651091f6a7c0-photo-1551218808-94e220e084d2-1755716683430.jpg?w=1200&h=630&fit=crop&auto=format,compress'],
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}