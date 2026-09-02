import type { Metadata } from "next";
import Script from "next/script";
import { Zilla_Slab, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/site/MotionProvider";
import ThemeScript from "@/components/system/ThemeScript";
import CustomCursor from "@/components/system/CustomCursor";
import ReferralCapture from "@/components/system/ReferralCapture";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

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
// Minimal on purpose; richer metadata belongs with the pages it describes.
// No global robots directive: the launched marketing site should index. While the
// construction wall is up it 503s + no-stores anonymous traffic, and the
// /maintenance notice sets its own noindex — so the wall handles crawlers without
// this needing to suppress the real pages.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  // Link-preview card (X/LinkedIn/Slack/WhatsApp) — the brand lockup on the dark
  // base. Matching social exports live in public/img/ (square avatar, nav icon).
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_TAGLINE,
    url: SITE_URL,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_TAGLINE,
    images: ["/twitter-image.png"],
  },
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
        {/* Site-wide entity graph — helps search + AI resolve who Saver Miles is. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
      </head>

      <body className="flex min-h-screen flex-col bg-bg-base font-body text-ink">
        <MotionProvider>
          <ReferralCapture />
          <div className="flex-1">{children}</div>
          <CustomCursor />
        </MotionProvider>

        {/* Google Analytics 4 (gtag.js). Loaded after the page is interactive so
            it never blocks paint. Injected via next/script per the App Router
            guidance; a raw inline <script> in JSX would not execute. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-50ZT6S22C6"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-50ZT6S22C6');`}
        </Script>
      </body>
    </html>
  );
}
