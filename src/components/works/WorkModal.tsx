'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Work, Media } from '@/payload-types'

interface WorkModalProps {
  work: Work
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
}

export default function WorkModal({ work, onClose, onPrevious, onNext }: WorkModalProps) {
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
        <div className="h-full flex items-center">
          {/* Left Arrow */}
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-50 p-2 text-black/40 hover:text-black transition-colors"
              aria-label="Previous work"
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
              className="absolute right-8 top-1/2 -translate-y-1/2 z-50 p-2 text-black/40 hover:text-black transition-colors"
              aria-label="Next work"
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
          <div className="w-full max-w-7xl mx-auto px-16 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left Side - Info */}
            <motion.div
              key={`info-${work.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="order-2 lg:order-1 space-y-8"
            >
              {/* Artist */}
              <div>
                <h2 className="text-2xl md:text-3xl font-display uppercase tracking-wide text-black">
                  {work.artist || 'Gagik Harutyunyan'}
                </h2>
                <p className="text-xs font-sans uppercase tracking-[0.2em] text-black/50 mt-1">
                  Armenia
                </p>
              </div>

              {/* Title & Year */}
              <div className="space-y-4">
                <h3 className="text-sm md:text-base font-sans uppercase tracking-[0.15em] text-black/80">
                  {work.title}
                  {work.place ? `, ${work.place}` : ''}
                  {work.year ? `, ${work.year}` : ''}
                </h3>
              </div>

              {/* Enquire Button */}
              <div className="pt-4">
                <button className="text-xs font-sans uppercase tracking-[0.2em] text-black/50 hover:text-black transition-colors border-b border-black/20 hover:border-black pb-1">
                  Enquire
                </button>
              </div>
            </motion.div>

            {/* Right Side - Image */}
            <motion.div
              key={`image-${work.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="order-1 lg:order-2 relative aspect-[3/4] max-h-[75vh] w-full"
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={work.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
