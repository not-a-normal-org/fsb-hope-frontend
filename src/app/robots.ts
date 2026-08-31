import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

// Served at /robots.txt. Sensitive/non-public areas are kept out of the index;
// everything else is crawlable. Sitemap is advertised so crawlers discover pages.
//
// AI crawlers are explicitly welcomed (the content is meant to be scraped and
// cited by LLMs) — listing them by name, each with the same allow/disallow as
// `*`, is the clear signal, since some default to conservative behaviour without
// an explicit rule. `/llms.txt` is advertised alongside the sitemap.
//
// While the construction wall is up this is unreachable anyway: the proxy
// returns 503 for it, which tells crawlers to stop and retry later.
const DISALLOW = ['/admin/', '/api/', '/cms/', '/cms-api/'];

// Answer-engine + training crawlers we want indexing and citing the blog.
const AI_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Amazonbot',
  'Bytespider',
  'Meta-ExternalAgent',
  'cohere-ai',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: AI_AGENTS, allow: '/', disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
