'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import type { Series as SeriesType, Media } from '@/payload-types'
import SeriesModal from '@/components/series/SeriesModal'

interface SeriesGalleryProps {
  series: SeriesType[]
}

function SeriesCard({ series, onClick }: { series: SeriesType; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '100px' })

  const cover = series.cover as Media
  const coverUrl = cover?.url
  const imageCount = series.images?.length || 0
  const dateRange =
    series.startDate && series.endDate
      ? `${new Date(series.startDate).getFullYear()} - ${new Date(series.endDate).getFullYear()}`
      : series.startDate
        ? `${new Date(series.startDate).getFullYear()}`
        : ''

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex-shrink-0 w-56 h-56 md:w-64 md:h-64 group cursor-pointer relative overflow-hidden bg-neutral-50 rounded-sm"
      onClick={onClick}
    >
      {/* Image */}
      {coverUrl && (
        <Image
          src={coverUrl}
          alt={series.name}
          fill
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 224px, 256px"
        />
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-4 md:p-5" />

      {/* Hover Details */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Series Name */}
        <div className="mb-2">
          <h3 className="text-sm md:text-base font-sans font-semibold text-white line-clamp-2">
            {series.name}
          </h3>
        </div>

        {/* Details */}
        <div className="space-y-1 text-xs md:text-sm text-white/90">
          {dateRange && <div className="font-sans">{dateRange}</div>}
          <div className="font-sans">
            {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
          </div>
        </div>
      </div>

      {/* Mobile - Always visible details at bottom */}
      <div className="absolute inset-0 md:hidden flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
        <h3 className="text-sm font-sans font-semibold text-white line-clamp-2 mb-1">
          {series.name}
        </h3>
        <div className="space-y-0.5 text-xs text-white/90">
          {dateRange && <div className="font-sans">{dateRange}</div>}
          <div className="font-sans">
            {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function SeriesGallery({ series }: SeriesGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [visibleSeries, setVisibleSeries] = useState<SeriesType[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const titleInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Lazy loading - load initial batch and more on scroll
  useEffect(() => {
    setVisibleSeries(series.slice(0, 6)) // Load first 6
  }, [series])

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const scrollPercentage = (scrollLeft + clientWidth) / scrollWidth

    // Load more when reaching 80% of the end
    if (scrollPercentage > 0.8 && visibleSeries.length < series.length) {
      setVisibleSeries(series.slice(0, visibleSeries.length + 6))
    }
  }, [visibleSeries.length, series])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const openModal = (index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedIndex(null)
    document.body.style.overflow = ''
  }

  if (!series.length) {
    return null
  }

  return (
    <>
      <section ref={sectionRef} className="relative bg-white py-20 md:py-28 px-6 md:px-8 lg:px-16">
        <div className="mx-auto">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-12 md:mb-16"
          >
            <motion.span
              className="text-3xl font-sans uppercase tracking-[0.3em] text-black/40 font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Series
            </motion.span>
            <motion.div
              className="w-20 h-px bg-black/20 mt-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.div>

          {/* Horizontal Scrollable Gallery */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollBehavior: 'smooth' }}
            >
              {visibleSeries.map((item, index) => (
                <SeriesCard key={item.id ?? index} series={item} onClick={() => openModal(index)} />
              ))}
            </div>

            {/* Fade effect on right side */}
            <div className="absolute top-0 right-0 w-12 md:w-24 h-full bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
          </div>

          {/* Load more indicator */}
          {visibleSeries.length < series.length && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 text-center text-sm text-black/40 font-sans"
            >
              Scroll to see more series
            </motion.p>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedIndex !== null && (
        <SeriesModal
          series={visibleSeries[selectedIndex]}
          allSeries={series}
          currentIndex={selectedIndex}
          onClose={closeModal}
        />
      )}
    </>
  )
}
