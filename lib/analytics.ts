// lib/analytics.ts - Analytics integration for GA4 and Microsoft Clarity
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
  }
}

interface PageViewData {
  page_title: string;
  page_location: string;
  content_source: 'shopify' | 'storyblok';
  page_type: 'legal' | 'marketing' | 'content' | 'landing';
  is_preview?: boolean;
  ab_variant?: string;
}

interface ConversionEvent {
  event_name: string;
  currency?: string;
  value?: number;
  items?: any[];
  content_source?: string;
  ab_variant?: string;
}

// Check if user has given consent
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('cookie-consent') === 'accepted';
};

// Initialize Google Analytics 4
export const initializeGA4 = () => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined') return;

  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  if (!GA_MEASUREMENT_ID) return;

  // Load GA4 script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = function() {
    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Initialize Microsoft Clarity
export const initializeClarity = () => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined') return;

  const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (!CLARITY_PROJECT_ID) return;
  (function(c,l,a,r,i,t,y){
/* @ts-ignore */
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
/* @ts-ignore */
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
/* @ts-ignore */
    y=l.getElementsByTagName(r)[0];y.parentNode!.insertBefore(t,y);
  })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
};

// Initialize all analytics
export const initializeAnalytics = () => {
  if (!hasAnalyticsConsent()) return;
  
  initializeGA4();
  initializeClarity();
  
  console.log('Analytics initialized');
};

// Track page views
export const trackPageView = (data: PageViewData) => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined') return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: data.page_title,
      page_location: data.page_location,
      custom_map: {
        'content_source': data.content_source,
        'page_type': data.page_type,
        'is_preview': data.is_preview || false,
        'ab_variant': data.ab_variant || 'control'
      }
    });
  }

  // Microsoft Clarity custom tags
  if (window.clarity) {
    window.clarity('set', 'content_source', data.content_source);
    window.clarity('set', 'page_type', data.page_type);
    if (data.ab_variant) {
      window.clarity('set', 'ab_variant', data.ab_variant);
    }
  }
};

// Track conversion events
export const trackConversion = (event: ConversionEvent) => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined') return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', event.event_name, {
      currency: event.currency,
      value: event.value,
      items: event.items,
      custom_map: {
        'content_source': event.content_source,
        'ab_variant': event.ab_variant || 'control'
      }
    });
  }

  // Microsoft Clarity
  if (window.clarity) {
    window.clarity('event', event.event_name);
    if (event.content_source) {
      window.clarity('set', 'last_conversion_source', event.content_source);
    }
  }
};

// Track eCommerce events
export const trackEcommerce = {
  addToCart: (item: any, source?: string) => {
    trackConversion({
      event_name: 'add_to_cart',
      currency: 'GBP',
      value: parseFloat(item.price),
      items: [item],
      content_source: source
    });
  },

  purchase: (transactionData: any, source?: string) => {
    trackConversion({
      event_name: 'purchase',
      currency: 'GBP',
      value: transactionData.total,
      items: transactionData.items,
      content_source: source
    });
  },

  beginCheckout: (items: any[], source?: string) => {
    const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
    trackConversion({
      event_name: 'begin_checkout',
      currency: 'GBP',
      value: total,
      items: items,
      content_source: source
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName: string, source?: string) => {
  trackConversion({
    event_name: 'form_submit',
    content_source: source
  });

  // Custom event for Clarity
  if (window.clarity) {
    window.clarity('event', `form_${formName}`);
  }
};

// Track CRO experiments
export const trackExperiment = (experimentName: string, variant: string) => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined') return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', 'experiment_impression', {
      experiment_name: experimentName,
      variant: variant
    });
  }

  // Microsoft Clarity
  if (window.clarity) {
    window.clarity('set', `experiment_${experimentName}`, variant);
  }
};