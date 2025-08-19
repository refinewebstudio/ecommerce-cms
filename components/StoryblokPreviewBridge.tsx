// components/StoryblokPreviewBridge.tsx - Bridge component for homepage
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function StoryblokPreviewBridge() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('_storyblok');

  useEffect(() => {
    // Only load bridge if we're in preview mode
    if (!isPreview) return;

    console.log('🔗 Loading Storyblok Bridge for homepage visual editor...');

    // Load the bridge script for visual editing
    const script = document.createElement('script');
    script.src = '//app.storyblok.com/f/storyblok-v2-latest.js';
    script.async = true;
    
    script.onload = () => {
      if (window.storyblok) {
        window.storyblok.init({
          accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN || '',
        });

        // Listen for input changes with debouncing to prevent revert issues
        let inputTimeout: NodeJS.Timeout;
        
        window.storyblok.on(['input'], (event) => {
          console.log('📝 Homepage content input detected...');
          
          // Clear previous timeout
          clearTimeout(inputTimeout);
          
          // Debounce the reload - only reload after user stops editing for 1 second
          inputTimeout = setTimeout(() => {
            console.log('🔄 Reloading homepage after input change...');
            window.location.reload();
          }, 1000);
        });

        // Listen for publish events (reload immediately)
        window.storyblok.on(['published', 'change'], () => {
          console.log('🔄 Homepage content published/changed, reloading...');
          window.location.reload();
        });

        console.log('✅ Storyblok Bridge loaded for homepage');
      }
    };

    script.onerror = () => {
      console.error('❌ Failed to load Storyblok Bridge for homepage');
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isPreview]);

  return null;
}

// Type declaration
declare global {
  interface Window {
    storyblok: {
      init: (config: { accessToken: string }) => void;
      on: (events: string[], callback: (event?: any) => void) => void;
    };
  }
}