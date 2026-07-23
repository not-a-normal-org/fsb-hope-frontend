/**
 * Flash-free theme init.
 *
 * SSR renders <html data-theme="dark">, so new visitors get the default with no
 * flash even before JS. This runs as a plain, render-blocking <script> in
 * <head> — before first paint — and corrects the attribute for repeat visitors
 * who chose light or mono, so there is no FOUC either.
 *
 * Must be a raw <script>, not next/script: next/script defers, which would let
 * the wrong theme paint first. Keep this in sync with ModeToggle's storage key.
 */
const STORAGE_KEY = 'sm-theme';

export default function ThemeScript() {
  const js = `try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'||t==='mono')document.documentElement.dataset.theme=t;}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
