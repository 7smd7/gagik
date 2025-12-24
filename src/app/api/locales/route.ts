import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    const settings = await payload.findGlobal({
      slug: 'translation-settings',
    })

    const locales = []

    // Only show locales that have "Show in Frontend" enabled
    if (settings?.showEnglish !== false) {
      locales.push({ code: 'en', label: 'EN', name: 'English' })
    }

    if (settings?.showArmenian !== false) {
      locales.push({ code: 'hy', label: 'HY', name: 'Armenian' })
    }

    if (settings?.showRussian !== false) {
      locales.push({ code: 'ru', label: 'RU', name: 'Russian' })
    }

    return NextResponse.json({ locales })
  } catch (error) {
    console.error('Failed to fetch enabled locales:', error)

    // Fallback to all locales if settings fetch fails
    return NextResponse.json({
      locales: [
        { code: 'en', label: 'EN', name: 'English' },
        { code: 'hy', label: 'HY', name: 'Armenian' },
        { code: 'ru', label: 'RU', name: 'Russian' },
      ],
    })
  }
}
