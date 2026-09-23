/**
 * Blog articles seed — publishes the blog library from source control. Every post
 * in ORDER (a pillar foundation guide + supporting articles and deals) is a
 * markdown file plus a hero image. Full playbook: docs/blog-guide/publishing.md.
 *
 * Run: `npm run seed:articles` (→ `payload run src/scripts/seed-articles.ts`).
 * `payload run` loads `.env.local` (DATABASE_URI, PAYLOAD_SECRET, S3_*) via @next/env.
 * ⚠ That database is PRODUCTION: a seed publishes live, immediately.
 *
 * Switches:
 *  - `ONLY=slug[,slug]`  seed just these posts. Use it for every publish/edit: a
 *    full run re-saves all posts and bumps every sitemap lastmod, which tells
 *    Google content changed when it didn't.
 *  - `SEED_DRY_RUN=1`    validate + print a preflight report, then exit WITHOUT
 *    connecting to the database.
 *  - `RESEED_COVERS=1`   re-upload covers from <slug>.jpg and delete the old media.
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
import { readFileSync, existsSync, statSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { getPayload } from 'payload';
import config from '@payload-config';

import { extractFaq, wordCount } from '@/lib/blog';

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
/**
 * Upload node: a decorator LEAF, so it is built by hand rather than through
 * element(), which would wrongly give it children/indent/direction and version 1.
 * `id` is the node's own id (not the media id) and must be stable, so re-running
 * the seed can find the node again and reuse the media it already uploaded.
 * `fields` is free-form here (UploadFeature has no configured sub-fields), which
 * is where the caption rides along.
 */
const upload = (nodeId: string, mediaId: number, caption?: string): Node => ({
  type: 'upload',
  version: 3,
  format: '',
  id: nodeId,
  relationTo: 'media',
  value: mediaId,
  fields: caption ? { caption } : {},
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

/** A body image: `![alt](<slug>-<descriptor>.jpg "optional caption")` on its own line. */
export type BodyImage = { file: string; alt: string; caption?: string; nodeId: string };
const IMAGE_RE = /^!\[([^\]]*)\]\(([^)"\s]+)(?:\s+"([^"]*)")?\)\s*$/;

/**
 * Block parser over the restricted markdown body. Image nodes are emitted with a
 * placeholder media id of 0; main() swaps in the real id once the file is uploaded.
 */
function parseBody(body: string): { nodes: Node[]; images: BodyImage[] } {
  const lines = decodeEntities(body).replace(/\r\n/g, '\n').split('\n');
  const nodes: Node[] = [];
  const images: BodyImage[] = [];
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
    } else if (IMAGE_RE.test(line)) {
      const [, alt, file, caption] = line.match(IMAGE_RE)!;
      const image: BodyImage = {
        file,
        alt: alt.trim(),
        caption: caption?.trim() || undefined,
        nodeId: file.replace(/\.[a-z0-9]+$/i, ''),
      };
      images.push(image);
      nodes.push(upload(image.nodeId, 0, image.caption));
      i++;
    } else {
      // Paragraph: gather consecutive plain lines.
      const buf: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^(#{2,3} |> |- |\d+\.\s|!\[)/.test(lines[i])
      ) {
        buf.push(lines[i].trim());
        i++;
      }
      nodes.push(paragraph(parseInline(buf.join(' '))));
    }
  }
  return { nodes, images };
}

/* ── Front-matter ──────────────────────────────────────────────────────────── */
type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  /** Optional alt text for the cover (describe the image, not the post). */
  coverAlt: string;
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
    coverAlt: get('COVER_ALT'),
    body,
  };
}

