import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Background Colors */
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-card": "var(--bg-card)",

        /* Accent Colors */
        "accent-orange": "var(--accent-orange)",
        "accent-orange-light": "var(--accent-orange-light)",
        "accent-blue": "var(--accent-blue)",
        "accent-gold": "var(--accent-gold)",

        /* Text Colors */
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",

        /* Border Colors */
        "border-subtle": "var(--border-subtle)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(232, 150, 58, 0.3)",
        orange: "0 20px 60px rgba(232, 150, 58, 0.12)",
      },
      fontFamily: {
        display: ["Canela", "Playfair Display", "serif"],
        body: ["Inter", "Outfit", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      fontSize: {
        "hero-xl": "clamp(48px, 8vw, 120px)",
        "section-xl": "clamp(32px, 6vw, 80px)",
        "section-lg": "clamp(24px, 4vw, 48px)",
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};

export default config;
