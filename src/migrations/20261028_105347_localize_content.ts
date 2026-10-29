import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Turns on per-language content (Payload localization, en + de).
 *
 * Localized fields move from their collection table into a `<table>_locales`
 * table keyed by (_locale, _parent_id). This migration copies every existing
 * value into the new tables as English BEFORE dropping the old columns — the
 * generator emits only the create and the drop. Payload runs a migration in a
 * transaction, so a failure part-way leaves the schema untouched.
 *
 * Runbook (production): docs/cms-migrations.md.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Generated: the *_locales tables, their keys and indexes, and the two new
  //    version columns. Additive only.
  await db.execute(sql`
   CREATE TYPE "payload"."_locales" AS ENUM('en', 'de');
  CREATE TYPE "payload"."enum__posts_v_published_locale" AS ENUM('en', 'de');
  CREATE TABLE "payload"."media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload"."testimonials_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb,
  	"quote" varchar,
  	"attribution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "payload"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload"."posts" DROP CONSTRAINT "posts_meta_image_id_media_id_fk";
  
  ALTER TABLE "payload"."_posts_v" DROP CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk";
  
  DROP INDEX "payload"."posts_meta_meta_image_idx";
  DROP INDEX "payload"."_posts_v_version_meta_version_meta_image_idx";
  ALTER TABLE "payload"."_posts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "payload"."_posts_v" ADD COLUMN "published_locale" "payload"."enum__posts_v_published_locale";
  ALTER TABLE "payload"."media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "payload"."media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "payload"."posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "payload"."posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "payload"."_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "payload"."_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "payload"."categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "payload"."testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_snapshot_idx" ON "payload"."_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "payload"."_posts_v" USING btree ("published_locale");`)

  // 2. Hand-written: copy every current value into the new tables as English.
  //    The generator only creates the tables and then drops the old columns,
  //    which on its own would delete every title, body, category name and alt
  //    text. Rows whose old value is NULL are skipped where the locale column is
  //    NOT NULL (a missing locale row reads back as null, the same as before).
  await db.execute(sql`
  INSERT INTO "payload"."media_locales" ("alt", "_locale", "_parent_id")
    SELECT "alt", 'en', "id" FROM "payload"."media" WHERE "alt" IS NOT NULL;
  INSERT INTO "payload"."posts_locales"
      ("title", "excerpt", "content", "meta_title", "meta_description", "meta_image_id", "_locale", "_parent_id")
    SELECT "title", "excerpt", "content", "meta_title", "meta_description", "meta_image_id", 'en', "id"
    FROM "payload"."posts";
  INSERT INTO "payload"."_posts_v_locales"
      ("version_title", "version_excerpt", "version_content", "version_meta_title",
       "version_meta_description", "version_meta_image_id", "_locale", "_parent_id")
    SELECT "version_title", "version_excerpt", "version_content", "version_meta_title",
       "version_meta_description", "version_meta_image_id", 'en', "id"
    FROM "payload"."_posts_v";
  INSERT INTO "payload"."categories_locales" ("name", "_locale", "_parent_id")
    SELECT "name", 'en', "id" FROM "payload"."categories" WHERE "name" IS NOT NULL;
  INSERT INTO "payload"."testimonials_locales" ("title", "body", "quote", "attribution", "_locale", "_parent_id")
    SELECT "title", "body", "quote", "attribution", 'en', "id"
    FROM "payload"."testimonials" WHERE "title" IS NOT NULL;`)

  // 3. Generated: drop the old single-language columns, now copied.
  await db.execute(sql`
  ALTER TABLE "payload"."media" DROP COLUMN "alt";
  ALTER TABLE "payload"."posts" DROP COLUMN "title";
  ALTER TABLE "payload"."posts" DROP COLUMN "excerpt";
  ALTER TABLE "payload"."posts" DROP COLUMN "content";
  ALTER TABLE "payload"."posts" DROP COLUMN "meta_title";
  ALTER TABLE "payload"."posts" DROP COLUMN "meta_description";
  ALTER TABLE "payload"."posts" DROP COLUMN "meta_image_id";
  ALTER TABLE "payload"."_posts_v" DROP COLUMN "version_title";
  ALTER TABLE "payload"."_posts_v" DROP COLUMN "version_excerpt";
  ALTER TABLE "payload"."_posts_v" DROP COLUMN "version_content";
  ALTER TABLE "payload"."_posts_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "payload"."_posts_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "payload"."_posts_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "payload"."categories" DROP COLUMN "name";
  ALTER TABLE "payload"."testimonials" DROP COLUMN "title";
  ALTER TABLE "payload"."testimonials" DROP COLUMN "body";
  ALTER TABLE "payload"."testimonials" DROP COLUMN "quote";
  ALTER TABLE "payload"."testimonials" DROP COLUMN "attribution";`)
}

