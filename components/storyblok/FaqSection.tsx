
// components/storyblok/FaqSection.tsx
import { storyblokEditable } from '@storyblok/react/rsc';
import { renderRichText } from '@storyblok/richtext';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FaqSectionProps {
  blok: {
    _uid: string;
    component: string;
    title?: string;
    description?: any; // Rich text
    faqs?: Array<{
      _uid: string;
      question: string;
      answer: any; // Rich text
    }>;
    background_color?: string;
  };
}

export default function FaqSection({ blok }: FaqSectionProps) {
  const backgroundClass = blok.background_color 
    ? `bg-${blok.background_color}` 
    : 'bg-white';

  return (
    <section {...storyblokEditable(blok)} className={`py-16 ${backgroundClass}`}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
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
        </div>

        {/* FAQs */}
        {blok.faqs && blok.faqs.length > 0 && (
          <div className="space-y-4">
            {blok.faqs.map((faq) => (
              <Disclosure key={faq._uid} as="div" className="border-b border-gray-200">
                {({ open }) => (
                  <>
                    <DisclosureButton className="flex w-full items-center justify-between py-6 text-left">
                      <span className="text-lg font-medium text-gray-900">
                        {faq.question}
                      </span>
                      <ChevronDownIcon
                        className={`${
                          open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-gray-500 transition-transform duration-200`}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="pb-6">
                      <div 
                        className="prose text-gray-600"
                        dangerouslySetInnerHTML={{ 
                          __html: renderRichText(faq.answer) 
                        }}
                      />
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
