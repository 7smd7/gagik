'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import type { Media } from '@/payload-types'
import type { RichTextContent, RichTextNode, RichTextChild } from '@/types/richtext'
import { getTranslations } from '@/lib/translations'

interface BioImage {
  image?: (number | null) | Media
  caption?: string | null
}

interface BioFile {
  file?: (number | null) | Media
  label: string
}

interface BiographyBlockProps {
  content?: RichTextContent | string
  images?: BioImage[] | null
  files?: BioFile[] | null
  locale: string
}

export default function Biography({ content, images, files, locale }: BiographyBlockProps) {
  const t = getTranslations(locale)
  const containerRef = useRef<HTMLElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const hasImages = images && images.length > 0
  const currentImage = hasImages ? images[currentImageIndex] : null

  const goToPrevious = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }
  }

  const goToNext = () => {
    if (hasImages) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
  }
  // Helper function to render rich text content
  const renderContent = (richText: RichTextContent | string | undefined) => {
    if (!richText) return null

    if (typeof richText === 'string') {
      return (
        <p className="font-serif text-lg md:text-xl lg:text-2xl leading-relaxed text-black/80">
          {richText}
        </p>
      )
    }

    // Handle Payload's rich text format
    if (richText.root && richText.root.children) {
      return (
        <div className="prose prose-lg max-w-none font-serif text-black/80">
          {richText.root.children.map((node: RichTextNode, idx: number) => {
            if (node.type === 'paragraph') {
              return (
                <p
                  key={idx}
                  className="font-serif text-lg md:text-xl lg:text-2xl leading-relaxed mb-6"
                >
                  {node.children?.map((child: RichTextChild, cidx: number) => (
                    <span key={cidx}>{child.text}</span>
                  ))}
                </p>
              )
            }
            return null
          })}
        </div>
      )
    }

    return null
  }

  return (
    <section id="Biography" ref={containerRef} className="bg-white py-16 px-6 md:px-8 lg:px-16">
      {/* Section Title*/}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-12"
      >
        <motion.span
          className="text-3xl font-sans uppercase tracking-[0.3em] text-black/40 font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t.biography}
        </motion.span>
        <motion.div
          className="w-20 h-px bg-black/20 mt-4"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ transformOrigin: 'left' }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column - Images */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8 }}
          >
            <div className="lg:sticky lg:top-32">
              {hasImages ? (
                <div className="space-y-4">
                  {/* Image Container */}
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden bg-gray-100 rounded aspect-3/4 flex items-center justify-center"
                  >
                    {currentImage && (
                      <>
                        {(() => {
                          const img =
                            typeof currentImage.image === 'object' ? currentImage.image : null
                          return img && 'url' in img && img.url ? (
                            <Image
                              src={img.url}
                              alt={img.alt || 'Biography image'}
                              width={img.width || 400}
                              height={img.height || 500}
                              className="w-full h-full object-cover"
                            />
                          ) : null
                        })()}
                      </>
                    )}
                  </motion.div>

                  {/* Caption */}
                  {currentImage?.caption && (
                    <p className="text-sm text-black/50 font-sans italic text-center">
                      {currentImage.caption}
                    </p>
                  )}

                  {/* Navigation Controls */}
                  {images.length > 1 && (
                    <div className="flex items-center justify-between gap-4">
                      <motion.button
                        onClick={goToPrevious}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex-1 py-2 px-4 bg-black text-white text-sm font-sans uppercase tracking-widest rounded hover:bg-black/80 transition-colors"
                      >
                        ← {t.previous}
                      </motion.button>

                      <div className="text-xs text-black/50 font-sans whitespace-nowrap">
                        {currentImageIndex + 1} / {images.length}
                      </div>

                      <motion.button
                        onClick={goToNext}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex-1 py-2 px-4 bg-black text-white text-sm font-sans uppercase tracking-widest rounded hover:bg-black/80 transition-colors"
                      >
                        {t.next} →
                      </motion.button>
                    </div>
                  )}

                  {/* Dot Indicators */}
                  {images.length > 1 && (
                    <div className="flex gap-2 justify-center">
                      {images.map((_, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-black' : 'bg-black/30'
                          }`}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                  {t.noImages}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Content & Downloads */}
          <motion.div
            className="lg:col-span-8 space-y-12"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Biography Text */}
            <div className="prose prose-lg max-w-none">{renderContent(content)}</div>

            {/* Downloads Section */}
            {files && files.length > 0 && (
              <div className="border-t border-black/10 pt-12">
                <motion.h3
                  className="text-lg font-sans font-bold uppercase tracking-[0.2em] text-black mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {t.download}
                </motion.h3>

                <div className="space-y-3">
                  {files.map((item, idx) => {
                    const file = typeof item.file === 'object' ? item.file : null
                    const fileUrl = (
                      file && 'url' in file && typeof file.url === 'string' ? file.url : '#'
                    ) as string
                    const mimeType = (
                      file && 'mimeType' in file && typeof file.mimeType === 'string'
                        ? file.mimeType
                        : ''
                    ) as string
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
                      >
                        <Link
                          href={fileUrl}
                          className="group inline-flex items-center gap-3 text-black hover:text-black/60 transition-colors font-sans text-sm underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>{item.label}</span>
                          <span className="text-xs">{mimeType.includes('pdf') && '(PDF)'}</span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
