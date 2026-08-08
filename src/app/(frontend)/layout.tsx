import type { Metadata } from "next";
import { Zilla_Slab, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/site/MotionProvider";
import ThemeScript from "@/components/system/ThemeScript";
import CustomCursor from "@/components/system/CustomCursor";
import CursorRipple from "@/components/system/CursorRipple";
import ReferralCapture from "@/components/system/ReferralCapture";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

/* ========== FONTS (docs/plans/01-brand-design-system.md §3) ========== */

// Display — headlines, section titles. Carries the shine-sweep on hero text.
const zilla = Zilla_Slab({
  variable: "--font-zilla",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Zilla Slab", "Georgia", "serif"],
});

// Body / UI — copy, buttons, nav, labels.
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

// Utility / data — eyebrows, stat numbers, point counts, dates. Monospace is
// intentional: it signals "a precise number," reinforcing the brand's positioning.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

/* ========== SEO METADATA ========== */
// Minimal on purpose: the site is behind the construction wall and set to
// noindex. Richer metadata belongs with the pages it describes.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  robots: "noindex, nofollow",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

/* ========== ROOT LAYOUT ========== */
// data-theme="dark" is the SSR default; ThemeScript corrects it pre-paint for
// visitors who chose light/mono. suppressHydrationWarning covers that one
// attribute React would otherwise flag as a server/client mismatch.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${zilla.variable} ${plexSans.variable} ${plexMono.variable} h-full`}
    >
      <head>
        <ThemeScript />
        <meta name="theme-color" content="#060B14" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body className="flex min-h-screen flex-col bg-bg-base font-body text-ink">
        <MotionProvider>
          <ReferralCapture />
          <CursorRipple />
          <div className="flex-1">{children}</div>
          <CustomCursor />
        </MotionProvider>
      </body>
    </html>
  );
}
