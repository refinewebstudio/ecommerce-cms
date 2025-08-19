// app/layout.tsx - Enhanced layout building on your existing structure
import { CartProvider } from 'components/cart/cart-context';
import { Navbar } from 'components/layout/navbar';
import { WelcomeToast } from 'components/welcome-toast';
import { GeistSans } from 'geist/font/sans';
import { getCart } from 'lib/shopify';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';
import { baseUrl } from 'lib/utils';



// Enhanced CRO components
import { CookieBanner } from 'components/ui/cookie-banner';
import { ErrorBoundary } from 'components/error-boundary';

// Import Storyblok initialization
import '@/lib/storyblok';

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`
  },
  robots: {
    follow: true,
    index: true
  },
  // Enhanced metadata for better SEO
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();
  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        {/* Enhanced head tags for performance and analytics */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://a.storyblok.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        
        {/* Structured data for organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: SITE_NAME,
              url: baseUrl,
              logo: `${baseUrl}/logo.png`,
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+44-xxx-xxx-xxxx',
                contactType: 'Customer Service',
                areaServed: 'GB',
                availableLanguage: 'English'
              }
            })
          }}
        />
      </head>
      
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <ErrorBoundary>
          {/* Accessibility skip link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-teal-600 text-white px-4 py-2 rounded-md z-50"
          >
            Skip to main content
          </a>

          <CartProvider cartPromise={cart}>
            <Navbar />
            <main id="main-content">
              {children}
              <Toaster closeButton />
              <WelcomeToast />
            </main>
          </CartProvider>

          {/* Cookie Banner - positioned last for proper z-index */}
          <CookieBanner />

          {/* Performance monitoring for production */}
          {process.env.NODE_ENV === 'production' && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  // Monitor Core Web Vitals
                  if ('PerformanceObserver' in window) {
                    new PerformanceObserver((list) => {
                      for (const entry of list.getEntries()) {
                        if (window.gtag) {
                          if (entry.entryType === 'largest-contentful-paint') {
                            window.gtag('event', 'lcp', { value: Math.round(entry.startTime) });
                          }
                          if (entry.entryType === 'first-input') {
                            window.gtag('event', 'fid', { value: Math.round(entry.processingStart - entry.startTime) });
                          }
                          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                            window.gtag('event', 'cls', { value: entry.value });
                          }
                        }
                      }
                    }).observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
                  }
                `
              }}
            />
          )}
        </ErrorBoundary>
      </body>
    </html>
  );
}
