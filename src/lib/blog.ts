/**
 * Blog index helpers — public media URLs, reading-time estimate, date format,
 * and the lightweight card shape the server page hands to the client grid.
 */

const MEDIA_PUBLIC_BASE =
  'https://xodffpwxvzuylhoyivih.supabase.co/storage/v1/object/public/media/';

/**
 * Public CDN URL for a file in the Supabase `media` bucket. Uploads link
 * straight to the public bucket instead of Payload's `/cms-api/media/...`
 * route (which the construction wall gates), so `next/image` can fetch them
 * server-side both behind the wall and after launch.
 */
export function mediaPublicUrl(filename?: string | null): string | null {
  return filename ? MEDIA_PUBLIC_BASE + filename : null;
}

type LexicalNode = { text?: string; children?: LexicalNode[]; root?: LexicalNode };

function lexicalToText(node?: LexicalNode | null): string {
  if (!node) return '';
  if (node.root) return lexicalToText(node.root);
  const own = typeof node.text === 'string' ? `${node.text} ` : '';
  const kids = Array.isArray(node.children) ? node.children.map(lexicalToText).join(' ') : '';
  return own + kids;
}

/** ~200-wpm reading estimate from a post's Lexical content. Always ≥ 1. */
export function readingMinutes(content: unknown): number {
  const words = lexicalToText(content as LexicalNode)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(value?: string | null): string | null {
  if (!value) return null;
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** What the client grid renders — kept small so we don't ship full content. */
export type BlogCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  readingMinutes: number;
  cover: { url: string; alt: string } | null;
  category: { name: string; slug: string } | null;
};

type MediaDoc = { alt?: string; filename?: string; sizes?: { card?: { filename?: string } } };
type CategoryDoc = { name?: string; slug?: string };
type PostDoc = {
  id: string | number;
  title?: unknown;
  slug?: unknown;
  excerpt?: unknown;
  publishedAt?: unknown;
  content?: unknown;
  coverImage?: unknown;
  category?: unknown;
};

/**
 * Map a Payload `posts` doc (loaded with `depth: 1`) to the small card shape
 * the client grid consumes. Shared by the blog index and category pages so the
 * two stay in lockstep. Cover images resolve to the public Supabase URL (the
 * 768w "card" render when available) rather than the wall-gated /cms-api route.
 */
export function toBlogCard(doc: PostDoc): BlogCard {
  const media = typeof doc.coverImage === 'object' && doc.coverImage ? (doc.coverImage as MediaDoc) : null;
  const cat = typeof doc.category === 'object' && doc.category ? (doc.category as CategoryDoc) : null;
  const coverUrl = mediaPublicUrl(media?.sizes?.card?.filename ?? media?.filename ?? null);
  return {
    id: String(doc.id),
    title: String(doc.title ?? ''),
    slug: String(doc.slug ?? ''),
    excerpt: (doc.excerpt as string | undefined) ?? null,
    publishedAt: (doc.publishedAt as string | undefined) ?? null,
    readingMinutes: readingMinutes(doc.content),
    cover: coverUrl ? { url: coverUrl, alt: media?.alt || String(doc.title ?? '') } : null,
    category: cat?.name && cat?.slug ? { name: cat.name, slug: cat.slug } : null,
  };
}
