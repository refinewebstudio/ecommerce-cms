// components/storyblok/NewsletterSignup.tsx (Server Component)
import { storyblokEditable } from '@storyblok/react/rsc';
import { richTextResolver } from '@storyblok/richtext';
import NewsletterForm from './NewsletterForm'; // Client component

interface NewsletterSignupProps {
  blok: {
    _uid: string;
    component: string;
    title?: string;
    description?: any; // Rich text
    placeholder_text?: string;
    button_text?: string;
    success_message?: string;
    background_color?: string;
    layout?: 'inline' | 'stacked';
  };
}

export default function NewsletterSignup({ blok }: NewsletterSignupProps) {
  const { render } = richTextResolver()
  const backgroundClass = blok.background_color 
    ? `bg-${blok.background_color}` 
    : 'bg-gray-50';

  // Extract only plain data (no functions) to pass to client component
  const formProps = {
    placeholderText: blok.placeholder_text || 'Enter your email',
    buttonText: blok.button_text || 'Subscribe',
    successMessage: blok.success_message || 'Thanks for subscribing!',
    layout: blok.layout || 'stacked'
  };

  return (
    <section {...storyblokEditable(blok)} className={`py-16 ${backgroundClass}`}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {blok.title && (
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {blok.title}
            </h2>
          )}
          
          {blok.description && (
            <div 
              className="mx-auto mt-4 max-w-3xl text-lg text-gray-600"
              dangerouslySetInnerHTML={{ 
                __html: render(blok.description) as string 
              }}
            />
          )}

          {/* Pass only plain data to client component */}
          <NewsletterForm {...formProps} />

          <p className="mt-4 text-sm text-gray-500">
            We respect your privacy and never share your email address.
          </p>
        </div>
      </div>
    </section>
  );
}

