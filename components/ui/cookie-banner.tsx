// components/ui/cookie-banner.tsx - GDPR compliant cookie banner (FIXED)
'use client';

import { useState, useEffect } from 'react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

// Simplified analytics initialization for now
const initializeAnalytics = () => {
  if (typeof window === 'undefined') return;
  
  // Initialize Google Analytics 4
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  if (GA_MEASUREMENT_ID) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // @ts-ignore
    window.dataLayer = window.dataLayer || [];
    // @ts-ignore
    window.gtag = function() { window.dataLayer.push(arguments); };
    // @ts-ignore
    window.gtag('js', new Date());
    // @ts-ignore
    window.gtag('config', GA_MEASUREMENT_ID);
  }

  // Initialize Microsoft Clarity
  const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (CLARITY_PROJECT_ID) {
    
    // @ts-ignore
    (function(c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
      c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
  }
  
  console.log('Analytics initialized');
};

export  function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    const consentDate = localStorage.getItem('cookie-consent-date');
    
    // Show banner if no consent or consent is older than 12 months
    const shouldShow = !consent || 
      (consentDate && new Date().getTime() - parseInt(consentDate) > 365 * 24 * 60 * 60 * 1000);
    
    if (shouldShow) {
      // Delay showing banner to avoid layout shift
      setTimeout(() => setShowBanner(true), 1000);
    } else if (consent === 'accepted') {
      // Initialize analytics if previously accepted
      initializeAnalytics();
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    saveConsent('accepted', allAccepted);
    initializeAnalytics();
    setShowBanner(false);
  };

  const acceptSelected = () => {
    saveConsent('partial', preferences);
    
    if (preferences.analytics) {
      initializeAnalytics();
    }
    
    setShowBanner(false);
  };

  const rejectAll = () => {
    const necessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    saveConsent('rejected', necessary);
    setShowBanner(false);
  };

  const saveConsent = (status: string, prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', status);
    localStorage.setItem('cookie-consent-date', new Date().getTime().toString());
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
  };

  const updatePreference = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'necessary') return; // Can't disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 shadow-lg z-50 max-h-screen overflow-y-auto">
        <div className="container mx-auto p-6 max-w-4xl">
          {!showDetails ? (
            // Simple Banner View
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  We use cookies to enhance your experience
                </h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  We use cookies and similar technologies to provide the best experience on our website. 
                  Some are necessary for the site to function, while others help us improve your experience 
                  and show you relevant content.{' '}
                  <button 
                    onClick={() => setShowDetails(true)}
                    className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline"
                  >
                    Learn more
                  </button>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            // Detailed Preferences View
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Cookie Preferences</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-neutral-400 mb-6">
                Choose which cookies you'd like to accept. You can change these settings at any time.
              </p>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-neutral-700 rounded-lg bg-gray-50 dark:bg-neutral-900">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Necessary Cookies</h4>
                      <span className="text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 px-2 py-1 rounded">Required</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Essential for the website to function properly. These cookies enable basic features 
                      like page navigation and access to secure areas.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded opacity-50"
                    />
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-neutral-700 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Help us understand how visitors interact with our website by collecting and 
                      reporting information anonymously. Includes Google Analytics and Microsoft Clarity.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => updatePreference('analytics', e.target.checked)}
                      className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-neutral-700 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Used to track visitors across websites to display relevant advertisements 
                      and measure campaign effectiveness.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => updatePreference('marketing', e.target.checked)}
                      className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Preference Cookies */}
                <div className="flex items-start justify-between p-4 border border-gray-200 dark:border-neutral-700 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Preference Cookies</h4>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Remember your preferences and settings to provide a more personalized experience.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.preferences}
                      onChange={(e) => updatePreference('preferences', e.target.checked)}
                      className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Policy Link */}
              <div className="text-center mb-6">
                <a 
                  href="/privacy-policy" 
                  className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read our Privacy Policy
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={rejectAll}
                  className="px-6 py-2 text-sm border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={acceptSelected}
                  className="px-6 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  Save Preferences
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}