// lib/storyblok.ts (updated version)

import { storyblokInit, apiPlugin, getStoryblokApi } from '@storyblok/react';

// Import your components (make sure these files exist)
import Page from '@/components/storyblok/Page';
import Hero from '@/components/storyblok/HeroSection';
import ProductSpotlight from '@/components/storyblok/ProductSpotlight' ;
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

// Initialize Storyblok
storyblokInit({
  accessToken: process.env.STORYBLOK_ACCESS_TOKEN!,
  use: [apiPlugin],
  components,
});

console.log('🔍 Checking component types:');
Object.entries(components).forEach(([name, component]) => {
  console.log(`${name}:`, {
    isFunction: typeof component === 'function',
    isAsync: component.constructor.name === 'AsyncFunction',
    toString: component.toString().slice(0, 100) + '...'
  });
});


export { getStoryblokApi };

// Helper function to get story with better error handling
export async function getStoryblokStory(slug: string, isPreview = false) {
  const storyblokApi = getStoryblokApi();
  
  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, {
      version: isPreview ? 'draft' : 'published',
      resolve_relations: ['product_spotlight.product_handle', 'product_grid.products'],
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