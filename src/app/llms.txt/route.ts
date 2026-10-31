import { DE_LIVE, localizePath } from '@/i18n/config';
import { formatPrice } from '@/i18n/format';
import { getMessages } from '@/i18n/get-messages';
import { getPayloadClient } from '@/lib/payload';
import { PRICES_USD } from '@/lib/products';
import { absoluteUrl } from '@/lib/seo';
import { SITE_EMAIL, SITE_NAME } from '@/lib/constants';

/**
 * Served at /llms.txt — the emerging convention that hands LLMs / answer engines
 * a clean, linkable map of the site so they can find and cite our content without
 * scraping rendered HTML. Site summary + every published post + the key pages.
 * Dynamic so new posts appear without a rebuild.
 *
 * Once German is live it ends with a German section: the same key pages under
 * /de with their German descriptions (from the dictionaries), and every post that
 * has its own German title and body, so an engine answering in German can cite
 * German pages. One file for both languages, as the convention has no per-language
 * variant.
 */
export const dynamic = 'force-dynamic';

type PostRow = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: unknown;
  category?: { name?: string };
};

const KEY_PAGES: [string, string, string][] = [
  ['/how-it-works', 'How it works', 'How a manual, by-hand award search works, step by step.'],
  ['/pricing', 'Pricing', `Individual search: a ${formatPrice('en', PRICES_USD.deposit)} deposit plus a ${formatPrice('en', PRICES_USD.successFee)} success fee; the deposit is refunded in full if nothing bookable is found. Business pricing is custom.`],
  ['/individual', 'For individuals', 'What your points can actually book, searched by a specialist.'],
  ['/business', 'For business', 'Account-level award search for teams that fly often.'],
  ['/alerts', 'Alerts', 'An automated weekly route scan, or a specialist checking your routes each cycle.'],
  ['/calculator', 'Points calculator', 'A quick estimate of what your points balance is worth.'],
];

/** German key pages: the English paths, described in German from the dictionaries
 *  (each page's headline plus its intro, so the line stands on its own). */
function germanKeyPages(): [string, string, string][] {
  const de = getMessages('de');
  const price = (usd: number) => formatPrice('de', usd);
  return [
    ['/how-it-works', de.howItWorks.title, `${de.howItWorks.heading} ${de.howItWorks.intro}`],
    [
      '/pricing',
      de.pricing.title,
      `Individuelle Suche: ${price(PRICES_USD.deposit)} Anzahlung plus ${price(PRICES_USD.successFee)} Erfolgshonorar; die Anzahlung wird vollständig erstattet, wenn wir nichts Buchbares finden. Business-Preise auf Anfrage. Alle Preise in US-Dollar.`,
    ],
    ['/individual', de.individual.title, `${de.individual.hero.title} ${de.individual.hero.intro}`],
    ['/business', de.business.title, `${de.business.hero.title} ${de.business.hero.intro}`],
    ['/alerts', de.alerts.title, `${de.alerts.hero.title} ${de.alerts.hero.intro}`],
    ['/calculator', de.calculator.title, `${de.calculator.hero.title} ${de.calculator.hero.intro}`],
  ];
}

export async function GET() {
  let posts: PostRow[] = [];
  let germanPosts: PostRow[] = [];
  try {
    const payload = await getPayloadClient();
    const published = { _status: { equals: 'published' } } as const;
    const [en, de] = await Promise.all([
      payload.find({ collection: 'posts', where: published, sort: '-publishedAt', limit: 100, depth: 1 }),
      DE_LIVE
        ? payload.find({
            collection: 'posts',
            where: published,
            sort: '-publishedAt',
            limit: 100,
            depth: 0,
            locale: 'de',
            fallbackLocale: false,
          })
        : Promise.resolve({ docs: [] }),
    ]);
    posts = en.docs as PostRow[];
    // Only posts with their own German title and body (see cms-locale.server.ts).
    germanPosts = (de.docs as PostRow[]).filter((p) => p.title && p.content);
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
  lines.push(
    '',
    `## About`,
    '',
    'Blog index: ' + absoluteUrl('/blog'),
    'RSS feed: ' + absoluteUrl('/blog/feed.xml'),
    'Contact: ' + SITE_EMAIL,
  );
  // The site's German edition mirrors these paths under /de.
  if (DE_LIVE) lines.push('German edition: ' + absoluteUrl('/de'));
  lines.push('');

  if (DE_LIVE) {
    const de = getMessages('de');
    const url = (path: string) => absoluteUrl(localizePath('de', path));
    lines.push('## Deutsch (German edition)', '', `> ${de.meta.organization}`, '', '### Wichtige Seiten', '');
    for (const [path, name, desc] of germanKeyPages()) lines.push(`- [${name}](${url(path)}): ${desc}`);
    if (germanPosts.length) {
      lines.push('', '### Ratgeber auf Deutsch', '');
      for (const p of germanPosts) {
        if (!p.slug) continue;
        const desc = (p.excerpt ?? '').trim().replace(/\s+/g, ' ');
        lines.push(`- [${p.title}](${url(`/blog/${p.slug}`)})${desc ? `: ${desc}` : ''}`);
      }
    }
    lines.push('', 'Blog: ' + url('/blog'), 'RSS: ' + url('/blog/feed.xml'), '');
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
