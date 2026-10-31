import { LIVE_LOCALES, localizePath } from '@/i18n/config';
import { SITE_URL } from './constants';

/**
 * IndexNow (indexnow.org): tells Bing, Yandex, Naver, Seznam and Yep the moment a
 * URL is added, changed or deleted, instead of waiting for their next crawl.
 * Bing matters most here: ChatGPT search and Copilot draw on its index. Google
 * does not take part (it reads the sitemap).
 *
 * The key is public by design: engines verify it by fetching
 * `/<key>.txt` from `public/`. It is not a secret, so it lives here rather than
 * in env. To rotate it, rename that file and change this constant together.
 *
 * Posts and case studies ping automatically when published or deleted (their
 * collection hooks); `npm run indexnow` sends every sitemap URL by hand.
 */
export const INDEXNOW_KEY = '871b1ee407410ba61f382f4ae960765c';

const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const HOST = new URL(SITE_URL).host;

export type IndexNowResult = { ok: boolean; status?: number; submitted: number; note?: string };

/**
 * Submit URLs of this site. Never throws: a failed ping must not fail a publish.
 * Accepted responses are 200 (ok) and 202 (received, key check pending).
 */
export async function submitToIndexNow(
  urls: string[],
  { timeoutMs = 4000 }: { timeoutMs?: number } = {},
): Promise<IndexNowResult> {
  const urlList = [...new Set(urls)].filter((u) => {
    try {
      return new URL(u).host === HOST;
    } catch {
      return false;
    }
  });
  if (urlList.length === 0) return { ok: true, submitted: 0, note: 'no URLs on this host' };
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    return { ok: res.ok, status: res.status, submitted: urlList.length };
  } catch (err) {
    return { ok: false, submitted: 0, note: err instanceof Error ? err.message : 'request failed' };
  }
}

/**
 * Pings only mean something when the content just written is what the live site
 * serves. Local dev shares the production database, so it counts; a throwaway
 * local Postgres (migration tests) does not. `INDEXNOW_DISABLED=1` turns pings off.
 */
function writesToLiveSite(): boolean {
  const uri = process.env.DATABASE_URI ?? '';
  return Boolean(uri) && !/@(localhost|127\.0\.0\.1)[:/]/.test(uri) && process.env.INDEXNOW_DISABLED !== '1';
}

/** A site path in every live language: `/blog/x` → `…/blog/x`, `…/de/blog/x`. */
function inEveryLanguage(path: string): string[] {
  return LIVE_LOCALES.map((locale) => `${SITE_URL}${localizePath(locale, path)}`);
}

/** Ping the given paths (and their language twins) from a collection hook. */
export async function notifyIndexNow(paths: string[], label: string): Promise<void> {
  if (!writesToLiveSite() || paths.length === 0) return;
  const result = await submitToIndexNow(paths.flatMap(inEveryLanguage));
  if (!result.ok) {
    console.warn(`[indexnow] ${label}: not submitted (${result.status ?? result.note})`);
  }
}
