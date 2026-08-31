import Image from 'next/image';

/**
 * Saver Miles logo — the brand lockup (wordmark + green arc + plane), shipped as
 * supplied artwork, with a light/dark variant swapped by theme.
 *
 * Two images render; CSS shows the one for the active theme via the `[data-theme]`
 * attribute `ThemeScript` sets pre-paint, so the correct lockup is present on first
 * paint with no flash (see the `.sm-logo-*` rules in globals.css). Dark + Mono use
 * the cream, dark-outlined lockup (`savermiles-logo.png`); Light uses the
 * dark-lettering lockup (`savermiles-logo-light.png`). Both are trimmed to the
 * artwork with a real alpha channel, so they sit cleanly on any surface.
 *
 * Sizing stays font-driven: height is set in `em`, so `<Logo className="text-lg" />`
 * scales with that type size. The hidden variant is `display:none`, so it is not
 * announced by screen readers and (being lazy) is not downloaded until shown.
 */
const DARK = { src: '/savermiles-logo.png', w: 640, h: 198 };
const LIGHT = { src: '/savermiles-logo-light.png', w: 1353, h: 451 };
const HEIGHT = '1.2em';

type LogoProps = {
  className?: string;
  /** Accessible name; pass "" only when a visible label sits beside it. */
  label?: string;
};

export default function Logo({ className = '', label = 'Saver Miles' }: LogoProps) {
  return (
    <>
      <Image
        src={DARK.src}
        alt={label}
        width={DARK.w}
        height={DARK.h}
        priority
        draggable={false}
        className={`sm-logo-dark ${className}`}
        style={{ height: HEIGHT, width: 'auto' }}
      />
      <Image
        src={LIGHT.src}
        alt={label}
        width={LIGHT.w}
        height={LIGHT.h}
        draggable={false}
        className={`sm-logo-light ${className}`}
        style={{ height: HEIGHT, width: 'auto' }}
      />
    </>
  );
}
