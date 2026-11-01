import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // reactCompiler disabled — conflicts with Framer Motion animation lifecycle hooks
  reactCompiler: false,
  allowedDevOrigins: ['192.168.0.102'],
  images: {
    // AVIF first, WebP for browsers without it. AVIF is ~half the bytes here (the
    // 256px logo: 5.5 KB vs 11 KB WebP) and smaller on the blog covers; its slower
    // first encode is paid once per rendition, then cached.
    formats: ['image/avif', 'image/webp'],
    // Cover images are served from the public Supabase Storage bucket (not
    // Payload's wall-gated /cms-api/media route), so next/image needs the host.
    remotePatterns: [
      { protocol: 'https', hostname: 'xodffpwxvzuylhoyivih.supabase.co' },
    ],
  },
  async redirects() {
    return [
      // /audit (the free points audit page) is retired — the "Get started" popup
      // replaced it. It was the individual lead form on a page of its own, so old
      // links and bookmarks land on the individual page, whose CTA opens that form.
      { source: '/audit', destination: '/individual', permanent: true },
    ];
  },
};

// withPayload wires Payload's admin (/cms) and API (/cms-api) into the Next build.
const config = withPayload(nextConfig);

// withPayload also sends Accept-CH, Critical-CH and Vary for the
// Sec-CH-Prefers-Color-Scheme client hint on EVERY path, so its admin can
// server-render the OS theme. On the public site, Critical-CH makes Chromium
// discard a first-time visitor's response and request the page again: an extra
// round trip on every first visit (Lighthouse showed it as a ~0.8 s redirect
// from the page to itself). Only the admin reads the hint, so it stays on /cms.
const CMS_ONLY = new Set(['accept-ch', 'critical-ch', 'vary']);
const isColorSchemeHint = (h: { key: string; value: string }) =>
  CMS_ONLY.has(h.key.toLowerCase()) && h.value === 'Sec-CH-Prefers-Color-Scheme';
const payloadHeaders = config.headers;

export default {
  ...config,
  async headers() {
    const rules = (await payloadHeaders?.()) ?? [];
    return rules.flatMap((rule) => {
      const hints = rule.headers.filter(isColorSchemeHint);
      if (rule.source !== '/:path*' || hints.length === 0) return [rule];
      const rest = rule.headers.filter((h) => !isColorSchemeHint(h));
      return [
        ...(rest.length ? [{ ...rule, headers: rest }] : []),
        { ...rule, source: '/cms/:path*', headers: hints },
      ];
    });
  },
} satisfies NextConfig;
