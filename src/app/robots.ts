import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// Served at /robots.txt. Sensitive/non-marketing areas are kept out of the index;
// everything else is crawlable. Sitemap is advertised so crawlers discover all pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
