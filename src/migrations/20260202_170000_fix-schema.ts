import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_type t
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public' AND t.typname = 'enum_site_settings_social_links_platform'
    ) THEN
      CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM(
        'instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok', 'other'
      );
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_type t
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public' AND t.typname = 'enum_site_settings_organization_type'
    ) THEN
      CREATE TYPE "public"."enum_site_settings_organization_type" AS ENUM(
        'Person', 'Organization', 'LocalBusiness'
      );
    END IF;
  END $$;

  CREATE TABLE IF NOT EXISTS "site_settings" (
    "id" serial PRIMARY KEY NOT NULL,
    "site_url" varchar DEFAULT 'https://gagikharutyunyan.com' NOT NULL,
    "default_og_image_id" integer,
    "twitter_handle" varchar,
    "clarity_id" varchar,
    "google_analytics_id" varchar,
    "custom_scripts" varchar,
    "organization_type" "enum_site_settings_organization_type" DEFAULT 'Person',
    "email" varchar,
    "updated_at" timestamp(3) with time zone,
    "created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "site_settings_locales" (
    "site_name" varchar DEFAULT 'Gagik Harutyunyan' NOT NULL,
    "site_description" varchar DEFAULT 'Explore the works and artistic journey of Gagik Harutyunyan.' NOT NULL,
    "job_title" varchar,
    "id" serial PRIMARY KEY NOT NULL,
    "_locale" "_locales" NOT NULL,
    "_parent_id" integer NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "site_settings_social_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "platform" "enum_site_settings_social_links_platform",
    "url" varchar
  );

  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "seo_og_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "seo_no_index" boolean DEFAULT false;

  ALTER TABLE "pages_locales" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar;
  ALTER TABLE "pages_locales" ADD COLUMN IF NOT EXISTS "seo_meta_keywords" varchar;

  ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_og_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_seo_no_index" boolean DEFAULT false;

  ALTER TABLE "_pages_v_locales" ADD COLUMN IF NOT EXISTS "version_seo_meta_title" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN IF NOT EXISTS "version_seo_meta_description" varchar;
  ALTER TABLE "_pages_v_locales" ADD COLUMN IF NOT EXISTS "version_seo_meta_keywords" varchar;

  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_default_og_image_id_media_id_fk') THEN
      ALTER TABLE "site_settings"
        ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk"
        FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_locales_parent_id_fk') THEN
      ALTER TABLE "site_settings_locales"
        ADD CONSTRAINT "site_settings_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_social_links_parent_id_fk') THEN
      ALTER TABLE "site_settings_social_links"
        ADD CONSTRAINT "site_settings_social_links_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id")
        ON DELETE cascade ON UPDATE no action;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_seo_og_image_id_media_id_fk') THEN
      ALTER TABLE "pages"
        ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk"
        FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_pages_v_version_seo_og_image_id_media_id_fk') THEN
      ALTER TABLE "_pages_v"
        ADD CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk"
        FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    END IF;
  END $$;

  CREATE INDEX IF NOT EXISTS "site_settings_social_links_order_idx"
    ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_settings_social_links_parent_id_idx"
    ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "site_settings_default_og_image_idx"
    ON "site_settings" USING btree ("default_og_image_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "site_settings_locales_locale_parent_id_unique"
    ON "site_settings_locales" USING btree ("_locale","_parent_id");

  CREATE INDEX IF NOT EXISTS "pages_seo_og_image_id_idx"
    ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_version_seo_og_image_id_idx"
    ON "_pages_v" USING btree ("version_seo_og_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Intentionally left as no-op to avoid destructive changes.
  `)
}