/* ── Run order (newest first). Flagship leads. ─────────────────────────────── */
const ORDER = [
  'citi-thankyou-japan-airlines-transfer-partner',
  'travel-portal-vs-transfer-partners',
  'qantas-points-condor-reward-seats',
  'phantom-award-space-why-seats-vanish',
  'human-vs-award-search-tools',
  'transfer-partners-explained-guide',
  'business-class-to-tokyo-with-points',
  'avoid-fuel-surcharges-award-flights',
  'no-award-space-what-a-specialist-does',
  'book-premium-seats-for-family-with-points',
  // The pillar/foundation guide (migrated from the retired seed-foundation-post.ts).
  // It already exists, so the upsert UPDATES it in place (keeps its original
  // publishedAt) and uploads its new cover image.
  'how-to-fly-for-free-with-credit-card-points',
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

type Selected = {
  slug: string;
  idx: number;
  article: Article;
  imgPath: string;
  content: ReturnType<typeof doc>;
  images: BodyImage[];
};

/** Body-image filenames are `<slug>-<descriptor>.<ext>`: unique per post, and the prefix scopes cleanup. */
const bodyImageName = (slug: string) => new RegExp(`^${slug}-[a-z0-9-]+\\.(jpe?g|png|webp)$`);

/**
 * Which posts this run touches. `idx` stays the post's position in ORDER so a new
 * post's publishedAt is the same whether it's seeded alone or in a full run.
 */
function selectSlugs(): { slug: string; idx: number }[] {
  const all = ORDER.map((slug, idx) => ({ slug, idx }));
  const only = (process.env.ONLY ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!only.length) return all;
  const unknown = only.filter((s) => !ORDER.includes(s));
  if (unknown.length) {
    throw new Error(
      `ONLY lists slug(s) not in ORDER: ${unknown.join(', ')}. Add a new post to the top of ORDER first.`,
    );
  }
  return all.filter((s) => only.includes(s.slug));
}

/** Read + parse every selected post and fail on anything that would publish broken or leak. */
function loadAndValidate(): Selected[] {
  const problems: string[] = [];
  const selected: Selected[] = [];
  for (const { slug, idx } of selectSlugs()) {
    const mdPath = path.join(ASSETS, `${slug}.md`);
    if (!existsSync(mdPath)) {
      problems.push(`"${slug}": missing ${mdPath}`);
      continue;
    }
    const article = parseArticle(readFileSync(mdPath, 'utf8'));
    if (article.slug !== slug) problems.push(`"${slug}": SLUG front-matter is "${article.slug}"`);
    if (!CATEGORY_NAME[article.category]) {
      // An unknown value would silently create a new public category.
      problems.push(`"${slug}": CATEGORY "${article.category}" is not one of ${Object.keys(CATEGORY_NAME).join(', ')}`);
    }
    for (const [key, value] of Object.entries({ TITLE: article.title, EXCERPT: article.excerpt })) {
      if (!value) problems.push(`"${slug}": ${key} is empty`);
    }

    const { nodes, images } = parseBody(article.body);
    const seen = new Set<string>();
    for (const image of images) {
      if (!bodyImageName(slug).test(image.file)) {
        problems.push(`"${slug}": body image "${image.file}" must be named <slug>-<descriptor>.jpg (no paths)`);
      } else if (!existsSync(path.join(ASSETS, image.file))) {
        problems.push(`"${slug}": body image "${image.file}" not found in ${ASSETS}`);
      }
      if (seen.has(image.file)) problems.push(`"${slug}": body image "${image.file}" is used twice`);
      seen.add(image.file);
      // alt is required on the media collection, and a screen reader needs it regardless.
      if (!image.alt) problems.push(`"${slug}": body image "${image.file}" has empty alt text`);
    }

    selected.push({ slug, idx, article, imgPath: path.join(ASSETS, `${slug}.jpg`), content: doc(nodes), images });
  }
  if (problems.length) throw new Error(`Refusing to seed:\n  - ${problems.join('\n  - ')}`);
  return selected;
}

/** Preflight report for SEED_DRY_RUN — no database. Warnings don't fail the run. */
async function report(post: Selected): Promise<void> {
  const { article, content, imgPath, images } = post;
  const warnings: string[] = [];
  const len = (label: string, value: string, lo: number, hi: number) => {
    const n = value.length;
    const ok = n >= lo && n <= hi;
    if (!ok) warnings.push(`${label} is ${n} chars (want ${lo}–${hi})`);
    return `${label.padEnd(17)} ${String(n).padStart(3)}  ${ok ? '✓' : '⚠'}  ${value}`;
  };

  const words = wordCount(content);
  const allText = [article.title, article.excerpt, article.metaTitle, article.metaDescription, article.coverAlt, article.body];
  const imageText = images.flatMap((i) => [i.alt, i.caption ?? '']);
  const emDashes = [...allText, ...imageText].join('\n').split('—').length - 1;
  const faqs = extractFaq(content);
  const headings = (content.root.children as { type: string; tag?: string; children?: { text?: string }[] }[])
    .filter((n) => n.type === 'heading')
    .map((n) => `${n.tag === 'h3' ? '      ' : '    '}${n.tag}  ${(n.children ?? []).map((c) => c.text ?? '').join('')}`);

  if (words < 1500 || words > 2400) warnings.push(`${words} words (house range ~1,800–2,000)`);
  if (emDashes) warnings.push(`${emDashes} em dash(es) — house rule is zero`);
  if (faqs.length !== 4) warnings.push(`${faqs.length} FAQ questions (house rule is 4)`);
  if (!existsSync(imgPath)) warnings.push(`no cover image at ${path.basename(imgPath)}`);
  if (article.coverAlt.length > 125) warnings.push(`COVER_ALT is ${article.coverAlt.length} chars (want ≤125)`);

  console.log(`\n── ${post.slug}  (ORDER #${post.idx}, ${article.category}) ──`);
  console.log('  ' + len('TITLE', article.title, 20, 70));
  console.log('  ' + len('META_TITLE', article.metaTitle, 20, 46) + '   (+ " | Saver Miles")');
  console.log('  ' + len('META_DESCRIPTION', article.metaDescription, 120, 160));
  console.log('  ' + len('EXCERPT', article.excerpt, 60, 200));
  console.log(`  COVER_ALT         ${article.coverAlt ? `${article.coverAlt.length}  ${article.coverAlt}` : '(auto from title)'}`);
  console.log(`  cover             ${existsSync(imgPath) ? `${path.basename(imgPath)}  ${Math.round(statSync(imgPath).size / 1024)} KB` : 'MISSING'}`);
  console.log(`  words             ${words}`);
  console.log(`  em dashes         ${emDashes}`);
  console.log('  outline');
  headings.forEach((h) => console.log(h));
  console.log(`  FAQ (${faqs.length} for FAQPage JSON-LD)`);
  faqs.forEach((f) => console.log(`    Q: ${f.question}`));
  if (faqs.length) console.log(`    last answer: ${faqs[faqs.length - 1].answer}`);
  console.log(`  body images       ${images.length}`);
  for (const image of images) {
    const file = path.join(ASSETS, image.file);
    let dims = 'missing';
    let kb = 0;
    if (existsSync(file)) {
      kb = Math.round(statSync(file).size / 1024);
      try {
        const meta = await sharp(file).metadata();
        dims = `${meta.width}×${meta.height}`;
        if ((meta.width ?? 0) < 1200) warnings.push(`${image.file} is only ${meta.width}px wide (want ≥1200)`);
      } catch {
        dims = 'unreadable';
      }
      if (kb > 400) warnings.push(`${image.file} is ${kb} KB (want ≤400 KB)`);
    }
    // Which section it follows, so misplaced images are obvious in the report.
    const before = (content.root.children as { type: string; tag?: string; children?: { text?: string }[] }[])
      .slice(0, (content.root.children as { id?: string }[]).findIndex((n) => n.id === image.nodeId))
      .filter((n) => n.type === 'heading');
    const section = before.length ? (before[before.length - 1].children ?? []).map((c) => c.text ?? '').join('') : '(before the first heading)';
    console.log(`    ${image.file}  ${dims}  ${kb} KB   after "${section}"`);
    console.log(`      alt      ${String(image.alt.length).padStart(3)}  ${image.alt}`);
    if (image.caption) console.log(`      caption  ${String(image.caption.length).padStart(3)}  ${image.caption}`);
    if (image.alt.length > 125) warnings.push(`${image.file} alt is ${image.alt.length} chars (want ≤125)`);
    if ((image.caption?.length ?? 0) > 160) warnings.push(`${image.file} caption is ${image.caption!.length} chars (want ≤160)`);
    if (/frequently asked question/i.test(section)) warnings.push(`${image.file} sits inside the FAQ section`);
  }
  if (images.length && (images.length < 2 || images.length > 3)) {
    warnings.push(`${images.length} body image(s) (house range is 2-3)`);
  }

  console.log(warnings.length ? `  ⚠ ${warnings.join('\n  ⚠ ')}` : '  ✓ no warnings');
}

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;

/** Media ids of the upload nodes already stored on a post, keyed by node id. */
function existingUploads(content: unknown): Map<string, number> {
  const children = (content as { root?: { children?: Record<string, unknown>[] } })?.root?.children;
  const map = new Map<string, number>();
  for (const node of Array.isArray(children) ? children : []) {
    if (node?.type === 'upload' && typeof node.id === 'string' && typeof node.value === 'number') {
      map.set(node.id, node.value);
    }
  }
  return map;
}

/**
 * The media row for one image file, reusing what is already there so a re-run
 * doesn't duplicate uploads or orphan storage objects:
 *  1. the id already on the post (passed in by the caller), unless reseeding;
 *  2. otherwise an existing media row with the same filename, which makes the
 *     seed self-healing if an earlier run died between upload and post write;
 *  3. otherwise a fresh upload.
 * Returns the id to use plus the id it replaced, which the caller deletes only
 * after the post has been written.
 */
async function syncImage(
  payload: PayloadClient,
  opts: { filePath: string; alt: string; existingId?: number; reseed: boolean; label: string },
): Promise<{ id: number; superseded?: number }> {
  const { filePath, alt, existingId, reseed, label } = opts;
  if (existingId && !reseed) return { id: existingId };

  if (!existingId && !reseed) {
    const filename = path.basename(filePath);
    const found = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    });
    const hit = found.docs[0] as { id: number } | undefined;
    if (hit) {
      console.log(`  = reused media ${hit.id} for ${label}`);
      return { id: hit.id };
    }
  }

  const media = await payload.create({ collection: 'media', filePath, data: { alt } });
  const id = media.id as number;
  console.log(`  ↑ uploaded ${label} → media ${id}`);
  return { id, superseded: existingId && existingId !== id ? existingId : undefined };
}

