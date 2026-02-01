import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Gagik Harutyunyan'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Edge-compatible OG image generator. Provide `title` as a query param.
export default function Image(req: Request) {
  const url = new URL(req.url)
  const title = url.searchParams.get('title') || 'Gagik Harutyunyan'

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
