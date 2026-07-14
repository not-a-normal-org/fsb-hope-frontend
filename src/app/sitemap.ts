import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// Public, indexable marketing + legal routes. Admin, dashboard, API, the disabled
// podcast, and post-purchase utility flows (/apply/success, /alerts/preferences,
// /research/intake) are intentionally excluded — see robots.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}`,                  lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/membership`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/pricing`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/points-concierge`, lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/alerts`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/research`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/apply`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`,            lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/case-studies`,     lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/privacy`,          lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${SITE_URL}/terms`,            lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
