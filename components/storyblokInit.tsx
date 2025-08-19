// components/StoryblokInit.tsx - Client-side initialization with lazy loading
'use client';

import { useEffect } from 'react';
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';

export function StoryblokInit() {
  useEffect(() => {
    async function initializeStoryblok() {
      console.log('🔧 Client-side: Loading Storyblok components...');
      
      try {
        // Dynamically import components to avoid server function issues
        const [
          { default: Page },
          { default: Hero },
          { default: ProductSpotlight },
          { default: ProductGrid },
          { default: TextBlock },
          { default: CtaSection },
          { default: CollectionShowcase },
          { default: TestimonialGrid },
          { default: Testimonial },
          { default: NewsletterSignup },
          { default: CtaButton },
          { default: Seo },
        ] = await Promise.all([
          import('@/components/storyblok/Page'),
          import('@/components/storyblok/HeroSection'),
          import('@/components/storyblok/ProductSpotlight'),
          import('@/components/storyblok/ProductGrid'),
          import('@/components/storyblok/TextBlock'),
          import('@/components/storyblok/CtaSection'),
          import('@/components/storyblok/CollectionShowcase'),
          import('@/components/storyblok/TestimonialGrid'),
          import('@/components/storyblok/Testimonial'),
          import('@/components/storyblok/NewsletterSignup'),
          import('@/components/storyblok/CtaButton'),
          import('@/components/storyblok/Seo'),
        ]);

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

        console.log('🔧 Client-side: Initializing Storyblok with components:', Object.keys(components));
        
        // Initialize Storyblok on client-side
        storyblokInit({
          accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN!,
          use: [apiPlugin],
          components,
          apiOptions: {
            region: 'eu',
          },
        });

        console.log('✅ Client-side Storyblok initialization complete');
      } catch (error) {
        console.error('❌ Error initializing Storyblok on client:', error);
      }
    }

    initializeStoryblok();
  }, []);

  return null; // This component doesn't render anything
}