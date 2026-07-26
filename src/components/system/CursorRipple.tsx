'use client';

import { useEffect, useRef, useState } from 'react';

type Ripple = { id: number; x: number; y: number };

/**
 * Ambient background ripples that follow cursor movement — soft accent rings
 * that expand and fade as the pointer moves. Sits behind the page content
 * (negative z), pointer-events-none, so it never interferes. Spawns are
 * throttled by distance + time so the trail stays light. Fine-pointer only and
 * disabled under prefers-reduced-motion (the native cursor / no motion instead).
 */
export default function CursorRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);
  const last = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    const onMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - last.current.x, e.clientY - last.current.y);
      if (dist < 48 || e.timeStamp - last.current.t < 90) return;
      last.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
      const id = idRef.current++;
      // Keep only the most recent few so the DOM never piles up.
      setRipples((rs) => [...rs.slice(-14), { id, x: e.clientX, y: e.clientY }]);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="sm-ripple"
          style={{ left: r.x, top: r.y }}
          onAnimationEnd={() => setRipples((rs) => rs.filter((x) => x.id !== r.id))}
        />
      ))}
    </div>
  );
}
