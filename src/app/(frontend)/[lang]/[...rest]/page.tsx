import { notFound } from 'next/navigation';

/**
 * Catch-all for URLs no public page matches. The root layout sits under `[lang]`,
 * so an unmatched path would otherwise miss the localized not-found boundary;
 * calling notFound() here renders `[lang]/not-found.tsx` with a 404 status.
 */
export default function UnknownPage() {
  notFound();
}
