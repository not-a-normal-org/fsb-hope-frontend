import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // reactCompiler disabled — conflicts with Framer Motion animation lifecycle hooks
  reactCompiler: false,
  allowedDevOrigins: ['192.168.0.102'],
  images: {
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
export default withPayload(nextConfig);
