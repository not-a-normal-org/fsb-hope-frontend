import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// Add each public route here as it is built. Admin, API, and post-purchase
// utility flows stay out of the index — see robots.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
  ];
}
