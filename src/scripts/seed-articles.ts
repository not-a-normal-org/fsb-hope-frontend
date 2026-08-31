/**
 * Blog articles seed — the Review-v3 content build-out. Seven original,
 * competitor-gap-driven guides, each with a generated hero image, published live.
 *
 * Run: `npm run seed:articles` (→ `payload run src/scripts/seed-articles.ts`).
 * `payload run` loads `.env.local` (DATABASE_URI, PAYLOAD_SECRET, S3_*) via @next/env.
 *
 * Source of truth is the markdown in `src/scripts/assets/blog/<slug>.md`
 * (front-matter header + restricted-markdown body) and the matching
 * `<slug>.jpg` hero. Idempotent: re-running UPDATES each post in place (matched by
 * slug) and reuses the existing cover image, so copy edits re-apply from source
 * control without creating duplicates.
 *
 * The restricted markdown supports exactly what `.sm-prose` styles: h2/h3,
 * paragraphs, bullet/number lists, blockquote, bold, italic, and links.
 */
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { getPayload } from 'payload';
import config from '@payload-config';

/* ── Minimal Lexical builders (identical shapes to seed-foundation-post.ts) ── */
type Node = { [k: string]: unknown; type: string; version: number };
const BOLD = 1;
const ITALIC = 2;

const text = (value: string, format = 0): Node => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
});
const link = (children: Node[], url: string): Node => ({
  type: 'link',
  fields: { linkType: 'custom', url, newTab: false },
  format: '',
  indent: 0,
  direction: 'ltr',
  version: 3,
  children,
});
const element = (type: string, children: Node[], extra: Record<string, unknown> = {}): Node => ({
  format: '',
  indent: 0,
  direction: 'ltr' as const,
  children,
  ...extra,
  type,
  version: 1,
});
const paragraph = (children: Node[]): Node => element('paragraph', children, { textFormat: 0 });
const heading = (value: string, tag: 'h2' | 'h3'): Node => element('heading', [text(value)], { tag });
const quote = (children: Node[]): Node => element('quote', children);
const listItem = (children: Node[], value: number): Node =>
  element('listitem', children, { value, checked: undefined });
const list = (tag: 'ul' | 'ol', items: Node[][]): Node =>
  element('list', items.map((item, idx) => listItem(item, idx + 1)), {
    listType: tag === 'ul' ? 'bullet' : 'number',
    tag,
    start: 1,
  });
const doc = (children: Node[]) => ({
  root: { type: 'root', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const, children },
});

/* ── Restricted-markdown → Lexical ─────────────────────────────────────────── */

const decodeEntities = (s: string): string =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

/** Inline: **bold**, *italic*, [text](url); everything else is plain text. */
function parseInline(raw: string): Node[] {
  const out: Node[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    if (m.index > last) out.push(text(raw.slice(last, m.index)));
    if (m[1] !== undefined) out.push(link([text(m[1])], m[2]));
    else if (m[3] !== undefined) out.push(text(m[3], BOLD));
    else if (m[4] !== undefined) out.push(text(m[4], ITALIC));
    last = re.lastIndex;
  }
  if (last < raw.length) out.push(text(raw.slice(last)));
  return out.length ? out : [text('')];
}

/** Block parser over the restricted markdown body. */
function parseBody(body: string): Node[] {
  const lines = decodeEntities(body).replace(/\r\n/g, '\n').split('\n');
  const nodes: Node[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      nodes.push(heading(line.slice(3).trim(), 'h2'));
      i++;
    } else if (line.startsWith('### ')) {
      nodes.push(heading(line.slice(4).trim(), 'h3'));
      i++;
    } else if (line.startsWith('> ')) {
      nodes.push(quote(parseInline(line.slice(2).trim())));
      i++;
    } else if (/^- /.test(line)) {
      const items: Node[][] = [];
      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^- /, '').trim()));
        i++;
      }
      nodes.push(list('ul', items));
    } else if (/^\d+\.\s/.test(line)) {
      const items: Node[][] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(parseInline(lines[i].replace(/^\d+\.\s/, '').trim()));
        i++;
      }
      nodes.push(list('ol', items));
    } else {
      // Paragraph: gather consecutive plain lines.
      const buf: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^(#{2,3} |> |- |\d+\.\s)/.test(lines[i])
      ) {
        buf.push(lines[i].trim());
        i++;
      }
      nodes.push(paragraph(parseInline(buf.join(' '))));
    }
  }
  return nodes;
}

