import { Suspense } from 'react'
import UnsubscribeClient from './unsubscribe-client'

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white px-6 py-24">
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-2xl font-serif text-black mb-4">Unsubscribe</h1>
            <p className="text-sm text-black/60 mb-8">Loading…</p>
          </div>
        </div>
      }
    >
      <UnsubscribeClient />
    </Suspense>
  )
}
