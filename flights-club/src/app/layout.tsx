import type { Metadata } from "next";
import { Inter, Playfair_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

/* ========== FONT CONFIGURATION ========== */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Outfit", "system-ui", "sans-serif"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Canela", "serif"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Courier New", "monospace"],
});

/* ========== SEO METADATA ========== */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Australia's premier Business Class travel membership for business owners. Turn everyday expenses into guaranteed flat-bed flights and VIP experiences.",
  keywords: [
    "business class flights",
    "frequent flyer points",
    "flight membership",
    "Qantas points",
    "Velocity points",
    "business travel",
    "travel rewards",
    "Australia",
  ],
  authors: [{ name: "The Flights Club by iFLYflat" }],
  creator: "The Flights Club by iFLYflat",
  publisher: "The Flights Club by iFLYflat",
  robots: "index, follow",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Australia's premier Business Class travel membership for business owners. Turn everyday expenses into guaranteed flat-bed flights and VIP experiences.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@theflightsclub",
    creator: "@theflightsclub",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: "Never fly economy again.",
    images: ["/twitter-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
};

/* ========== ROOT LAYOUT COMPONENT ========== */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${dmMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#07090F" />
        <meta name="color-scheme" content="dark" />

        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* DNS Prefetch for external services */}
        <link rel="dns-prefetch" href="https://events.humanitix.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": SITE_URL,
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              description:
                "Australia's premier Business Class travel membership for business owners.",
              sameAs: [
                "https://instagram.com/theflightsclub",
                "https://facebook.com/theflightsclub",
                "https://linkedin.com/company/the-flights-club",
                "https://youtube.com/@theflightsclub",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                areaServed: "AU",
              },
              areaServed: "AU",
              foundingDate: "2013",
            }),
          }}
        />
      </head>

      <body className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
        {/* Layout wrapper */}
        <Navbar />
        <main className="flex-1">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />

        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 px-3 py-2 bg-accent-orange text-black rounded-md text-sm font-medium"
        >
          Skip to main content
        </a>
      </body>
    </html>
  );
}