async function main() {
  const selected = loadAndValidate();
  const scope = process.env.ONLY ? `ONLY ${selected.map((p) => p.slug).join(', ')}` : `all ${selected.length} posts`;

  if (process.env.SEED_DRY_RUN === '1' || process.env.SEED_DRY_RUN === 'true') {
    console.log(`SEED_DRY_RUN: ${scope}. Nothing is written; the database is not contacted.`);
    for (const post of selected) await report(post);
    return;
  }

  console.log(`Seeding ${scope} → PRODUCTION database.`);
  const payload = await getPayload({ config });
  const now = Date.now();

  for (const { slug, idx, article, imgPath, content, images } of selected) {
    const catId = await categoryId(payload, article.category);

    const existing = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, depth: 0 });
    const prev = existing.docs[0] as { id: number; coverImage?: number | null; content?: unknown } | undefined;

    // Images (cover and in-body) are normally reused on a re-run. RESEED_COVERS=1
    // re-uploads every image this post owns from source and replaces it; the
    // superseded media is deleted only after the post write succeeds.
    const reseed = process.env.RESEED_COVERS === '1' || process.env.RESEED_COVERS === 'true';
    const staleMedia: number[] = [];

    let coverImage = prev?.coverImage ?? undefined;
    if (existsSync(imgPath)) {
      const cover = await syncImage(payload, {
        filePath: imgPath,
        alt: article.coverAlt || `Editorial photograph for “${article.title}”`,
        existingId: coverImage,
        reseed,
        label: `cover for "${slug}"`,
      });
      coverImage = cover.id;
      if (cover.superseded) staleMedia.push(cover.superseded);
    }

    // Body images: resolve each node's media id, then patch it into the content
    // that parseBody built with a placeholder.
    const priorUploads = existingUploads(prev?.content);
    const usedNodeIds = new Set<string>();
    for (const image of images) {
      const synced = await syncImage(payload, {
        filePath: path.join(ASSETS, image.file),
        alt: image.alt,
        existingId: priorUploads.get(image.nodeId),
        reseed,
        label: `body image ${image.file}`,
      });
      if (synced.superseded) staleMedia.push(synced.superseded);
      usedNodeIds.add(image.nodeId);
      for (const node of content.root.children as Record<string, unknown>[]) {
        if (node.type === 'upload' && node.id === image.nodeId) node.value = synced.id;
      }
    }

    // An image dropped from the markdown leaves its media behind. Only clean up
    // nodes this post owns (ids start with the slug), so anything inserted by
    // hand in /cms is left alone.
    for (const [nodeId, mediaId] of priorUploads) {
      if (!usedNodeIds.has(nodeId) && nodeId.startsWith(`${slug}-`)) staleMedia.push(mediaId);
    }

    const data = {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      category: catId,
      content,
      meta: { title: article.metaTitle, description: article.metaDescription },
      ...(coverImage ? { coverImage } : {}),
      _status: 'published' as const,
    };

    if (prev) {
      await payload.update({ collection: 'posts', id: prev.id, data });
      console.log(`✓ updated "${slug}" (${article.category})`);
      // Now that the post no longer points at them, drop the superseded media.
      for (const mediaId of staleMedia) {
        try {
          await payload.delete({ collection: 'media', id: mediaId });
          console.log(`  ✗ removed superseded media ${mediaId}`);
        } catch (err) {
          console.log(`  ! could not remove media ${mediaId}: ${(err as Error).message}`);
        }
      }
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
