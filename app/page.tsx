
// app/page.tsx - Updated to handle Storyblok preview parameters with bridge
import { Suspense } from 'react';
import { StoryblokStory } from '@storyblok/react/rsc';
import { getStoryblokStory } from '@/lib/storyblok';
import { Metadata } from 'next';
import StoryblokPreviewBridge from '@/components/StoryblokPreviewBridge';

interface HomePageProps {
  searchParams: Promise<{
    _storyblok?: string;
    _storyblok_tk?: string;
  }>;
}

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

export default async function HomePage(props: HomePageProps) {
  const searchParams = await props.searchParams;
  const isPreview = !!searchParams._storyblok;

  try {
    // IMPORTANT: Always use draft version for homepage when in preview
    const story = await getStoryblokStory('home', isPreview);
    
    if (!story) {
      return <ErrorFallback />;
    }

    return (
      <>
        {/* Add the bridge component - this is likely what's missing */}
        <StoryblokPreviewBridge />
        
        {/* Debug info to verify we're getting draft content */}
        {process.env.NODE_ENV === 'development' && isPreview && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 mb-4 text-sm">
            <strong>🏠 Homepage Preview Mode:</strong>
            <div>Story: {story.name}</div>
            <div>Published: {story.published_at ? '✅ Yes' : '❌ No (Draft)'}</div>
            <div>Preview mode: ✅ Yes</div>
            <div>Story ID: {story.id}</div>
            <div>Content updated: {new Date(story.content._uid).toLocaleString()}</div>
          </div>
        )}
        
        <Suspense fallback={<LoadingFallback />}>
          <StoryblokStory story={story} />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);
    return <ErrorFallback />;
  }
}

// Generate metadata from Storyblok SEO data
export async function generateMetadata(props: HomePageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const isPreview = !!searchParams._storyblok;

  try {
    const story = await getStoryblokStory('home', isPreview);
    
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