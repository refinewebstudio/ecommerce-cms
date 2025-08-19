// components/storyblok/TestimonialGrid.tsx - Fixed for RSC package
import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc';

interface TestimonialGridProps {
  blok: {
    _uid: string;
    component: string;
    title?: string;
    testimonials?: any[]; // Array of testimonial blocks
    layout?: string;
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

        {blok.testimonials && blok.testimonials.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {blok.testimonials.map((testimonial) => (
              <StoryblokServerComponent 
                blok={testimonial} 
                key={testimonial._uid} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">
              No testimonials added yet. Add testimonial blocks in Storyblok.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}