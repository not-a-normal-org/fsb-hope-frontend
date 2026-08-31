import { getPayloadClient } from '@/lib/payload';
import { absoluteUrl } from '@/lib/seo';
import { SITE_NAME } from '@/lib/constants';

/**
 * Served at /blog/feed.xml — an RSS 2.0 feed of published posts, for feed readers
 * and as another structured signal for AI/answer engines. Dynamic; walled until
 * launch like the sitemap.
 */
export const dynamic = 'force-dynamic';

type PostRow = {
  title?: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
  category?: { name?: string };
};

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

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
    /* empty feed on DB error */
  }

  const self = absoluteUrl('/blog/feed.xml');
  const items = posts
    .filter((p) => p.slug && p.title)
    .map((p) => {
      const link = absoluteUrl(`/blog/${p.slug}`);
      const date = new Date(p.publishedAt ?? p.updatedAt ?? Date.now()).toUTCString();
      const cat = p.category?.name ? `\n      <category>${esc(p.category.name)}</category>` : '';
      return `    <item>
      <title>${esc(p.title!)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${date}</pubDate>
      <description><![CDATA[${(p.excerpt ?? '').trim()}]]></description>${cat}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)} — Blog</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>Guides to booking flights with points and miles, checked by a real specialist.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
