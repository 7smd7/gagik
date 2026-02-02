import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const runtime = 'nodejs'
export const alt = 'Gagik Harutyunyan'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// OG image generator. Provide `title` as a query param.
export default async function Image({
  params,
  searchParams,
}: {
  params: { locale?: string }
  searchParams?: { title?: string }
}) {
  const title = searchParams?.title || 'Gagik Harutyunyan'

  // Try to redirect to the Site Settings default OG image if set
  try {
    const locale = params?.locale === 'am' ? 'hy' : params?.locale

    const payload = await getPayload({ config: configPromise })
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      locale: (locale || 'en') as 'en' | 'hy' | 'ru',
      depth: 1,
    })

    const maybeDefaultOg = (siteSettings as any)?.defaultOgImage
    if (maybeDefaultOg && typeof maybeDefaultOg === 'object' && maybeDefaultOg.url) {
      return Response.redirect(maybeDefaultOg.url, 302)
    }

    if (typeof maybeDefaultOg === 'string' || typeof maybeDefaultOg === 'number') {
      const mediaDoc = await payload.findByID({
        collection: 'media',
        id: maybeDefaultOg,
      })
      if (mediaDoc && typeof mediaDoc === 'object' && (mediaDoc as any).url) {
        return Response.redirect((mediaDoc as any).url, 302)
      }
    }
  } catch {
    // ignore and fall back to dynamic image
  }

  return new ImageResponse(
    <div
      style={{
        fontSize: 80,
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        <div
          style={{
            fontSize: 32,
            color: '#888',
            marginTop: 20,
            letterSpacing: '0.05em',
          }}
        >
          ARTIST
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          fontSize: 20,
          color: '#666',
        }}
      >
        gagikharutyunyan.com
      </div>
    </div>,
    {
      ...size,
    },
  )
}
