
// components/storyblok/NewsletterForm.tsx (Client Component)
'use client';

import { useState } from 'react';

interface NewsletterFormProps {
  placeholderText: string;
  buttonText: string;
  successMessage: string;
  layout: 'inline' | 'stacked';
}

export default function NewsletterForm({
  placeholderText,
  buttonText,
  successMessage,
  layout
}: NewsletterFormProps) {
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
        setMessage(successMessage);
        setEmail('');
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  const isInline = layout === 'inline';

  return (
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
              placeholder={placeholderText}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : buttonText}
          </button>
        </div>
      )}

      {status === 'error' && (
        <p className="mt-2 text-sm text-red-600">{message}</p>
      )}
    </form>
  );
}