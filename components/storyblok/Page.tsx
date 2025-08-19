// components/storyblok/Page.tsx - Fixed for App Router RSC
import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';
import { StoryblokComponent as StoryblokComponentType } from '@/lib/storyblok';

interface PageProps {
  blok: {
    _uid: string;
    component: string;
    body?: StoryblokComponentType[];
    title?: string;
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
      {/* Optional page title */}
      {blok.title && (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">{blok.title}</h1>
        </div>
      )}
      
      {/* Render nested components using StoryblokServerComponent */}
      {blok.body?.map((nestedBlok) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  );
}