'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run performance monitoring in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Monitor Core Web Vitals (commented out until web-vitals is properly configured)
    // import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    //   getCLS(console.log);
    //   getFID(console.log);
    //   getFCP(console.log);
    //   getLCP(console.log);
    //   getTTFB(console.log);
    // });

    // Monitor page load performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        
        console.log(`Page load time: ${loadTime}ms`);
        
        // Report to analytics service
        if (typeof gtag !== 'undefined') {
          gtag('event', 'page_load_time', {
            event_category: 'Performance',
            value: Math.round(loadTime),
            custom_parameter: 'posts_page'
          });
        }
      });
    }
  }, []);

  return null; // This component doesn't render anything
}

declare global {
  function gtag(...args: any[]): void;
}