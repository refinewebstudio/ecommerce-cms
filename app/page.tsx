// 1. First, update your app/page.tsx (root homepage)
// app/page.tsx

import { Suspense } from 'react';
import { StoryblokComponent } from '@storyblok/react';
import { getStoryblokStory } from '@/lib/storyblok';
import { Metadata } from 'next';

// Fallback loading component
function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Error fallback component
function ErrorFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600">Please try refreshing the page.</p>
      </div>
    </div>
  );
}

export default async function HomePage() {
  try {
    // Try to get Storyblok homepage
    const story = await getStoryblokStory('home');
    
    if (!story) {
      // If no Storyblok story found, show error or fallback
      return <ErrorFallback />;
    }

    return (
      <Suspense fallback={<LoadingFallback />}>
        <StoryblokComponent blok={story.content} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);
    return <ErrorFallback />;
  }
}

// Generate metadata from Storyblok SEO data
export async function generateMetadata(): Promise<Metadata> {
  try {
    const story = await getStoryblokStory('home');
    
    if (!story) {
      return {
        title: 'Acme Store - Premium Products for Modern Living',
        description: 'Shop premium quality products at Acme Store.',
      };
    }

    // Get SEO data from the story
    const seo = story.content.seo?.[0]; // First SEO block
    
    return {
      title: seo?.title || story.name || 'Acme Store',
      description: seo?.description || 'Shop premium quality products at Acme Store.',
      openGraph: {
        title: seo?.og_title || seo?.title || story.name,
        description: seo?.og_description || seo?.description,
        images: seo?.og_image?.filename ? [seo.og_image.filename] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: seo?.twitter_title || seo?.title || story.name,
        description: seo?.twitter_description || seo?.description,
        images: seo?.twitter_image?.filename ? [seo.twitter_image.filename] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Acme Store',
      description: 'Shop premium quality products.',
    };
  }
}