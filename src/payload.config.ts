import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
let cloudStoragePlugin: any | undefined
let createR2AdapterFactory: any | undefined
try {
  // require at runtime to avoid static bundler resolution errors during Next/Turbopack build
  // plugin may not be present at build-time

  cloudStoragePlugin =
    require('@payloadcms/plugin-cloud-storage')?.cloudStoragePlugin ||
    require('@payloadcms/plugin-cloud-storage')?.default
} catch (e) {
  cloudStoragePlugin = undefined
}

try {
  // local adapter implemented in src/plugins/r2Adapter.ts

  createR2AdapterFactory =
    require('./plugins/r2Adapter').createR2AdapterFactory || require('./plugins/r2Adapter').default
} catch (e) {
  createR2AdapterFactory = undefined
}
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
import { SiteSettings } from './globals/SiteSettings'
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
  globals: [Header, Footer, TranslationSettings, SiteSettings],
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
    // Only use R2 storage when credentials are configured and plugin + adapter are available
    ...(cloudStoragePlugin &&
    createR2AdapterFactory &&
    process.env.R2_BUCKET &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_ENDPOINT
      ? [
          cloudStoragePlugin({
            collections: {
              media: {
                adapter: createR2AdapterFactory({
                  bucket: process.env.R2_BUCKET,
                  endpoint: process.env.R2_ENDPOINT,
                  accessKeyId: process.env.R2_ACCESS_KEY_ID,
                  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
                  customDomain: process.env.R2_CUSTOM_DOMAIN,
                }),
                prefix: 'media',
                disablePayloadAccessControl: true,
              },
            },
          }),
        ]
      : []),
  ],
})
