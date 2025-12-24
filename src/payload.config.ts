import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [translationPlugin()],
})
