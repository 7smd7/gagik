import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/plugin-cloud-storage/s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Works } from './collections/Works'
import { Series } from './collections/Series'
import { Press } from './collections/Press'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'
import { TranslationSettings } from './globals/TranslationSettings'
import { translationPlugin } from './plugins/translationPlugin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Armenian',
        code: 'hy',
      },
      {
        label: 'Russian',
        code: 'ru',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [Users, Media, Pages, Works, Series, Press],
  globals: [Header, Footer, TranslationSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI ||
        `postgres://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.POSTGRES_HOST || 'postgres'}:${process.env.POSTGRES_PORT || '5432'}/${process.env.POSTGRES_DB || 'gagik'}`,
    },
  }),
  sharp,
  plugins: [
    translationPlugin(),
    // Only use R2 storage when credentials are configured
    ...(process.env.R2_BUCKET &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_ENDPOINT
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
              },
            },
            bucket: process.env.R2_BUCKET,
            config: {
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
              },
              region: 'auto',
              endpoint: process.env.R2_ENDPOINT,
            },
          }),
        ]
      : []),
  ],
})
