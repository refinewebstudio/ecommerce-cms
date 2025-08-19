// lib/growthbook.ts - GrowthBook A/B testing integration
import { GrowthBook } from '@growthbook/growthbook';

// Global GrowthBook instance
let growthbook: GrowthBook | null = null;

// Initialize GrowthBook
export const initializeGrowthBook = async () => {
  if (typeof window === 'undefined') return null;
  
  const apiHost = process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST;
  const clientKey = process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY;
  
  if (!apiHost || !clientKey) {
    console.warn('GrowthBook environment variables not set');
    return null;
  }

  growthbook = new GrowthBook({
    apiHost,
    clientKey,
    enableDevMode: process.env.NODE_ENV === 'development',
    
    // User attributes for targeting
    attributes: {
      id: getUserId(),
      deviceType: getDeviceType(),
      country: await getUserCountry(),
      isReturning: isReturningUser(),
      sessionCount: getSessionCount(),
      // Add more targeting attributes as needed
    },

    // Track experiment impressions
    trackingCallback: (experiment, result) => {
      // Track in your analytics
      if (window.gtag) {
        window.gtag('event', 'experiment_viewed', {
          experiment_id: experiment.key,
          variant_id: result.variationId,
          experiment_name: experiment.name || experiment.key,
        });
      }

      // Track in Microsoft Clarity
      if (window.clarity) {
        window.clarity('set', `experiment_${experiment.key}`, result.variationId);
      }

      console.log('Experiment impression:', {
        experiment: experiment.key,
        variant: result.variationId,
        inExperiment: result.inExperiment
      });
    }
  });

  // Load feature definitions
  await growthbook.loadFeatures();
  
  return growthbook;
};

// Get the GrowthBook instance
export const getGrowthBook = async (): Promise<GrowthBook | null> => {
  if (!growthbook) {
    growthbook = await initializeGrowthBook();
  }
  return growthbook;
};

// Get feature flag value
export const getFeatureFlag = async (flagKey: string, fallback: boolean = false): Promise<boolean> => {
  try {
    const gb = await getGrowthBook();
    if (!gb) return fallback;
    
    return gb.getFeatureValue(flagKey, fallback);
  } catch (error) {
    console.error('Error getting feature flag:', error);
    return fallback;
  }
};

// Get feature flag with multiple variants
export const getFeatureVariant = async (flagKey: string, fallback: string = 'control'): Promise<string> => {
  try {
    const gb = await getGrowthBook();
    if (!gb) return fallback;
    
    return gb.getFeatureValue(flagKey, fallback);
  } catch (error) {
    console.error('Error getting feature variant:', error);
    return fallback;
  }
};

// Run an A/B test experiment
export const runExperiment = async (experimentKey: string, variants: Record<string, any>) => {
  try {
    const gb = await getGrowthBook();
    if (!gb) return variants.control || Object.values(variants)[0];
    
    const result = gb.run({
      key: experimentKey,
      variations: Object.values(variants)
    });
    
    return result.value;
  } catch (error) {
    console.error('Error running experiment:', error);
    return variants.control || Object.values(variants)[0];
  }
};

// Helper functions for user attributes
const getUserId = (): string => {
  if (typeof window === 'undefined') return 'anonymous';
  
  // Try to get user ID from your auth system
  // For anonymous users, use a persistent ID
  let userId = localStorage.getItem('anonymous_user_id');
  if (!userId) {
    userId = 'anon_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('anonymous_user_id', userId);
  }
  return userId;
};

const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width <= 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

const getUserCountry = async (): Promise<string> => {
  if (typeof window === 'undefined') return 'GB'; // Default to UK
  
  try {
    // Try to get country from geolocation API or user's locale
    const locale = navigator.language || 'en-GB';
    const country = locale.split('-')[1] || 'GB';
    return country;
  } catch (error) {
    return 'GB';
  }
};

const isReturningUser = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const hasVisited = localStorage.getItem('has_visited');
  if (!hasVisited) {
    localStorage.setItem('has_visited', 'true');
    return false;
  }
  return true;
};

const getSessionCount = (): number => {
  if (typeof window === 'undefined') return 1;
  
  const sessionCount = parseInt(localStorage.getItem('session_count') || '0');
  const newCount = sessionCount + 1;
  localStorage.setItem('session_count', newCount.toString());
  return newCount;
};

// Page-specific experiments
export const pageExperiments = {
  // Homepage hero variants
  heroSection: async (slug: string) => {
    if (slug !== '') return 'control'; // Only for homepage
    
    return await getFeatureVariant('homepage_hero_variant', 'control');
  },

  // Product page layout variants
  productLayout: async (isProductPage: boolean) => {
    if (!isProductPage) return 'control';
    
    return await getFeatureVariant('product_page_layout', 'control');
  },

  // Checkout flow variants
  checkoutFlow: async (isCheckout: boolean) => {
    if (!isCheckout) return 'control';
    
    return await getFeatureVariant('checkout_flow_variant', 'control');
  },

  // Landing page variants
  landingPageVariant: async (slug: string) => {
    if (!slug.startsWith('landing/')) return 'control';
    
    const experimentKey = `landing_page_variant_${slug.replace('landing/', '')}`;
    return await getFeatureVariant(experimentKey, 'control');
  }
};

// CRO-specific experiments
export const croExperiments = {
  // Button color tests
  ctaButtonColor: async () => {
    return await getFeatureVariant('cta_button_color', 'blue');
  },

  // Navigation layout
  navigationLayout: async () => {
    return await getFeatureVariant('navigation_layout', 'horizontal');
  },

  // Product grid layout
  productGridColumns: async () => {
    return await getFeatureVariant('product_grid_columns', '3');
  },

  // Newsletter popup timing
  newsletterPopupDelay: async () => {
    const variant = await getFeatureVariant('newsletter_popup_timing', 'medium');
    const delays = {
      'fast': 5000,
      'medium': 15000,
      'slow': 30000,
      'exit': -1 // Exit intent only
    };
    return delays[variant as keyof typeof delays] || delays.medium;
  }
};

// Track experiment conversions
export const trackExperimentConversion = async (
  experimentKey: string, 
  conversionType: string,
  value?: number
) => {
  try {
    const gb = await getGrowthBook();
    if (!gb) return;

    // Track in GrowthBook
    gb.setAttributes({
      ...gb.getAttributes(),
      [`${experimentKey}_converted`]: true,
      [`${experimentKey}_conversion_type`]: conversionType,
      [`${experimentKey}_conversion_value`]: value || 0
    });

    // Track in analytics
    if (window.gtag) {
      window.gtag('event', 'experiment_conversion', {
        experiment_id: experimentKey,
        conversion_type: conversionType,
        value: value
      });
    }

    console.log('Experiment conversion tracked:', {
      experiment: experimentKey,
      type: conversionType,
      value
    });
  } catch (error) {
    console.error('Error tracking experiment conversion:', error);
  }
};

// Update user attributes (call when user data changes)
export const updateUserAttributes = async (attributes: Record<string, any>) => {
  try {
    const gb = await getGrowthBook();
    if (!gb) return;

    gb.setAttributes({
      ...gb.getAttributes(),
      ...attributes
    });
  } catch (error) {
    console.error('Error updating user attributes:', error);
  }
};