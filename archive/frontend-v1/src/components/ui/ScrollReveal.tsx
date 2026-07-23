'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay * 1000);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0 }
    );

    // If already in viewport on mount, show immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => setVisible(true), delay * 1000);
    } else {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [delay]);

  const transforms = {
    up:    visible ? 'translateY(0)' : 'translateY(24px)',
    left:  visible ? 'translateX(0)' : 'translateX(-24px)',
    right: visible ? 'translateX(0)' : 'translateX(24px)',
    none:  'none',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: transforms[direction],
        transition: 'opacity 0.55s ease, transform 0.55s ease',
        transitionDelay: '0ms',
      }}
    >
      {children}
    </div>
  );
}
