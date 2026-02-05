import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Example newsletter endpoint.
 * Call this from admin panel or automation to send newsletters.
 *
 * POST /api/newsletter
 * Body: {
 *   subject: string,
 *   html: string,
 *   locale?: 'en' | 'hy' | 'ru'
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subject, html, locale } = body

    if (!subject || !html) {
      return NextResponse.json(
        { ok: false, error: 'Subject and HTML content are required.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })

    // Fetch all subscribers (optionally filter by locale)
    const where = locale ? { locale: { equals: locale } } : {}
    const subscribers = await payload.find({
      collection: 'subscribers',
      where,
      limit: 1000,
      overrideAccess: true,
    })

    if (!subscribers.docs.length) {
      return NextResponse.json({ ok: false, error: 'No subscribers found.' }, { status: 404 })
    }

    // Send emails via Resend (through Payload's email adapter)
    const results = await Promise.allSettled(
      subscribers.docs.map(async (subscriber) => {
        try {
          await payload.sendEmail({
            to: subscriber.email,
            subject,
            html,
          })
          return { email: subscriber.email, status: 'sent' }
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error)
          return { email: subscriber.email, status: 'failed', error }
        }
      }),
    )

    const sent = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      total: subscribers.docs.length,
    })
  } catch (error) {
    console.error('Newsletter send failed:', error)
    return NextResponse.json({ ok: false, error: 'Internal error.' }, { status: 500 })
  }
}
