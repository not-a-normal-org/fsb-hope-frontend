import type { Config } from "tailwindcss";

/**
 * Colors live in globals.css via `@theme inline` (runtime-swappable --sm-*
 * tokens), not here — this file only carries what the CSS-first theme does not:
 * font families (wired to next/font CSS vars) and the display type scale from
 * docs/plans/01-brand-design-system.md §3.
 */
const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-zilla)", "Zilla Slab", "serif"],
        body: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Type scale — spec §3 (base 16px). Fluid within each doc range.
        hero: ["clamp(1.875rem, 4.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        section: ["clamp(1.5rem, 3vw, 2.125rem)", { lineHeight: "1.2", letterSpacing: "-0.005em" }],
        card: ["1.375rem", { lineHeight: "1.25" }],
        eyebrow: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.14em" }],
      },
    },
  },
  plugins: [],
};

export default config;
