import 'server-only';

import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { getPayloadClient } from './payload';

/**
 * Which CMS documents really exist in a language.
 *
 * Localized fields (payload.config.ts) fall back to English, so a list page just
 * reads with `locale` and shows English for anything untranslated. A single
 * post or case study needs to know more: with fallback, a half-translated post
 * would put a German title over an English body, and an untranslated one would
 * be indexed as a German page. "Translated" means the document has its own title
 * AND body in that language.
 */

type Localizable = 'posts' | 'testimonials';
const BODY = { posts: 'content', testimonials: 'body' } as const;

type Raw = { id: number | string; slug?: string | null; title?: unknown; content?: unknown; body?: unknown };

const hasOwn = (collection: Localizable, doc: Raw | undefined | null): boolean =>
  Boolean(doc?.title && doc[BODY[collection]]);

/** Does this document have its own `locale` title and body? English always does. */
export async function hasTranslation(
  collection: Localizable,
  id: number | string,
  locale: Locale,
): Promise<boolean> {
  if (locale === DEFAULT_LOCALE) return true;
  try {
    const payload = await getPayloadClient();
    const doc = (await payload.findByID({
      collection,
      id,
      locale,
      fallbackLocale: false,
      depth: 0,
      disableErrors: true,
    })) as Raw | null;
    return hasOwn(collection, doc);
  } catch {
    return false;
  }
}

/** Slugs of the published posts that exist in `locale` — for the sitemap. */
export async function translatedPostSlugs(locale: Locale): Promise<Set<string>> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    locale,
    fallbackLocale: false,
    limit: 1000,
    depth: 0,
  });
  return new Set(
    (docs as Raw[]).filter((d) => hasOwn('posts', d) && d.slug).map((d) => String(d.slug)),
  );
}
