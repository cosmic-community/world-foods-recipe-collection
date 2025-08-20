# World Foods Recipe Collection

![App Preview](https://imgix.cosmicjs.com/880adca0-7df8-11f0-8dcc-651091f6a7c0-photo-1551218808-94e220e084d2-1755716683430.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A beautiful recipe discovery platform showcasing culinary traditions from around the world. Browse recipes, learn about talented chefs, and explore diverse food categories in this modern, responsive web application.

## Features

- 🍳 **Recipe Collection**: Browse detailed recipes with ingredients, instructions, and cooking times
- 👨‍🍳 **Chef Profiles**: Learn about talented chefs and their culinary specialties
- 🌍 **Global Categories**: Explore recipes by cuisine type (Italian, Asian, Desserts, etc.)
- 📱 **Responsive Design**: Perfect experience across all devices
- 🚀 **Fast Performance**: Optimized images and efficient data loading
- 🔍 **SEO Optimized**: Built for search engine visibility

## Clone this Bucket and Code Repository

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Bucket and Code Repository](https://img.shields.io/badge/Clone%20this%20Bucket-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=68a61b39ec04c88d2485bd69&clone_repository=68a61d45ec04c88d2485bd89)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a website for world food including recipes, authors, and categories"

### Code Generation Prompt

> Build a Next.js website for world food including recipes, authors, and categories

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Cosmic** - Headless CMS for content management
- **Bun** - Fast package manager and runtime

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account and bucket

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Cosmic credentials:
   ```
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching Recipes with Categories and Authors

```typescript
import { cosmic } from '@/lib/cosmic'

// Get all recipes with related data
const response = await cosmic.objects.find({
  type: 'recipes'
}).props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
  .limit(10)

const recipes = response.objects
```

### Getting a Single Recipe

```typescript
// Get recipe by slug with full details
const response = await cosmic.objects.findOne({
  type: 'recipes',
  slug: 'classic-spaghetti-carbonara'
}).depth(2)

const recipe = response.object
```

## Cosmic CMS Integration

This application integrates with three main content types:

- **Recipes**: Complete recipe details with ingredients, instructions, and metadata
- **Authors**: Chef profiles with bio, photo, and specialty information
- **Categories**: Food categories with descriptions and images

All content is managed through your Cosmic dashboard and automatically synced to the website.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Environment Variables

Make sure to set these environment variables in your deployment platform:

- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket slug
- `COSMIC_READ_KEY` - Your Cosmic read key  
- `COSMIC_WRITE_KEY` - Your Cosmic write key

The application will automatically use the staging API environment for development and can be configured for production use.

<!-- README_END -->