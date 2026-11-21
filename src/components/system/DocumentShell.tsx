import type { Metadata } from "next";
import Script from "next/script";
import { Zilla_Slab, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "@/app/globals.css";
import MotionProvider from "@/components/site/MotionProvider";
import ThemeScript from "@/components/system/ThemeScript";
import ConsentBanner from "@/components/system/ConsentBanner";
import ConsentScript from "@/components/system/ConsentScript";
import ReferralCapture from "@/components/system/ReferralCapture";
import { DE_LIVE, OG_LOCALES, localizePath, type Locale } from "@/i18n/config";
import { getClientMessages, getMessages } from "@/i18n/get-messages";
import LocaleProvider from "@/i18n/LocaleProvider";
import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/ads";
import { CONSENT_REGIONS, consentChoiceJs } from "@/lib/consent";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { OG_IMAGE, TWITTER_IMAGE, absoluteUrl, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/**
 * The <html> document shared by the app's two root layouts:
 * `app/(frontend)/[lang]/layout.tsx` (the public site, in its language) and
 * `app/(staff)/layout.tsx` (admin, login, portal, maintenance — always English).
 * They are separate root layouts because <html lang> has to come from the
 * `[lang]` segment, and staff routes don't have one.
 */

/* ========== FONTS (docs/plans/01-brand-design-system.md §3) ========== */

// Display — headlines, section titles. Carries the shine-sweep on hero text.
// The latin subset covers German (ä ö ü ß).
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
// this needing to suppress the real pages. The one exception: German pages stay
// noindex until German goes live (DE_LIVE).
export function siteMetadata(locale: Locale): Metadata {
  const { tagline } = getMessages(locale).meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${tagline}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: tagline,
    ...(locale !== "en" && !DE_LIVE ? { robots: { index: false, follow: true } } : {}),
    // Link-preview card (X/LinkedIn/Slack/WhatsApp) — the brand lockup on the dark
    // base. Matching social exports live in public/img/ (square avatar, nav icon).
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      title: `${SITE_NAME} — ${tagline}`,
      description: tagline,
      url: absoluteUrl(localizePath(locale, "/")),
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — ${tagline}`,
      description: tagline,
      images: [TWITTER_IMAGE],
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: "/apple-touch-icon.png",
    },
  };
}

/* ========== GOOGLE TAG (src/lib/consent.ts, src/lib/ads.ts) ========== */
// Consent Mode v2 defaults, set before gtag.js loads. Opt-in regions (EEA, UK,
// CH) start with everything denied; elsewhere measurement and remarketing start
// granted, except remarketing for a browser sending Global Privacy Control. A
// stored choice from the banner then overrides either default. ads_data_redaction
// strips ad identifiers from pings sent while ad_storage is denied; url_passthrough
// carries the click ID across pages without a cookie in that case.
const consentDefaultsJs = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var gpc=navigator.globalPrivacyControl===true;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${JSON.stringify(CONSENT_REGIONS)},wait_for_update:500});
gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:gpc?'denied':'granted',analytics_storage:'granted'});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
var c=${consentChoiceJs};
if(c){gtag('consent','update',{ad_storage:c,ad_user_data:c,analytics_storage:c,ad_personalization:c==='granted'&&!gpc?'granted':'denied'});}`;

// GA4, plus the Google Ads destination once GOOGLE_ADS_ID is set (one gtag.js
// serves both). Enhanced conversions take the email/phone the lead form passes
// to gtag('set','user_data') — see trackLead().
const googleConfigJs = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');${
  GOOGLE_ADS_ID ? `\ngtag('config', '${GOOGLE_ADS_ID}', {allow_enhanced_conversions: true});` : ""
}`;

/* ========== ROOT DOCUMENT ========== */
// data-theme="dark" is the SSR default; ThemeScript corrects it pre-paint for
// visitors who chose light/mono. suppressHydrationWarning covers that one
// attribute React would otherwise flag as a server/client mismatch.
//
// `tracking` is the public site's switch: it loads the Google tag (GA4 + Ads)
// and the cookie banner that governs it. The staff layout leaves it off, so no
// analytics or ad tag ever runs over /admin, /cms or /portal, where lead and
// customer records are on screen.
export default function DocumentShell({
  locale,
  tracking = false,
  children,
}: Readonly<{
  locale: Locale;
  tracking?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={locale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${zilla.variable} ${plexSans.variable} ${plexMono.variable} h-full`}
    >
      {/* These two lint rules exempt only files named `layout`; this component is
          rendered solely by the root layouts, so <head> and a beforeInteractive
          script are where they belong. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <ThemeScript />
        {tracking && <ConsentScript />}
        {/* Google Consent Mode v2 defaults, before gtag.js loads (see consentDefaultsJs). */}
        {tracking && (
          // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
          <Script id="ga-consent-default" strategy="beforeInteractive">
            {consentDefaultsJs}
          </Script>
        )}
        <meta name="theme-color" content="#060B14" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Site-wide entity graph — helps search + AI resolve who Saver Miles is. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(locale)) }}
        />
      </head>

      <body className="flex min-h-screen flex-col bg-bg-base font-body text-ink">
        <LocaleProvider locale={locale} messages={getClientMessages(locale)}>
          <MotionProvider>
            <ReferralCapture />
            <div className="flex-1">{children}</div>
          </MotionProvider>

          {tracking && <ConsentBanner />}
        </LocaleProvider>

        {/* The Google tag (gtag.js) for GA4 and Google Ads. Loaded after the page is
            interactive so it never blocks paint. Consent Mode (set in <head>) decides
            what it may store and send. Injected via next/script because a raw inline
            <script> in App Router JSX would not execute. */}
        {tracking && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {googleConfigJs}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
