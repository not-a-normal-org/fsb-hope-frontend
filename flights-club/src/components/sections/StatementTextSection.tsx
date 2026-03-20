'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { text: 'YOU\'RE SPENDING MILLIONS', color: '#ffffff' },
  { text: 'FLYING ECONOMY.', color: '#ffffff' },
  { text: 'THAT ENDS HERE.', color: '#E8963A' },
];

export default function StatementTextSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!containerRef.current || !stickyRef.current) return;

      // Create a scroll trigger that tracks progress through the 300vh section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          markers: false,
        },
      });

      // Animate each line to reveal at different scroll progress points
      // 0-33% of scroll: Line 1 fades in
      tl.fromTo(
        linesRef.current[0],
        { opacity: 0.15 },
        { opacity: 1, duration: 0.5 },
        0
      );

      // 33-66% of scroll: Line 2 fades in
      tl.fromTo(
        linesRef.current[1],
        { opacity: 0.15 },
        { opacity: 1, duration: 0.5 },
        0.25
      );

      // 66-100% of scroll: Line 3 fades in
      tl.fromTo(
        linesRef.current[2],
        { opacity: 0.15 },
        { opacity: 1, duration: 0.5 },
        0.5
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-bg-primary"
      style={{ height: '300vh' }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 w-full flex items-center justify-center overflow-hidden"
        style={{ height: '100vh' }}
      >
        <div className="max-w-7xl w-full px-6 sm:px-12 lg:px-16">
          {lines.map((line, index) => (
            <div key={index} className="mb-6 md:mb-12">
              <div
                ref={(el) => {
                  if (el) linesRef.current[index] = el;
                }}
                className="opacity-20"
                style={{
                  fontSize: 'clamp(48px, 8vw, 120px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  color: line.color,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {line.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
