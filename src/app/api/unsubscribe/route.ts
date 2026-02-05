import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rawEmail = typeof body?.email === 'string' ? body.email : ''
    const email = rawEmail.trim().toLowerCase()

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
      overrideAccess: true,
    })

    if (existing.docs.length) {
      await payload.delete({
        collection: 'subscribers',
        id: existing.docs[0].id,
        overrideAccess: true,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Unsubscribe request failed:', error)
    return NextResponse.json({ ok: false, error: 'Internal error.' }, { status: 500 })
  }
}
