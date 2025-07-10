
// components/storyblok/NewsletterSignup.tsx
'use client';

import { storyblokEditable } from '@storyblok/react/rsc';
import { renderRichText } from '@storyblok/richtext';
import { useState } from 'react';

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
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Replace with your newsletter service API
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage(blok.success_message || 'Thanks for subscribing!');
        setEmail('');
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const backgroundClass = blok.background_color 
    ? `bg-${blok.background_color}` 
    : 'bg-gray-50';

  const isInline = blok.layout === 'inline';

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
                __html: renderRichText(blok.description) 
              }}
            />
          )}

          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md">
            {status === 'success' ? (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">{message}</p>
              </div>
            ) : (
              <div className={`flex ${isInline ? 'flex-row gap-3' : 'flex-col gap-4'}`}>
                <div className="flex-1">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-base placeholder-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder={blok.placeholder_text || 'Enter your email'}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
                >
                  {status === 'loading' 
                    ? 'Subscribing...' 
                    : (blok.button_text || 'Subscribe')
                  }
                </button>
              </div>
            )}

            {status === 'error' && (
              <p className="mt-2 text-sm text-red-600">{message}</p>
            )}
          </form>

          <p className="mt-4 text-sm text-gray-500">
            We respect your privacy and never share your email address.
          </p>
        </div>
      </div>
    </section>
  );
}