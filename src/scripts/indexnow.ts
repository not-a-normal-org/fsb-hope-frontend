/**
 * Submit URLs to IndexNow by hand (Bing, Yandex, Naver, Seznam, Yep; not Google).
 * Posts and case studies already ping on publish (their collection hooks), so
 * use this for everything else:
 *
 *   npm run indexnow                        every URL in the live sitemap: after a
 *                                           deploy that changed pages, or once to start
 *   URLS=https://…/a,https://…/b npm run indexnow   just these
 *   INDEXNOW_DRY_RUN=1 npm run indexnow     print what would be sent, send nothing
 *
 * Don't resubmit the whole sitemap when nothing changed: engines count every
 * submitted URL against the crawl budget they give the site.
 */
import { SITE_URL } from '@/lib/constants';
import { submitToIndexNow } from '@/lib/indexnow';

async function main(): Promise<number> {
  let urls = (process.env.URLS ?? '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);
  if (urls.length === 0) {
    const res = await fetch(`${SITE_URL}/sitemap.xml`);
    if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
    urls = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  }
  console.log(`IndexNow: ${urls.length} URL(s) on ${SITE_URL}`);
  if (process.env.INDEXNOW_DRY_RUN === '1') {
    for (const u of urls) console.log(`  ${u}`);
    console.log('INDEXNOW_DRY_RUN: nothing sent.');
    return 0;
  }
  const result = await submitToIndexNow(urls, { timeoutMs: 30_000 });
  console.log(result.ok ? `✓ accepted (HTTP ${result.status}), ${result.submitted} URL(s)` : `✗ not accepted: ${result.status ?? result.note}`);
  return result.ok ? 0 : 1;
}

try {
  process.exit(await main());
} catch (err) {
  console.error('IndexNow submit failed:', err);
  process.exit(1);
}
