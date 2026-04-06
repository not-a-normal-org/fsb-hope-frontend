'use client';

import { useEffect, useRef, useState } from 'react';

interface CalEmbedProps {
  calLink: string;
}

export default function CalEmbed({ calLink }: CalEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const initialised = useRef(false);

  useEffect(() => {
    // Prevent double-init on strict-mode double-invoke or re-renders
    if (initialised.current) return;
    initialised.current = true;

    // If the Cal embed script is already on the page (e.g. route re-visit),
    // initialise directly without appending a second script tag.
    if (typeof (window as any).Cal === 'function') {
      (window as any).Cal('init', { origin: 'https://app.cal.com' });
      (window as any).Cal('inline', {
        elementOrSelector: '#cal-embed',
        calLink,
      });
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;

    script.onload = () => {
      (window as any).Cal('init', { origin: 'https://app.cal.com' });
      (window as any).Cal('inline', {
        elementOrSelector: '#cal-embed',
        calLink,
      });
      setLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      // Leave the script tag in place — removing it would break other
      // CalEmbed instances that might still be mounted.
    };
  }, [calLink]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden">
      {/* Loading skeleton — hidden once Cal fires onload */}
      {!loaded && (
        <div
          className="absolute inset-0 z-10 animate-pulse rounded-xl bg-[#13182A]"
          style={{ minHeight: 600 }}
          aria-hidden="true"
        >
          {/* Skeleton shimmer bars */}
          <div className="p-8 space-y-4">
            <div className="h-6 w-1/3 rounded-lg bg-[#1E2538]" />
            <div className="h-4 w-1/2 rounded-lg bg-[#1E2538]" />
            <div className="mt-8 grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-8 rounded-md bg-[#1E2538]" />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="h-10 rounded-md bg-[#1E2538]/60" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cal.com mounts into this div */}
      <div
        id="cal-embed"
        style={{ minHeight: 600, width: '100%' }}
      />
    </div>
  );
}