/* ── Front-matter ──────────────────────────────────────────────────────────── */
type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  body: string;
};

function parseArticle(md: string): Article {
  const [header, ...rest] = md.split('\n---BODY---\n');
  const body = rest.join('\n---BODY---\n').trim();
  const get = (key: string): string => {
    const line = header.split('\n').find((l) => l.startsWith(`${key}:`));
    return line ? line.slice(key.length + 1).trim() : '';
  };
  return {
    slug: get('SLUG'),
    category: get('CATEGORY') || 'guides',
    title: get('TITLE'),
    excerpt: get('EXCERPT'),
    metaTitle: get('META_TITLE'),
    metaDescription: get('META_DESCRIPTION'),
    body,
  };
}

/* ── Run order (newest first). Flagship leads. ─────────────────────────────── */
const ORDER = [
  'phantom-award-space-why-seats-vanish',
  'human-vs-award-search-tools',
  'transfer-partners-explained-guide',
  'business-class-to-tokyo-with-points',
  'avoid-fuel-surcharges-award-flights',
  'no-award-space-what-a-specialist-does',
  'book-premium-seats-for-family-with-points',
];

const ASSETS = path.resolve('src/scripts/assets/blog');
const CATEGORY_NAME: Record<string, string> = { guides: 'Guides', deals: 'Deals' };

async function categoryId(payload: Awaited<ReturnType<typeof getPayload>>, slug: string): Promise<number> {
  const found = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  if (found.docs[0]) return found.docs[0].id as number;
  const created = await payload.create({
    collection: 'categories',
    data: { name: CATEGORY_NAME[slug] ?? slug, slug },
  });
  return created.id as number;
}

async function main() {
  const payload = await getPayload({ config });
  const now = Date.now();

  for (let idx = 0; idx < ORDER.length; idx++) {
    const slug = ORDER[idx];
    const mdPath = path.join(ASSETS, `${slug}.md`);
    const imgPath = path.join(ASSETS, `${slug}.jpg`);
    if (!existsSync(mdPath)) {
      console.log(`✗ missing markdown for "${slug}" — skipped`);
      continue;
    }
    const article = parseArticle(readFileSync(mdPath, 'utf8'));
    const catId = await categoryId(payload, article.category);

    const existing = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, depth: 0 });
    const prev = existing.docs[0] as { id: number; coverImage?: number | null } | undefined;

    // Cover image: reuse the post's existing one on a re-run; otherwise upload.
    let coverImage = prev?.coverImage ?? undefined;
    if (!coverImage && existsSync(imgPath)) {
      const media = await payload.create({
        collection: 'media',
        filePath: imgPath,
        data: { alt: `Editorial illustration for “${article.title}”` },
      });
      coverImage = media.id as number;
      console.log(`  ↑ uploaded cover for "${slug}" → media ${coverImage}`);
    }

    const data = {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      category: catId,
      content: doc(parseBody(article.body)),
      meta: { title: article.metaTitle, description: article.metaDescription },
      ...(coverImage ? { coverImage } : {}),
      _status: 'published' as const,
    };

    if (prev) {
      await payload.update({ collection: 'posts', id: prev.id, data });
      console.log(`✓ updated "${slug}" (${article.category})`);
    } else {
      await payload.create({
        collection: 'posts',
        data: { ...data, publishedAt: new Date(now - idx * 3_600_000).toISOString() },
      });
      console.log(`✓ created "${slug}" (${article.category})`);
    }
  }

  console.log('\nArticles seed complete.');
}

/** Drain stdout/stderr before process.exit, or piped output is lost. */
const flush = () =>
  new Promise<void>((resolve) => {
    let pending = 2;
    const done = () => --pending === 0 && resolve();
    process.stdout.write('', done);
    process.stderr.write('', done);
  });

try {
  await main();
  await flush();
  process.exit(0);
} catch (err) {
  console.error('Articles seed failed:', err);
  await flush();
  process.exit(1);
}
