
// components/storyblok/CtaSection.tsx
import { storyblokEditable } from '@storyblok/react/rsc';
import { richTextResolver } from '@storyblok/richtext';
import Link from 'next/link';
import { StoryblokAsset } from '@/lib/storyblok';

interface CtaSectionProps {
  blok: {
    _uid: string;
    component: string;
    headline?: string;
    description?: any; // Rich text
    primary_button?: Array<{
      text: string;
      url: string;
      _uid: string;
      style?: string;
      size?: string;
      component: string;
    }>;
    secondary_button?: Array<{
      text: string;
      url: string;
      _uid: string;
      style?: string;
      size?: string;
      component: string;
    }>;
    background_image?: StoryblokAsset;
    background_color?: string;
    overlay_opacity?: string | number;
  };
}

export default function CtaSection({ blok }: CtaSectionProps) {
  const { render } = richTextResolver()

   const backgroundClass = blok.background_color && blok.background_color.trim() !== ''
    ? `bg-${blok.background_color}` 
    : 'bg-gray-900';

  // Get first button from arrays (since they're arrays in your data)
  const primaryButton = blok.primary_button?.[0];
  const secondaryButton = blok.secondary_button?.[0];

  // Convert overlay_opacity to number
  const overlayOpacity = typeof blok.overlay_opacity === 'string' 
    ? parseInt(blok.overlay_opacity) || 50
    : blok.overlay_opacity || 50;

  return (
    <section {...storyblokEditable(blok)} className={`relative py-24 ${backgroundClass}`}>
      {blok.background_image?.filename && 
      blok.background_image.filename.trim() !== '' && 
      blok.background_image.filename !== null && (
        <>
          <img
            src={blok.background_image.filename}
            alt={blok.background_image.alt || ''}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity / 100 }}
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
                __html: render(blok.description) as string
              }}
            />
          )}
            {(primaryButton || secondaryButton) && (
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6">
                {primaryButton?.text && primaryButton?.url && (
                  <Link
                    href={primaryButton.url}
                    className="inline-flex items-center rounded-md bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100"
                  >
                    {primaryButton.text}
                  </Link>
                )}
                {secondaryButton?.text && secondaryButton?.url && (
                  <Link
                    href={secondaryButton.url}
                    className="inline-flex items-center rounded-md border-2 border-white px-8 py-3 text-base font-medium text-white hover:bg-white hover:text-gray-900"
                  >
                    {secondaryButton.text}
                  </Link>
                )}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}

