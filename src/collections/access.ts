import type { Access } from 'payload';

import { hasRole, CMS_CONTENT_ROLES, CMS_ADMIN_ROLES } from '../lib/access';

/**
 * Shared collection access rules that tie the /cms panel to the app's roles.
 * Content collections use these so agents + searchers can edit content but not
 * delete it, and only admins manage Users/settings.
 */

/** World-readable (the public site reads it anyway via the local API); write is
 *  what we gate. For a collection WITH drafts use `publishedOrEditor` instead —
 *  this rule would hand unpublished drafts to anyone who asks the REST API. */
export const publicRead: Access = () => true;

/**
 * Read rule for collections with drafts: content editors see everything, everyone
 * else only what is published. Returning a query (not a boolean) makes Payload
 * apply it to the draft/versions lookup too, so `?draft=true` can't surface a
 * never-published post or the unpublished edits of a live one.
 */
export const publishedOrEditor: Access = ({ req: { user } }) =>
  hasRole(user, CMS_CONTENT_ROLES) ? true : { _status: { equals: 'published' } };

/** Any content editor: admin | agent | searcher. */
export const contentEditor: Access = ({ req: { user } }) => hasRole(user, CMS_CONTENT_ROLES);

/** Admin only. */
export const adminOnly: Access = ({ req: { user } }) => hasRole(user, CMS_ADMIN_ROLES);

/** Standard content-collection access: public read, editors write, admin delete. */
export const contentAccess = {
  read: publicRead,
  create: contentEditor,
  update: contentEditor,
  delete: adminOnly,
} as const;
