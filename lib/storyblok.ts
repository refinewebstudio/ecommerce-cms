import { storyblokInit, apiPlugin, getStoryblokApi } from '@storyblok/react/rsc';

// Import your Storyblok components
import Page from '@/components/storyblok/Page';
import Hero from '@/components/storyblok/Hero';
import ProductSpotlight from '@/components/storyblok/ProductSpotlight';
import ProductGrid from '@/components/storyblok/ProductGrid';
import TextBlock from '@/components/storyblok/TextBlock';
import ImageGallery from '@/components/storyblok/ImageGallery';
import CtaSection from '@/components/storyblok/CtaSection';
import BlogPost from '@/components/storyblok/BlogPost';
import CollectionShowcase from '@/components/storyblok/CollectionShowcase';
import TestimonialGrid from '@/components/storyblok/TestimonialGrid';
import FaqSection from '@/components/storyblok/FaqSection';
import NewsletterSignup from '@/components/storyblok/NewsletterSignup';

// Initialize Storyblok
storyblokInit({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN!,
  use: [apiPlugin],
  components: {
    page: Page,
    hero: Hero,
    product_spotlight: ProductSpotlight,
    product_grid: ProductGrid,
    text_block: TextBlock,
    image_gallery: ImageGallery,
    cta_section: CtaSection,
    blog_post: BlogPost,
    collection_showcase: CollectionShowcase,
    testimonial_grid: TestimonialGrid,
    faq_section: FaqSection,
    newsletter_signup: NewsletterSignup,
  },
});

export { getStoryblokApi };

// Helper function to get story data
export async function getStoryblokStory(slug: string, isPreview = false) {
  const storyblokApi = getStoryblokApi();
  
  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: isPreview ? 'draft' : 'published',
      resolve_relations: ['product_spotlight.product_handle', 'product_grid.products'],
    });
    
    return data?.story;
  } catch (error) {
    console.error('Error fetching Storyblok story:', error);
    return null;
  }
}

// Helper function to get multiple stories (for blog, etc.)
export async function getStoryblokStories(
  startsWith: string = '',
  isPreview = false,
  perPage = 10,
  page = 1
) {
  const storyblokApi = getStoryblokApi();
  
  try {
    const { data } = await storyblokApi.get('cdn/stories', {
      version: isPreview ? 'draft' : 'published',
      starts_with: startsWith,
      per_page: perPage,
      page: page,
      sort_by: 'created_at:desc',
    });
    
    return {
      stories: data?.stories || [],
      total: data?.total || 0,
      perPage: data?.per_page || perPage,
    };
  } catch (error) {
    console.error('Error fetching Storyblok stories:', error);
    return { stories: [], total: 0, perPage };
  }
}

// Type definitions for Storyblok content
export interface StoryblokStory {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: StoryblokComponent;
  created_at: string;
  published_at: string;
  tag_list: string[];
}

export interface StoryblokComponent {
  _uid: string;
  component: string;
  [key: string]: any;
}

export interface StoryblokAsset {
  id: number;
  alt: string;
  name: string;
  focus: string;
  title: string;
  filename: string;
  copyright: string;
  fieldtype: string;
}

export interface SeoComponent {
  title?: string;
  description?: string;
  og_image?: StoryblokAsset;
  og_title?: string;
  og_description?: string;
  twitter_image?: StoryblokAsset;
  twitter_title?: string;
  twitter_description?: string;
}