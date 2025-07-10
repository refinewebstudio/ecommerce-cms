
// components/storyblok/CtaSection.tsx
import { storyblokEditable } from '@storyblok/react/rsc';
import { renderRichText } from '@storyblok/richtext';
import Link from 'next/link';
import { StoryblokAsset } from '@/lib/storyblok';

interface CtaSectionProps {
  blok: {
    _uid: string;
    component: string;
    headline?: string;
    description?: any; // Rich text
    primary_button?: {
      text: string;
      url: string;
    };
    secondary_button?: {
      text: string;
      url: string;
    };
    background_image?: StoryblokAsset;
    background_color?: string;
    overlay_opacity?: number;
  };
}

export default function CtaSection({ blok }: CtaSectionProps) {
  const backgroundClass = blok.background_color 
    ? `bg-${blok.background_color}` 
    : 'bg-gray-900';

  return (
    <section {...storyblokEditable(blok)} className={`relative py-24 ${backgroundClass}`}>
      {blok.background_image && (
        <>
          <img
            src={blok.background_image.filename}
            alt={blok.background_image.alt || ''}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: (blok.overlay_opacity || 50) / 100 }}
          />
        </>
      )}
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {blok.headline && (
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {blok.headline}
            </h2>
          )}
          
          {blok.description && (
            <div 
              className="mx-auto mt-6 max-w-3xl text-lg text-gray-300"
              dangerouslySetInnerHTML={{ 
                __html: renderRichText(blok.description) 
              }}
            />
          )}

          {(blok.primary_button || blok.secondary_button) && (
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
              {blok.primary_button && (
                <Link
                  href={blok.primary_button.url}
                  className="inline-flex items-center rounded-md bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  {blok.primary_button.text}
                </Link>
              )}
              {blok.secondary_button && (
                <Link
                  href={blok.secondary_button.url}
                  className="inline-flex items-center rounded-md border-2 border-white px-8 py-3 text-base font-medium text-white hover:bg-white hover:text-gray-900"
                >
                  {blok.secondary_button.text}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}