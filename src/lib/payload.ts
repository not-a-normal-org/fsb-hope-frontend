import 'server-only';

import { getPayload } from 'payload';
import config from '@payload-config';

/**
 * Payload local API (in-process, no HTTP) for server components — reading blog
 * posts, deals, testimonials from the CMS. `getPayload` caches the instance by
 * config, so this is cheap to call per request.
 *
 * Pages that use this must be dynamic (`export const dynamic = 'force-dynamic'`)
 * so they query at request time, not at build — the build stays DB-independent.
 */
export const getPayloadClient = () => getPayload({ config });
