import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// Served at /robots.txt. Sensitive/non-public areas are kept out of the index;
// everything else is crawlable. Sitemap is advertised so crawlers discover pages.
//
// While the construction wall is up this is unreachable anyway: the proxy
// returns 503 for it, which tells crawlers to stop and retry later.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
