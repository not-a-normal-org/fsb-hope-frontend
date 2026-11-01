/**
 * Pre-paint consent flag, the ConsentBanner's counterpart to ThemeScript.
 *
 * The banner is in the server HTML so a first-time visitor sees it with the first
 * paint, not after hydration (rendered late, its paragraph became the page's LCP).
 * For a visitor who has already chosen, this marks <html data-consent> before
 * first paint, and CSS (`.sm-consent` in globals.css) hides the banner, so it
 * never flashes.
 *
 * Must be a raw <script> in <head>, not next/script (which defers). Keep the key
 * in sync with ConsentBanner's STORAGE_KEY.
 */
const STORAGE_KEY = 'sm-consent';

export default function ConsentScript() {
  const js = `try{var c=localStorage.getItem('${STORAGE_KEY}');if(c==='granted'||c==='denied')document.documentElement.dataset.consent=c;}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
