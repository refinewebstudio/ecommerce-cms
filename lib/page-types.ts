// lib/page-types.ts - Page type classification for analytics and styling

export type PageType = 'legal' | 'marketing' | 'content' | 'landing' | 'ecommerce';

interface PageTypeConfig {
  type: PageType;
  analyticsCategory: string;
  defaultCacheTime: number;
  requiresAuth: boolean;
  seoImportance: 'high' | 'medium' | 'low';
}

// Page type configurations
const PAGE_TYPE_CONFIGS: Record<PageType, PageTypeConfig> = {
  legal: {
    type: 'legal',
    analyticsCategory: 'Legal Pages',
    defaultCacheTime: 86400, // 24 hours
    requiresAuth: false,
    seoImportance: 'medium'
  },
  marketing: {
    type: 'marketing',
    analyticsCategory: 'Marketing Pages',
    defaultCacheTime: 3600, // 1 hour
    requiresAuth: false,
    seoImportance: 'high'
  },
  content: {
    type: 'content',
    analyticsCategory: 'Content Pages',
    defaultCacheTime: 3600, // 1 hour
    requiresAuth: false,
    seoImportance: 'medium'
  },
  landing: {
    type: 'landing',
    analyticsCategory: 'Landing Pages',
    defaultCacheTime: 1800, // 30 minutes
    requiresAuth: false,
    seoImportance: 'high'
  },
  ecommerce: {
    type: 'ecommerce',
    analyticsCategory: 'E-commerce Pages',
    defaultCacheTime: 900, // 15 minutes
    requiresAuth: false,
    seoImportance: 'high'
  }
};

// Legal pages that are commonly required
const LEGAL_PAGES = [
  'privacy-policy',
  'privacy',
  'terms-of-service',
  'terms',
  'terms-and-conditions',
  'cookie-policy',
  'cookies',
  'shipping-policy',
  'shipping',
  'returns-policy',
  'returns',
  'refund-policy',
  'refunds',
  'shipping-returns',
  'accessibility-statement',
  'accessibility',
  'gdpr',
  'data-protection'
];

// Marketing pages for brand building
const MARKETING_PAGES = [
  'about',
  'about-us',
  'our-story',
  'story',
  'team',
  'mission',
  'values',
  'contact',
  'contact-us',
  'why-choose-us',
  'why-us',
  'our-process',
  'process',
  'testimonials',
  'reviews',
  'careers',
  'jobs',
  'press',
  'media'
];

// Content pages for SEO and education
const CONTENT_PAGES = [
  'blog',
  'news',
  'guides',
  'help',
  'faq',
  'support',
  'size-guide',
  'sizing',
  'care-instructions',
  'how-to',
  'tutorials',
  'resources'
];

// Determine page type based on slug
export const getPageType = (slug: string): PageType => {
  const normalizedSlug = slug.toLowerCase().replace(/^\/+|\/+$/g, '');
  
  // Check for landing pages first (most specific)
  if (normalizedSlug.startsWith('landing/') || 
      normalizedSlug.startsWith('campaign/') || 
      normalizedSlug.includes('sale') ||
      normalizedSlug.includes('offer') ||
      normalizedSlug.includes('promo')) {
    return 'landing';
  }

  // Check for legal pages
  if (LEGAL_PAGES.some(legal => normalizedSlug === legal || normalizedSlug.endsWith(`/${legal}`))) {
    return 'legal';
  }

  // Check for marketing pages
  if (MARKETING_PAGES.some(marketing => normalizedSlug === marketing || normalizedSlug.endsWith(`/${marketing}`))) {
    return 'marketing';
  }

  // Check for content pages
  if (CONTENT_PAGES.some(content => normalizedSlug.startsWith(content) || normalizedSlug === content)) {
    return 'content';
  }

  // Default to content for unmatched pages
  return 'content';
};

// Get page type configuration
export const getPageTypeConfig = (pageType: PageType): PageTypeConfig => {
  return PAGE_TYPE_CONFIGS[pageType];
};

// Get page type from slug with config
export const getPageTypeWithConfig = (slug: string) => {
  const pageType = getPageType(slug);
  const config = getPageTypeConfig(pageType);
  
  return {
    type: pageType,
    config,
    slug: slug
  };
};

// Generate CSS classes based on page type
export const getPageTypeClasses = (pageType: PageType): string => {
  const baseClasses = `page-${pageType}`;
  const importanceClass = `seo-${PAGE_TYPE_CONFIGS[pageType].seoImportance}`;
  
  return `${baseClasses} ${importanceClass}`;
};

// Check if page type requires special handling
export const pageTypeRequires = {
  // Pages that should have schema markup
  schemaMarkup: (pageType: PageType): boolean => {
    return ['marketing', 'landing', 'ecommerce'].includes(pageType);
  },

  // Pages that should have social sharing
  socialSharing: (pageType: PageType): boolean => {
    return ['marketing', 'content', 'landing'].includes(pageType);
  },

  // Pages that should have breadcrumbs
  breadcrumbs: (pageType: PageType): boolean => {
    return ['content', 'legal', 'ecommerce'].includes(pageType);
  },

  // Pages that should have related content
  relatedContent: (pageType: PageType): boolean => {
    return ['content', 'marketing'].includes(pageType);
  },

  // Pages that should have exit intent popups
  exitIntent: (pageType: PageType): boolean => {
    return ['landing', 'marketing'].includes(pageType);
  }
};

// Analytics event names by page type
export const getAnalyticsEvents = (pageType: PageType) => {
  return {
    pageView: `${pageType}_page_view`,
    engagement: `${pageType}_engagement`,
    conversion: `${pageType}_conversion`,
    bounce: `${pageType}_bounce`
  };
};