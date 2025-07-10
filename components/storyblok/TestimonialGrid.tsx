
// components/storyblok/TestimonialGrid.tsx
import { storyblokEditable } from '@storyblok/react/rsc';
import { renderRichText } from '@storyblok/richtext';
import { StoryblokAsset } from '@/lib/storyblok';

interface TestimonialGridProps {
  blok: {
    _uid: string;
    component: string;
    title?: string;
    testimonials?: Array<{
      _uid: string;
      name: string;
      role?: string;
      company?: string;
      content: any; // Rich text
      avatar?: StoryblokAsset;
      rating?: number;
    }>;
    layout?: 'grid' | 'carousel';
    background_color?: string;
  };
}

export default function TestimonialGrid({ blok }: TestimonialGridProps) {
  const backgroundClass = blok.background_color 
    ? `bg-${blok.background_color}` 
    : 'bg-gray-50';

  return (
    <section {...storyblokEditable(blok)} className={`py-16 ${backgroundClass}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {blok.title && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {blok.title}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {blok.testimonials?.map((testimonial) => (
            <div key={testimonial._uid} className="rounded-lg bg-white p-8 shadow-sm">
              {testimonial.rating && (
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}

              <div 
                className="mb-6 text-gray-600"
                dangerouslySetInnerHTML={{ 
                  __html: renderRichText(testimonial.content) 
                }}
              />

              <div className="flex items-center">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar.filename}
                    alt={testimonial.avatar.alt || testimonial.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div className={testimonial.avatar ? 'ml-4' : ''}>
                  <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && ', '}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}