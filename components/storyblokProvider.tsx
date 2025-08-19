// components/StoryblokProvider.tsx - Simple provider that uses lib/storyblok
'use client';

import { getStoryblokApi } from '@/lib/storyblok';

interface StoryblokProviderProps {
  children: React.ReactNode;
}

export default function StoryblokProvider({ children }: StoryblokProviderProps) {
  // This ensures the Storyblok API is initialized on the client side too
  getStoryblokApi();
  
  return <>{children}</>;
}