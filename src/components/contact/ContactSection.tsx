'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { getTranslations } from '@/lib/translations'

interface ContactSectionProps {
  locale: string
}

export default function ContactSection({ locale }: ContactSectionProps) {
  const t = getTranslations(locale)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const titleInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = email.trim()
    if (!value) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: value, locale, source: 'contact' }),
      })

      if (!response.ok) {
        throw new Error('Subscribe failed')
      }

      setSubmitted(true)
    } catch (_) {
      setError(t.contactError)
      setSubmitted(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="Contact"
      ref={sectionRef}
      className="relative bg-white py-20 md:py-28 px-6 md:px-8 lg:px-16"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12"
        >
          <motion.span
            className="block max-w-full text-2xl sm:text-3xl font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/40 font-bold wrap-break-word leading-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t.contact}
          </motion.span>
          <motion.div
            className="w-20 h-px bg-black/20 mt-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] items-start">
          <div>
            <p className="text-sm font-sans uppercase tracking-[0.25em] text-black/40 mb-3">
              {t.contactSubtitle}
            </p>
            <p className="text-base md:text-lg text-black/70 leading-relaxed">
              {t.contactDescription}
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4 bg-black/5 rounded-2xl p-6">
            <label className="text-xs font-sans uppercase tracking-[0.2em] text-black/60">
              {t.emailPlaceholder}
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setSubmitted(false)
                setError(null)
              }}
              placeholder={t.emailPlaceholder}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black/80 focus:outline-none focus:ring-2 focus:ring-black/20"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-black py-3 text-xs font-sans uppercase tracking-[0.25em] text-white transition hover:bg-black/85"
            >
              {isSubmitting ? t.subscribeLoading : t.subscribe}
            </button>
            {submitted && (
              <p className="text-xs font-sans text-black/60" aria-live="polite">
                {t.contactThanks}
              </p>
            )}
            {error && (
              <p className="text-xs font-sans text-red-600" aria-live="polite">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
