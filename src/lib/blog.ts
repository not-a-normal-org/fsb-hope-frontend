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
