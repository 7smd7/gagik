'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const initialEmail = useMemo(() => searchParams.get('email') || '', [searchParams])
  const [email, setEmail] = useState(initialEmail)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const submit = async (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return

    setStatus('loading')
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmed }),
      })

      if (!response.ok) throw new Error('Unsubscribe failed')

      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    if (initialEmail) {
      void submit(initialEmail)
    }
  }, [initialEmail])

  return (
    <div className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-serif text-black mb-4">Unsubscribe</h1>
        <p className="text-sm text-black/60 mb-8">
          Enter your email address to stop receiving updates.
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setStatus('idle')
            }}
            placeholder="Your email"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-black/80 focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          <button
            type="button"
            onClick={() => void submit(email)}
            disabled={status === 'loading'}
            className="w-full rounded-xl bg-black py-3 text-xs font-sans uppercase tracking-[0.25em] text-white transition hover:bg-black/85"
          >
            {status === 'loading' ? 'Unsubscribing…' : 'Unsubscribe'}
          </button>
        </div>

        {status === 'success' && (
          <p className="text-xs font-sans text-black/60 mt-6">You are unsubscribed.</p>
        )}
        {status === 'error' && (
          <p className="text-xs font-sans text-red-600 mt-6">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  )
}
