// lib/storyblok-components.ts - Shared component configuration
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

// Single source of truth for all Storyblok components
export const storyblokComponents = {
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

// Debug function to check component imports
export function debugComponents() {
  console.log('🔍 Component imports check:');
  Object.entries(storyblokComponents).forEach(([name, component]) => {
    console.log(`${name}:`, {
      exists: !!component,
      type: typeof component,
      isFunction: typeof component === 'function',
      name: component?.name || 'unnamed',
    });
  });
}