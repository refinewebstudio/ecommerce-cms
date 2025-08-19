import { storyblokEditable } from '@storyblok/react/rsc';
import { richTextResolver } from '@storyblok/richtext';
import Link from 'next/link';
import { StoryblokAsset } from '@/lib/storyblok';
import { trackFormSubmission } from '@/lib/analytics';

interface HeroProps {
  blok: {
    _uid: string;
    component: string;
    headline?: string;
    subheadline?: any; // Rich text
    background_image?: StoryblokAsset;
    background_video?: StoryblokAsset;
    overlay_opacity?: number;
    text_position?: 'left' | 'center' | 'right';
    text_color?: 'white' | 'black' | 'gray';
    primary_cta?: {
      text: string;
      url: string;
      style?: 'primary' | 'secondary' | 'outline';
    };
    secondary_cta?: {
      text: string;
      url: string;
      style?: 'primary' | 'secondary' | 'outline';
    };
    height?: 'small' | 'medium' | 'large' | 'fullscreen';
  };
}

// FIX 1: Move getCtaClasses function OUTSIDE the component
function getCtaClasses(style?: string, isPrimary?: boolean) {
  const baseClasses = "inline-flex items-center rounded-md px-8 py-3 text-base font-medium transition-all duration-200";
  
  if (style === 'outline') {
    return `${baseClasses} border-2 border-white text-white hover:bg-white hover:text-gray-900`;
  } else if (style === 'secondary' || !isPrimary) {
    return `${baseClasses} bg-white text-gray-900 hover:bg-gray-100`;
  } else {
    return `${baseClasses} bg-gray-900 text-white hover:bg-gray-800`;
  }
}

export default function Hero({ blok }: HeroProps) {
  const { render } = richTextResolver()
  const heightClasses = {
    small: 'h-96',
    medium: 'h-[32rem]',
    large: 'h-[40rem]',
    fullscreen: 'h-screen'
  };

  const textPositionClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  const textColorClasses = {
    white: 'text-white',
    black: 'text-gray-900',
    gray: 'text-gray-600'
  };

  const overlayOpacity = blok.overlay_opacity || 50;

  return (
    <section 
      {...storyblokEditable(blok)} 
      className={`relative flex items-center justify-center ${heightClasses[blok.height || 'medium']}`}
    >
      {/* Background Media */}
      {blok.background_video?.filename ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={blok.background_video.filename} type="video/mp4" />
        </video>
      ) : blok.background_image?.filename ? (
        <img
          src={blok.background_image.filename}
          alt={blok.background_image.alt || 'Hero background'}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700" />
      )}

      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Content */}
      <div className={`relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${textPositionClasses[blok.text_position || 'center']}`}>
        <div className="max-w-4xl space-y-6">
          {blok.headline && (
            <h1 className={`text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl ${textColorClasses[blok.text_color || 'white']}`}>
              {blok.headline}
            </h1>
          )}

          {blok.subheadline && (
            <div 
              className={`text-xl sm:text-2xl ${textColorClasses[blok.text_color || 'white']} opacity-90`}  dangerouslySetInnerHTML={{ 
                __html: render(blok.subheadline) as string
              }}
            />
          )}

          {/* FIX 2: Add proper validation for CTAs to prevent undefined href errors */}
          {(blok.primary_cta || blok.secondary_cta) && (
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              {blok.primary_cta?.text && blok.primary_cta?.url && (
                <Link
                  href={blok.primary_cta.url}
                  className={getCtaClasses(blok.primary_cta.style, true)}
                >
                  {blok.primary_cta.text}
                </Link>
              )}
              {blok.secondary_cta?.text && blok.secondary_cta?.url && (
                <Link
                  href={blok.secondary_cta.url}
                  className={getCtaClasses(blok.secondary_cta.style, false)}
                >
                  {blok.secondary_cta.text}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator for fullscreen */}
      {blok.height === 'fullscreen' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-white opacity-70">
            <span className="text-sm">Scroll to explore</span>
            <div className="h-6 w-4 rounded-full border-2 border-white">
              <div className="mx-auto mt-1 h-2 w-1 rounded-full bg-white animate-bounce" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}