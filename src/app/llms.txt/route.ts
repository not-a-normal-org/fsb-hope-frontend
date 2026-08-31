import { getPayloadClient } from '@/lib/payload';
import { absoluteUrl } from '@/lib/seo';
import { SITE_NAME } from '@/lib/constants';

/**
 * Served at /llms.txt — the emerging convention that hands LLMs / answer engines
 * a clean, linkable map of the site so they can find and cite our content without
 * scraping rendered HTML. Site summary + every published post + the key pages.
 * Dynamic so new posts appear without a rebuild. Walled until launch like the
 * sitemap; serves once the construction wall drops.
 */
export const dynamic = 'force-dynamic';

type PostRow = { title?: string; slug?: string; excerpt?: string; category?: { name?: string } };

const KEY_PAGES: [string, string, string][] = [
  ['/how-it-works', 'How it works', 'How a manual, by-hand award search works, step by step.'],
  ['/pricing', 'Pricing', 'Flat pricing. A $25 deposit is refunded in full if nothing bookable is found.'],
  ['/individual', 'For individuals', 'Free points audit: what your points can actually book.'],
  ['/business', 'For business', 'Account-level award search for teams that fly often.'],
  ['/alerts', 'Alerts', 'An automated weekly route scan, or a specialist checking your routes each cycle.'],
  ['/calculator', 'Points calculator', 'A quick estimate of what your points balance is worth.'],
];

export async function GET() {
  let posts: PostRow[] = [];
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 100,
      depth: 1,
    });
    posts = res.docs as PostRow[];
  } catch {
    /* degrade to the key-pages map if the DB is unreachable */
  }

  const lines: string[] = [
    `# ${SITE_NAME}`,
    '',
    '> A manual, human-run points-and-miles concierge. A real specialist searches award space by hand across 30+ loyalty programs and hands you a bookable seat with the exact point cost. The differentiator is that a real person checked the seat, not an algorithm.',
    '',
    '## Guides',
    'In-depth, evergreen guides to booking flights with points and miles:',
    '',
  ];

  for (const p of posts) {
    if (!p.slug || !p.title) continue;
    const desc = (p.excerpt ?? '').trim().replace(/\s+/g, ' ');
    lines.push(`- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)})${desc ? `: ${desc}` : ''}`);
  }

  lines.push('', '## Key pages', '');
  for (const [path, name, desc] of KEY_PAGES) {
    lines.push(`- [${name}](${absoluteUrl(path)}): ${desc}`);
  }
  lines.push('', `## About`, '', 'Blog index: ' + absoluteUrl('/blog'), 'RSS feed: ' + absoluteUrl('/blog/feed.xml'), '');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
