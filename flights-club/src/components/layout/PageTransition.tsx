'use client';

import { ReactNode, useEffect } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  useEffect(() => {
    // BFCache restoration (hard back from external page)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener('pageshow', handlePageShow);

    // Navigation API — available in Chromium ≥ 102 (Brave, Chrome, Edge).
    // Fires before Next.js's router, letting us intercept back/forward traversal
    // and replace it with a full page reload so Framer Motion always starts fresh.
    const nav = (window as any).navigation;
    if (nav) {
      const handleNavigate = (e: any) => {
        if (e.navigationType === 'traverse' && e.canIntercept) {
          e.intercept({
            handler: async () => {
              window.location.assign(e.destination.url);
            },
          });
        }
      };
      nav.addEventListener('navigate', handleNavigate);
      return () => {
        window.removeEventListener('pageshow', handlePageShow);
        nav.removeEventListener('navigate', handleNavigate);
      };
    }

    // Fallback for browsers without Navigation API
    const handlePopState = () => {
      setTimeout(() => window.location.reload(), 50);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return <>{children}</>;
}
