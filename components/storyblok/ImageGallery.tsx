
// components/storyblok/ImageGallery.tsx
import { storyblokEditable } from '@storyblok/react/rsc';
import { StoryblokAsset } from '@/lib/storyblok';

interface ImageGalleryProps {
  blok: {
    _uid: string;
    component: string;
    images?: StoryblokAsset[];
    layout?: 'grid' | 'masonry' | 'carousel';
    columns?: '2' | '3' | '4';
    gap?: 'small' | 'medium' | 'large';
  };
}

export default function ImageGallery({ blok }: ImageGalleryProps) {
  const gridCols = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  const gapClasses = {
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-8'
  };

  if (!blok.images || blok.images.length === 0) {
    return null;
  }

  return (
    <section {...storyblokEditable(blok)} className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`grid ${gridCols[blok.columns || '3']} ${gapClasses[blok.gap || 'medium']}`}>
          {blok.images.map((image, index) => (
            <div key={index} className="group cursor-pointer overflow-hidden rounded-lg">
              <img
                src={image.filename}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="h-64 w-full object-cover transition-all duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}