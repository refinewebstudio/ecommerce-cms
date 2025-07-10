import { storyblokEditable } from '@storyblok/react/rsc';
import { renderRichText } from '@storyblok/richtext';

interface TextBlockProps {
  blok: {
    _uid: string;
    component: string;
    content?: any; // Rich text
    alignment?: 'left' | 'center' | 'right';
    max_width?: 'narrow' | 'medium' | 'wide' | 'full';
    background_color?: string;
  };
}

export default function TextBlock({ blok }: TextBlockProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const maxWidthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-full'
  };

  const backgroundClass = blok.background_color 
    ? `bg-${blok.background_color}` 
    : '';

  return (
    <section {...storyblokEditable(blok)} className={`py-16 ${backgroundClass}`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`mx-auto ${maxWidthClasses[blok.max_width || 'medium']} ${alignmentClasses[blok.alignment || 'left']}`}>
          {blok.content && (
            <div 
              className="prose prose-lg text-gray-600 prose-headings:text-gray-900 prose-links:text-gray-900"
              dangerouslySetInnerHTML={{ 
                __html: renderRichText(blok.content) 
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}