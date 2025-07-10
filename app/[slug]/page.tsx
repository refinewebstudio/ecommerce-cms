// app/[slug]/page.tsx - Dynamic Storyblok pages
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StoryblokComponent } from '@storyblok/react/rsc';
import { getStoryblokStory } from '@/lib/storyblok';

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    _storyblok?: string;
  };
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const isPreview = !!searchParams._storyblok;
  const story = await getStoryblokStory(params.slug, isPreview);

  if (!story) {
    notFound();
  }

  return <StoryblokComponent blok={story.content} />;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const isPreview = !!searchParams._storyblok;
  const story = await getStoryblokStory(params.slug, isPreview);

  if (!story) {
    return {
      title: 'Page Not Found',
    };
  }

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