'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Series as SeriesType } from '@/payload-types'

interface SeriesModalProps {
  series: SeriesType
  allSeries: SeriesType[]
  currentIndex: number
  onClose: () => void
}

export default function SeriesModal({ series, onClose }: SeriesModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const images = series.images || []
  const currentImage = images[selectedImageIndex]

  // Get preview images (2 previous, current, 2 next)
  const getPreviewIndices = () => {
    const indices = []
    const imageLength = images.length

    for (let i = -2; i <= 2; i++) {
      let index = selectedImageIndex + i
      if (imageLength > 0) {
        index = ((index % imageLength) + imageLength) % imageLength
      }
      indices.push(index)
    }
    return indices
  }

  const previewIndices = getPreviewIndices()

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }
    },
    [onClose, images.length],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const goToPreviousImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Extract URL and dimensions from media object
  const getImageData = (img: any) => {
    if (!img) return { url: null, width: 0, height: 0 }
    if (typeof img === 'object' && img?.url) {
      return { url: img.url, width: img.width || 800, height: img.height || 600 }
    }
    return { url: null, width: 0, height: 0 }
  }

  const currentImageData = getImageData(currentImage?.image)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-white"
        onClick={onClose}
      >
        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 rounded-full bg-black/5 hover:bg-black/10 text-black transition-all"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </motion.button>

        {/* Main Content Container */}
        <div
          className="h-full w-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
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
              if (diff > 0) goToNextImage()
              else goToPreviousImage()
            }
          }}
        >
          {/* Image Section */}
          <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
            {/* Navigation Arrows - Desktop */}
            <button
              onClick={goToPreviousImage}
              className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 items-center justify-center rounded-full bg-black/5 hover:bg-black/15 text-black transition-all"
              aria-label="Previous image"
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

            <button
              onClick={goToNextImage}
              className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-12 h-12 items-center justify-center rounded-full bg-black/5 hover:bg-black/15 text-black transition-all"
              aria-label="Next image"
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

            {/* Main Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${selectedImageIndex}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="relative max-w-full max-h-full flex items-center justify-center"
              >
                {currentImageData.url && (
                  <Image
                    src={currentImageData.url}
                    alt={currentImage?.title || series.name}
                    width={currentImageData.width}
                    height={currentImageData.height}
                    className="max-w-full max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-320px)] w-auto h-auto object-contain rounded-sm"
                    priority
                    quality={90}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Section - Info + Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="shrink-0 h-auto max-h-70 bg-linear-to-t from-white via-white/98 to-white/95 pt-4 pb-6 md:pb-8 px-4 md:px-8 overflow-y-auto border-t border-black/5"
          >
            {/* Image Info - All on one line with separators */}
            <div className="text-center mb-4 md:mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`info-${selectedImageIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1"
                >
                  {/* Title */}
                  {currentImage?.title && (
                    <h3 className="text-base md:text-lg font-medium text-black">
                      {currentImage.title}
                    </h3>
                  )}

                  {/* All Details on one line with separators */}
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-black/60">
                    {currentImage?.location && (
                      <>
                        <span>{currentImage.location}</span>
                        {(currentImage?.date ||
                          currentImage?.archiveNumber ||
                          currentImage?.description) && (
                          <span className="w-1 h-1 rounded-full bg-black/30" />
                        )}
                      </>
                    )}

                    {currentImage?.date && (
                      <>
                        <span>
                          {new Date(currentImage.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        {(currentImage?.archiveNumber || currentImage?.description) && (
                          <span className="w-1 h-1 rounded-full bg-black/30" />
                        )}
                      </>
                    )}

                    {currentImage?.archiveNumber && (
                      <>
                        <span>{currentImage.archiveNumber}</span>
                        {currentImage?.description && (
                          <span className="w-1 h-1 rounded-full bg-black/30" />
                        )}
                      </>
                    )}

                    {currentImage?.description && <span>{currentImage.description}</span>}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Preview Carousel */}
            <div className="flex items-center justify-center gap-3 md:gap-4">
              {/* Left Arrow */}
              <button
                onClick={goToPreviousImage}
                className="shrink-0 p-2 text-black/40 hover:text-black transition-colors"
                aria-label="Previous"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Preview Images */}
              <div className="flex items-center gap-2 md:gap-3">
                {previewIndices.map((index, position) => {
                  const previewImage = images[index]
                  const previewData = getImageData(previewImage?.image)
                  const isCenter = position === 2
                  const distance = Math.abs(position - 2)

                  return (
                    <motion.button
                      key={`preview-position-${position}`}
                      onClick={() => setSelectedImageIndex(index)}
                      animate={{
                        opacity: 1 - distance * 0.25,
                        scale: isCenter ? 1 : 0.85 - distance * 0.05,
                      }}
                      whileHover={{ scale: isCenter ? 1.05 : 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`shrink-0 relative overflow-hidden rounded transition-all ${
                        isCenter
                          ? 'w-16 h-16 md:w-20 md:h-20 ring-2 ring-black ring-offset-2 ring-offset-white'
                          : 'w-10 h-10 md:w-14 md:h-14'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    >
                      {previewData.url && (
                        <Image
                          src={previewData.url}
                          alt={previewImage?.title || `Preview ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes={isCenter ? '80px' : '56px'}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Right Arrow */}
              <button
                onClick={goToNextImage}
                className="shrink-0 p-2 text-black/40 hover:text-black transition-colors"
                aria-label="Next"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Series Title & Counter */}
            <div className="mt-3 md:mt-4 flex items-center justify-center gap-3 text-xs text-black/40">
              <span className="uppercase tracking-wider">{series.name}</span>
              <span className="w-1 h-1 rounded-full bg-black/20" />
              <span>
                {selectedImageIndex + 1} / {images.length}
              </span>
            </div>
          </motion.div>

          {/* Mobile Navigation */}
          <div className="md:hidden fixed left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-40">
            <button
              onClick={goToPreviousImage}
              className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-black"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={goToNextImage}
              className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-black"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
