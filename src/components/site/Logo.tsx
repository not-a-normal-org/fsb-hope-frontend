import Image from 'next/image';

/**
 * Saver Miles logo — the brand lockup (wordmark + green arc + plane), shipped as
 * the supplied artwork (public/savermiles-logo.png).
 *
 * It is an image, not drawn in code: the wordmark is a custom slab with a dark
 * outline that no webfont reproduces, and redrawing it drifts off-brand. The
 * asset is trimmed to the artwork's bounds and has a real alpha channel, so it
 * sits cleanly on Dark, Light, and any surface in between — the outline is what
 * keeps the cream lettering legible on light backgrounds.
 *
 * Sizing stays font-driven so every caller's existing `text-*` class keeps
 * working: the height is set in `em`, so `<Logo className="text-lg" />` scales
 * with that type size exactly as the old drawn lockup did. 1.5em height matches
 * the previous wordmark's width, so nav/footer layout is unchanged.
 *
 * Social/share exports are generated from this same asset: og-image.png /
 * twitter-image.png (1200x630 link previews) and public/img/ (1000x1000 avatar,
 * 512x512 nav icon).
 */
const LOGO_W = 640;
const LOGO_H = 198;

type LogoProps = {
  className?: string;
  /** Accessible name; pass "" only when a visible label sits beside it. */
  label?: string;
};

export default function Logo({ className = '', label = 'Saver Miles' }: LogoProps) {
  return (
    <Image
      src="/savermiles-logo.png"
      alt={label}
      width={LOGO_W}
      height={LOGO_H}
      priority
      draggable={false}
      className={className}
      style={{ height: '1.5em', width: 'auto' }}
    />
  );
}
