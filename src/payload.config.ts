import path from 'path';
import { fileURLToPath } from 'url';

import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Categories } from './collections/Categories';
import { Posts } from './collections/Posts';
import { DealsOfWeek } from './collections/DealsOfWeek';
import { Testimonials } from './collections/Testimonials';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Payload CMS config (docs/plans/06). The admin + API are mounted at CUSTOM
 * paths — `/cms` and `/cms-api` — because Payload's defaults (`/admin`, `/api`)
 * collide with this app's existing admin portal and API route handlers.
 *
 * The Postgres adapter points at the SAME Supabase database as the app, but its
 * tables live in a dedicated `payload` schema so they can't collide with the
 * app's `public`-schema tables (customers, orders, …). It needs a direct
 * Postgres connection string in DATABASE_URI — a SEPARATE credential from the
 * Supabase API keys (Supabase → Settings → Database → Connection string).
 *
 * NOTE: the App Router integration (route-group restructure, withPayload) and
 * the first boot/migration are a follow-up step, gated on DATABASE_URI being
 * set. This config is the schema-as-code half.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
  },
  routes: {
    admin: '/cms',
    api: '/cms-api',
  },
  collections: [Users, Media, Posts, Categories, DealsOfWeek, Testimonials],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // Isolate Payload's tables from the app's `public` schema.
    schemaName: 'payload',
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
