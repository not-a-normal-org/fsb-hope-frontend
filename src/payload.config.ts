import path from 'path';
import { fileURLToPath } from 'url';

import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { seoPlugin } from '@payloadcms/plugin-seo';
import type { GenerateTitle, GenerateDescription } from '@payloadcms/plugin-seo/types';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Categories } from './collections/Categories';
import { Posts } from './collections/Posts';
import { DealsOfWeek } from './collections/DealsOfWeek';
import { Testimonials } from './collections/Testimonials';
import { resolveDatabaseUri } from './lib/database-uri';
import { DEFAULT_LOCALE, LOCALES } from './i18n/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// SEO plugin auto-fills a post's meta from its own fields (authors can override).
const generateTitle: GenerateTitle = ({ doc }) =>
  doc?.title ? `${doc.title} | Saver Miles` : 'Saver Miles';
const generateDescription: GenerateDescription = ({ doc }) => doc?.excerpt ?? '';

// Supabase Storage S3 endpoint (public `media` bucket). Keys come from env — a
// separate credential from the API keys / DB password (Supabase → Storage → S3
// Access Keys). Without them, uploads fail at runtime but config/build are fine.
const SUPABASE_S3_ENDPOINT = 'https://xodffpwxvzuylhoyivih.storage.supabase.co/storage/v1/s3';
const SUPABASE_REGION = 'us-west-1';

/**
 * Payload CMS config (docs/plans/06). The admin + API are mounted at CUSTOM
 * paths — `/cms` and `/cms-api` — because Payload's defaults (`/admin`, `/api`)
 * collide with this app's existing admin portal and API route handlers.
 *
 * The Postgres adapter points at the SAME Supabase database as the app, tables
 * isolated in a dedicated `payload` schema. It needs a Postgres string in
 * DATABASE_URI (Supabase TRANSACTION pooler, port 6543 — a SEPARATE credential
 * from the API keys). Media uploads go to Supabase Storage (public `media` bucket) via the
 * s3Storage plugin; the `posts` collection gets a SEO "Meta" tab. All in
 * `.env.local`: DATABASE_URI, PAYLOAD_SECRET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY.
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
  // Content in each site language (docs/plans/02 → Languages). Fields marked
  // `localized: true` keep one value per locale in a `*_locales` table; the rest
  // (slugs, dates, relations, numbers) are shared. A missing German value falls
  // back to English, so an untranslated post still renders.
  localization: {
    locales: LOCALES.map((code) => ({ code, label: code === 'de' ? 'Deutsch' : 'English' })),
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    // DATABASE_URI MUST be the Supabase TRANSACTION pooler (port 6543): it
    // multiplexes the many short-lived connections Vercel's serverless functions
    // open. The SESSION pooler (5432) is capped (pool_size 15) and throws
    // EMAXCONNSESSION under load — a 500 on /cms and "Login failed" on /admin.
    // That string has reached production twice, so in production
    // resolveDatabaseUri() moves a session-pooler URI onto 6543 rather than
    // trusting the env var.
    // (Don't cap `max` to 1 here — Payload nests connection use, so a 1-connection
    // pool deadlocks; the transaction pooler is what bounds total connections.)
    pool: {
      connectionString: resolveDatabaseUri(process.env.DATABASE_URI || ''),
      idleTimeoutMillis: 30_000,
    },
    // Isolate Payload's tables from the app's `public` schema.
    schemaName: 'payload',
    // Schema changes go through migrations (src/migrations), never dev push.
    // Dev runs against the production database, so a push there is a live
    // schema change with no review — and a localized field moving into a
    // `*_locales` table would be a DROP COLUMN. See docs/cms-migrations.md.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  plugins: [
    // Media -> Supabase Storage (public `media` bucket), all image sizes.
    s3Storage({
      collections: { media: true },
      bucket: 'media',
      config: {
        endpoint: SUPABASE_S3_ENDPOINT,
        region: SUPABASE_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
      },
    }),
    // Per-post "Meta" tab (title / description / image) with auto-fill.
    seoPlugin({
      collections: ['posts'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle,
      generateDescription,
    }),
  ],
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