/**
 * Back to single-language columns, keeping the English values. German content
 * is lost on the way down (there is nowhere to keep it). The generated version
 * re-added NOT NULL columns to tables that already have rows, which fails, so
 * the columns are added nullable, filled from English, then tightened.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload"."media" ADD COLUMN "alt" varchar;
  ALTER TABLE "payload"."posts" ADD COLUMN "title" varchar;
  ALTER TABLE "payload"."posts" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "payload"."posts" ADD COLUMN "content" jsonb;
  ALTER TABLE "payload"."posts" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "payload"."posts" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "payload"."posts" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "payload"."_posts_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "payload"."_posts_v" ADD COLUMN "version_excerpt" varchar;
  ALTER TABLE "payload"."_posts_v" ADD COLUMN "version_content" jsonb;
  ALTER TABLE "payload"."_posts_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "payload"."_posts_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "payload"."_posts_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "payload"."categories" ADD COLUMN "name" varchar;
  ALTER TABLE "payload"."testimonials" ADD COLUMN "title" varchar;
  ALTER TABLE "payload"."testimonials" ADD COLUMN "body" jsonb;
  ALTER TABLE "payload"."testimonials" ADD COLUMN "quote" varchar;
  ALTER TABLE "payload"."testimonials" ADD COLUMN "attribution" varchar;

  UPDATE "payload"."media" t SET "alt" = l."alt"
    FROM "payload"."media_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "payload"."posts" t SET "title" = l."title", "excerpt" = l."excerpt", "content" = l."content",
      "meta_title" = l."meta_title", "meta_description" = l."meta_description", "meta_image_id" = l."meta_image_id"
    FROM "payload"."posts_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "payload"."_posts_v" t SET "version_title" = l."version_title", "version_excerpt" = l."version_excerpt",
      "version_content" = l."version_content", "version_meta_title" = l."version_meta_title",
      "version_meta_description" = l."version_meta_description", "version_meta_image_id" = l."version_meta_image_id"
    FROM "payload"."_posts_v_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "payload"."categories" t SET "name" = l."name"
    FROM "payload"."categories_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "payload"."testimonials" t SET "title" = l."title", "body" = l."body", "quote" = l."quote",
      "attribution" = l."attribution"
    FROM "payload"."testimonials_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';

  ALTER TABLE "payload"."media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "payload"."categories" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "payload"."testimonials" ALTER COLUMN "title" SET NOT NULL;

  DROP TABLE "payload"."media_locales" CASCADE;
  DROP TABLE "payload"."posts_locales" CASCADE;
  DROP TABLE "payload"."_posts_v_locales" CASCADE;
  DROP TABLE "payload"."categories_locales" CASCADE;
  DROP TABLE "payload"."testimonials_locales" CASCADE;
  DROP INDEX "payload"."_posts_v_snapshot_idx";
  DROP INDEX "payload"."_posts_v_published_locale_idx";
  ALTER TABLE "payload"."posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_meta_meta_image_idx" ON "payload"."posts" USING btree ("meta_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "payload"."_posts_v" USING btree ("version_meta_image_id");
  ALTER TABLE "payload"."_posts_v" DROP COLUMN "snapshot";
  ALTER TABLE "payload"."_posts_v" DROP COLUMN "published_locale";
  DROP TYPE "payload"."_locales";
  DROP TYPE "payload"."enum__posts_v_published_locale";`)
}
