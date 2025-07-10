// app/[slug]/page.tsx - Combined dynamic route for both Shopify and Storyblok
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StoryblokComponent } from '@storyblok/react';
import Prose from 'components/prose';
import { getPage } from 'lib/shopify';
import { getStoryblokStory } from '@/lib/storyblok';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    _storyblok?: string;
  }>;
}

export default async function DynamicPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const isPreview = !!searchParams._storyblok;

  // Try Shopify first (priority for eCommerce)
  try {
    const page = await getPage(params.slug);
    if (page) {
      return (
        <>
          <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
          <Prose className="mb-8" html={page.body} />
          <p className="text-sm italic">
            {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }).format(new Date(page.updatedAt))}.`}
          </p>
        </>
      );
    }
  } catch (error) {
    console.log('Shopify page not found, trying Storyblok...');
  }

  // Try Storyblok page
  try {
    const story = await getStoryblokStory(params.slug, isPreview);
    if (story) {
      return <StoryblokComponent blok={story.content} />;
    }
  } catch (error) {
    console.log('Storyblok page not found');
  }
      return (
        <>
          <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
          <Prose className="mb-8" html={page.body} />
          <p className="text-sm italic">
            {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }).format(new Date(page.updatedAt))}.`}
          </p>
        </>
      );
    }
  } catch (error) {
    console.log('Shopify page not found');
  }

  // Neither found - return 404
  return notFound();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const isPreview = !!searchParams._storyblok;

  // Try Shopify first (priority for eCommerce)
  try {
    const page = await getPage(params.slug);
    if (page) {
      return {
        title: page.seo?.title || page.title,
        description: page.seo?.description || page.bodySummary,
        openGraph: {
          publishedTime: page.createdAt,
          modifiedTime: page.updatedAt,
          type: 'article'
        }
      };
    }
  } catch (error) {
    console.log('Shopify metadata not found, trying Storyblok...');
  }

  // Try Storyblok page
  try {
    const story = await getStoryblokStory(params.slug, isPreview);
    if (story) {
      const seo = story.content.seo;
      
      return {
        title: seo?.title || story.name,
        description: seo?.description || story.content.excerpt,
        openGraph: {
          title: seo?.og_title || seo?.title || story.name,
          description: seo?.og_description || seo?.description,
          images: seo?.og_image?.filename ? [seo.og_image.filename] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title: seo?.twitter_title || seo?.title || story.name,
          description: seo?.twitter_description || seo?.description,
          images: seo?.twitter_image?.filename ? [seo.twitter_image.filename] : [],
        },
      };
    }
  } catch (error) {
    console.log('Storyblok metadata not found');
  }

  // Default fallback
  return {
    title: 'Page Not Found',
  };
}