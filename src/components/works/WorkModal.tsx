'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Work, Media } from '@/payload-types'
import { getTranslations } from '@/lib/translations'

interface WorkModalProps {
  work: Work
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  locale: string
}

export default function WorkModal({ work, onClose, onPrevious, onNext, locale }: WorkModalProps) {
  const t = getTranslations(locale)
  const image = work.image as Media
  const imageUrl = image?.url

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && onPrevious) {
        onPrevious()
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext()
      }
    },
    [onClose, onPrevious, onNext],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-50 p-2 text-black/60 hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content Container */}
        <div
          className="h-full w-full overflow-y-auto flex items-center py-16 md:py-0"
          onTouchStart={(e) => {
            const touch = e.touches[0]
            ;(e.currentTarget as any).startX = touch.clientX
          }}
          onTouchEnd={(e) => {
            const touch = e.changedTouches[0]
            const startX = (e.currentTarget as any).startX
            const endX = touch.clientX
            const diff = startX - endX

            if (Math.abs(diff) > 50) {
              if (diff > 0 && onNext) {
                onNext()
              } else if (diff < 0 && onPrevious) {
                onPrevious()
              }
            }
          }}
        >
          {/* Left Arrow */}
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="hidden md:block absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-50 p-2 text-black/40 hover:text-black transition-colors"
              aria-label={t.previousWork}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {onNext && (
            <button
              onClick={onNext}
              className="hidden md:block absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 p-2 text-black/40 hover:text-black transition-colors"
              aria-label={t.nextWork}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Main Content */}
          <div className="w-full flex justify-center items-center px-6 md:px-8 lg:px-24">
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Side - Info */}
              <motion.div
                key={`info-${work.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="order-2 lg:order-1 space-y-4 md:space-y-6 px-4 md:px-8 lg:px-12 text-center lg:text-left"
              >
                {/* Artist */}
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-display uppercase tracking-wide text-black">
                    {work.artist || 'Gagik Harutyunyan'}
                  </h2>
                </div>

                {/* Title & Year */}
                <div className="space-y-1.5 md:space-y-2">
                  {work.title && (
                    <h3 className="text-sm md:text-base lg:text-lg font-sans italic text-black/80">
                      {work.title}
                    </h3>
                  )}
                  {work.place && (
                    <div className="text-xs md:text-sm font-sans uppercase tracking-[0.15em] text-black/50">
                      {work.place}
                    </div>
                  )}
                  {work.year && (
                    <div className="text-xs md:text-sm font-sans text-black/40">{work.year}</div>
                  )}
                </div>
              </motion.div>

              {/* Right Side - Image */}
              <motion.div
                key={`image-${work.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="order-1 lg:order-2 relative w-full flex items-center justify-center"
              >
                {imageUrl && (
                  <div className="relative w-full aspect-3/4 sm:aspect-4/5 lg:aspect-2/3 max-h-[75vh] lg:max-h-[85vh]">
                    <Image
                      src={imageUrl}
                      alt={work.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 50vw"
                      priority
                    />
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden fixed bottom-6 left-0 right-0 flex justify-center gap-4 lg:gap-8 z-50">
            {onPrevious && (
              <button
                onClick={onPrevious}
                className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg text-black/60 hover:text-black transition-colors"
                aria-label={t.previousWork}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-xs md:text-sm font-sans text-black/40 uppercase tracking-wider">
                Swipe to navigate
              </div>
            </div>
            {onNext && (
              <button
                onClick={onNext}
                className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg text-black/60 hover:text-black transition-colors"
                aria-label={t.nextWork}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
