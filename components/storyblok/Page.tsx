import { StoryblokComponent, storyblokEditable } from '@storyblok/react';
import { StoryblokComponent as StoryblokComponentType } from '@/lib/storyblok';

interface PageProps {
  blok: {
    _uid: string;
    component: string;
    body?: StoryblokComponentType[];
    seo?: {
      title?: string;
      description?: string;
      og_image?: { filename: string; alt: string };
    };
  };
}

export default function Page({ blok }: PageProps) {
  return (
    <main {...storyblokEditable(blok)} className="min-h-screen">
      {blok.body?.map((nestedBlok) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}