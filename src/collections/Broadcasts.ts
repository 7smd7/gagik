import type { CollectionConfig } from 'payload'
import { renderRichTextEmail } from '@/lib/email/renderRichTextEmail'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gagikharutyunyan.com'

export const Broadcasts: CollectionConfig = {
  slug: 'broadcasts',
  labels: {
    singular: 'Broadcast',
    plural: 'Broadcasts',
  },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'locale', 'status', 'sentAt', 'createdAt'],
    group: 'Marketing',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'from',
      type: 'email',
      required: false,
      admin: {
        description: 'Optional. Leave empty to use RESEND_FROM (must be verified in Resend).',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'locale',
      type: 'select',
      required: false,
      options: [
        { label: 'All', value: 'all' },
        { label: 'English', value: 'en' },
        { label: 'Armenian', value: 'hy' },
        { label: 'Russian', value: 'ru' },
      ],
      defaultValue: 'all',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'sendNow',
      type: 'checkbox',
      label: 'Send now',
      defaultValue: false,
      admin: {
        description: 'Check and save to send this broadcast to all subscribers.',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'draft',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'sentCount',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'failedCount',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'error',
      type: 'textarea',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (req?.context?.skipBroadcastSend) return
        if (!doc.sendNow || previousDoc?.sendNow) return

        const payload = req.payload
        const rawLocale = doc.locale && doc.locale !== 'all' ? doc.locale : undefined

        const subscribers = await payload.find({
          collection: 'subscribers',
          where: rawLocale ? { locale: { equals: rawLocale } } : undefined,
          limit: 1000,
          overrideAccess: true,
        })

        if (!subscribers.docs.length) {
          await payload.update({
            collection: 'broadcasts',
            id: doc.id,
            data: {
              status: 'failed',
              error: 'No subscribers found.',
              sendNow: false,
            },
            overrideAccess: true,
            req: {
              ...req,
              context: { ...req.context, skipBroadcastSend: true },
            },
          })
          return
        }

        const baseHtml = renderRichTextEmail(doc.content)
        const from = doc.from || undefined

        const results = await Promise.all(
          subscribers.docs.map(async (subscriber) => {
            try {
              const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(
                subscriber.email,
              )}`
              const footerHtml = `
                <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e5e7eb;" />
                <p style="margin: 0 0 8px; font-size: 12px; color: #6b7280;">You received this email because you subscribed to updates.</p>
                <p style="margin: 0; font-size: 12px;"><a href="${unsubscribeUrl}" style="color: #111827;">Unsubscribe</a></p>
              `

              await payload.sendEmail({
                to: subscriber.email,
                subject: doc.subject,
                html: `${baseHtml}${footerHtml}`,
                ...(from ? { from } : {}),
              })

              return { ok: true }
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Send failed.'
              return { ok: false, error: message }
            }
          }),
        )

        const sentCount = results.filter((result) => result.ok).length
        const failedCount = results.length - sentCount
        const lastError = results.find((result) => !result.ok)?.error || ''
        const status = failedCount > 0 ? 'failed' : 'sent'

        await payload.update({
          collection: 'broadcasts',
          id: doc.id,
          data: {
            status,
            sentAt: new Date().toISOString(),
            sentCount,
            failedCount,
            error: lastError || undefined,
            sendNow: false,
          },
          overrideAccess: true,
          req: {
            ...req,
            context: { ...req.context, skipBroadcastSend: true },
          },
        })
      },
    ],
  },
}

export default Broadcasts
