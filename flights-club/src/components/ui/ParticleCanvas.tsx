'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  phase: number; // per-particle phase offset for x sway
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = () => window.innerWidth < 768;

    // ── Initialise / reinitialise particles ──────────────────────────────────
    function initParticles(w: number, h: number) {
      const count = isMobile() ? 25 : 50;
      particlesRef.current = Array.from({ length: count }, (_, i) => ({
        x:       Math.random() * w,
        y:       Math.random() * h,   // spread across full height on init
        size:    1 + Math.random() * 1.5,
        speed:   0.2 + Math.random() * 0.4,
        opacity: 0.2 + Math.random() * 0.2,
        phase:   i,
      }));
    }

    // ── Resize ───────────────────────────────────────────────────────────────
    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    }

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    // ── Draw loop ────────────────────────────────────────────────────────────
    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      const mobile = isMobile();
      const opacityScale = mobile ? 0.5 : 1;

      ctx.clearRect(0, 0, w, h);

      const frame = frameRef.current;

      for (const p of particlesRef.current) {
        // Drift upward
        p.y -= p.speed;

        // Gentle sinusoidal x sway
        p.x += Math.sin(frame * 0.01 + p.phase) * 0.15;

        // Wrap: reset to bottom if above canvas; clamp x inside bounds
        if (p.y < -5) {
          p.y = h + 5;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 150, 58, ${(p.opacity * opacityScale).toFixed(3)})`;
        ctx.fill();
      }

      frameRef.current += 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'none',
        display:       'block',
      }}
    />
  );
}
