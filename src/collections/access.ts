import type { Access } from 'payload';

import { hasRole, CMS_CONTENT_ROLES, CMS_ADMIN_ROLES } from '../lib/access';

/**
 * Shared collection access rules that tie the /cms panel to the app's roles.
 * Content collections use these so agents + searchers can edit content but not
 * delete it, and only admins manage Users/settings.
 */

/** Published content is world-readable (the public site reads it anyway via the
 *  local API); write is what we gate. */
export const publicRead: Access = () => true;

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
