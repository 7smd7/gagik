import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rawEmail = typeof body?.email === 'string' ? body.email : ''
    const email = rawEmail.trim().toLowerCase()
    const locale = typeof body?.locale === 'string' ? body.locale : undefined
    const source = typeof body?.source === 'string' ? body.source : 'contact'

    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required.' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const existing = await payload.find({
      collection: 'subscribers',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (!existing.docs.length) {
      await payload.create({
        collection: 'subscribers',
        data: {
          email,
          locale,
          source,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Subscribe request failed:', error)
    return NextResponse.json({ ok: false, error: 'Internal error.' }, { status: 500 })
  }
}
