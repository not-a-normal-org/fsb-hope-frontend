/* ========== SITE METADATA ========== */

export const SITE_NAME = "Saver Miles";
// Human-first positioning: the differentiator is that a real specialist does the
// searching (docs/plans/00-context.md), so the tagline says exactly that. The
// previous "AI era" line contradicted that pitch and is retired.
export const SITE_TAGLINE = "Award flights found by a real specialist, not an algorithm";
// Canonical host is www — the apex 308-redirects there — so every canonical,
// OpenGraph URL, sitemap entry, JSON-LD, and RSS link must use www to avoid an
// SEO split across two hostnames.
export const SITE_URL = "https://www.savermiles.com";

/* ========== LEGAL ENTITY / CONTACT ========== */
// The single source of truth for the registered entity, mailing address, and
// contact email. Reused by the legal pages and every transactional email so the
// company identity can never drift between them again.
export const SITE_LEGAL_NAME = "Saver Miles LLC";
export const SITE_EMAIL = "hello@savermiles.com";
export const SITE_ADDRESS_LINES = ["30 N Gould St Ste N", "Sheridan, Wyoming 82801"];
export const SITE_ADDRESS_INLINE = "30 N Gould St Ste N, Sheridan, WY 82801";
