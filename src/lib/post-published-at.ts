/**
 * A published post always carries a `publishedAt`.
 *
 * Publishing from /cms never set it: the field is optional and the admin form
 * sends it empty, so every post published there went live with a NULL date. The
 * blog index sorts `-publishedAt` and Postgres puts NULLs first in a descending
 * sort, so such a post took the featured "Latest" slot ahead of every dated post,
 * and its BlogPosting JSON-LD had no `datePublished`. It happened to two posts in
 * October and again to post 36 in November 2026.
 *
 * Rules, applied on every save:
 * - The post is (or stays) published and has no date: keep the date it already
 *   had, otherwise stamp now. So the first publish dates the post, and clearing
 *   the field on a live post can't blank it.
 * - Drafts and autosaves are left alone, so a draft is dated when it goes live,
 *   not when it was started.
 * - A date set on purpose (backdating, the seed's ordering) is never touched.
 */
export function withPublishedAt<T extends { _status?: string | null; publishedAt?: string | null }>(
  data: T,
  originalDoc?: { _status?: string | null; publishedAt?: string | null } | null,
  now: Date = new Date(),
): T {
  const status = data._status ?? originalDoc?._status;
  if (status !== 'published' || data.publishedAt) return data;
  return { ...data, publishedAt: originalDoc?.publishedAt || now.toISOString() };
}
