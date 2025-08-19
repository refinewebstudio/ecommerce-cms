
// lib/storyblok.ts - Fixed version with proper token handling for preview
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';

// Import your components (make sure these files exist)
import Page from '@/components/storyblok/Page';
import Hero from '@/components/storyblok/HeroSection';
import ProductSpotlight from '@/components/storyblok/ProductSpotlight';
import ProductGrid from '@/components/storyblok/ProductGrid';
import TextBlock from '@/components/storyblok/TextBlock';
import CtaSection from '@/components/storyblok/CtaSection';
import CollectionShowcase from '@/components/storyblok/CollectionShowcase';
import TestimonialGrid from '@/components/storyblok/TestimonialGrid';
import Testimonial from '@/components/storyblok/Testimonial';
import NewsletterSignup from '@/components/storyblok/NewsletterSignup';
import CtaButton from '@/components/storyblok/CtaButton';
import Seo from '@/components/storyblok/Seo';

const components = {
  page: Page,
  hero: Hero,
  product_spotlight: ProductSpotlight,
  product_grid: ProductGrid,
  text_block: TextBlock,
  cta_section: CtaSection,
  collection_showcase: CollectionShowcase,
  testimonial_grid: TestimonialGrid,
  testimonial: Testimonial,
  newsletter_signup: NewsletterSignup,
  cta_button: CtaButton,
  seo: Seo,
};

// Use preview token for initialization to support both published and draft content
const accessToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN || process.env.STORYBLOK_ACCESS_TOKEN;

// Initialize Storyblok with preview token for full access
export const getStoryblokApi = storyblokInit({
  accessToken: accessToken!,
  use: [apiPlugin],
  components,
  apiOptions: {
    region: 'eu', // Change to 'us' if your space is in the US region
  },
});

console.log('🔍 Storyblok initialized with token type:', accessToken?.startsWith(process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN || '') ? 'PREVIEW' : 'PUBLISHED');
console.log('🔍 Component registration:', Object.keys(components));

// Helper function to get story with better error handling
export async function getStoryblokStory(slug: string, isPreview = false) {
  const storyblokApi = getStoryblokApi();
  
  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: isPreview ? 'draft' : 'published',
      resolve_relations: ['product_spotlight.product_handle', 'product_grid.products'],
      cv: isPreview ? Date.now() : undefined, // Cache busting for preview mode
    });
    
    return data?.story;
  } catch (error: any) {
    console.error(`Error fetching Storyblok story "${slug}":`, error.message);
    
    // Log more details for debugging
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    return null;
  }
}

// Helper to get multiple stories
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
      cv: isPreview ? Date.now() : undefined,
    });
    
    return {
      stories: data?.stories || [],
      total: data?.total || 0,
      perPage: data?.per_page || perPage,
    };
  } catch (error: any) {
    console.error('Error fetching Storyblok stories:', error.message);
    return { stories: [], total: 0, perPage };
  }
}

// Type definitions
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