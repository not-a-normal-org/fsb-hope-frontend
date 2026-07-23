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
 * isolated in a dedicated `payload` schema. It needs a direct Postgres string in
 * DATABASE_URI (Supabase Session pooler — a SEPARATE credential from the API
 * keys). Media uploads go to Supabase Storage (public `media` bucket) via the
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
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // Isolate Payload's tables from the app's `public` schema.
    schemaName: 'payload',
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
