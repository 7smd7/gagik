import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const runtime = 'edge'
export const alt = 'Gagik Harutyunyan'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: _local } = await params
  const locale = _local === 'am' ? 'hy' : _local
  const payload = await getPayload({ config: configPromise })

  const localeCode = locale as 'en' | 'hy' | 'ru'

  // Fetch home page to get the title
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    locale: localeCode,
    limit: 1,
  })

  const page = pages.docs[0]
  const title = page?.title || 'GAGIK HARUTYUNYAN'

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
