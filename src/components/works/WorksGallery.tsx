'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import type { Work, Media } from '@/payload-types'
import WorkModal from './WorkModal'
import { getTranslations } from '@/lib/translations'

interface WorksGalleryProps {
  works: Work[]
  locale: string
}

function WorkCard({ work, onClick }: { work: Work; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const image = work.image as Media
  const imageUrl = image?.url

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="group inline-block w-full cursor-pointer break-inside-avoid mb-16 md:mb-20 pb-6"
      style={{ marginBottom: '5rem' }}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-neutral-50 mb-6 md:mb-8">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={work.title}
            width={image.width || 800}
            height={image.height || 1000}
            className="w-full h-auto transition-all duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {/* Subtle Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
      </div>
    </motion.div>
  )
}

export default function WorksGallery({ works, locale }: WorksGalleryProps) {
  const t = getTranslations(locale)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [itemsToShow, setItemsToShow] = useState(6)
  const [itemsPerRow, setItemsPerRow] = useState(3)
  const sectionRef = useRef<HTMLElement>(null)
  const titleInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Calculate items per row based on screen size and set initial items
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        let columnsPerRow = 3
        if (window.innerWidth < 640) {
          columnsPerRow = 1
        } else if (window.innerWidth < 1024) {
          columnsPerRow = 2
        }
        setItemsPerRow(columnsPerRow)
        setItemsToShow(columnsPerRow * 2) // 2 rows initially
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const visibleWorks = works.slice(0, itemsToShow)
  const hasMore = itemsToShow < works.length

  const loadMore = () => {
    setItemsToShow((prev) => prev + itemsPerRow * 5) // Load 5 more rows
  }

  const openModal = (index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedIndex(null)
    document.body.style.overflow = ''
  }

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < works.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  return (
    <>
      <section ref={sectionRef} className="relative bg-white py-20 md:py-28 px-6 md:px-8 lg:px-16">
        <div className="mx-auto">
          {/* Section Title*/}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-16 md:mb-24"
          >
            <motion.span
              className="text-3xl font-sans uppercase tracking-[0.3em] text-black/40 font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {t.works}
            </motion.span>
            <motion.div
              className="w-20 h-px bg-black/20 mt-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ transformOrigin: 'left' }}
            />
          </motion.div>

          {/* Masonry Grid using CSS columns; center column block */}
          <div className="flex justify-center">
            <div className="w-full max-w-5xl relative">
              <div
                className="w-full columns-1 sm:columns-2 lg:columns-3"
                style={{ columnGap: '3.5rem' }}
              >
                {visibleWorks.map((work, index) => (
                  <WorkCard key={work.id ?? index} work={work} onClick={() => openModal(index)} />
                ))}
              </div>

              {/* Fade overlay and Load More - Medium style */}
              {hasMore && (
                <>
                  {/* Gradient fade overlay on last rows - covers half of last row */}
                  <div
                    className="absolute bottom-0 left-0 right-0 pointer-events-none"
                    style={{
                      height: '450px',
                      background:
                        'linear-gradient(to top, rgb(255,255,255) 0%, rgb(255,255,255) 30%, rgba(255,255,255,0.98) 50%, rgba(255,255,255,0.85) 65%, rgba(255,255,255,0.5) 80%, rgba(255,255,255,0) 100%)',
                    }}
                  />

                  {/* Load More Section */}
                  <div className="relative -mt-64 pt-32 pb-8 flex flex-col items-center gap-6">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-lg text-black/60 font-sans text-center"
                    >
                      {t.discoverMore}
                    </motion.p>
                    <motion.button
                      onClick={loadMore}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="px-10 py-4 bg-black text-white text-sm font-sans uppercase tracking-[0.2em] rounded-full hover:bg-black/85 transition-all shadow-lg hover:shadow-xl"
                    >
                      {t.loadMore}
                    </motion.button>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-sm text-black/40 font-sans"
                    >
                      {works.length - itemsToShow} {t.moreAvailable}
                    </motion.span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedIndex !== null && (
        <WorkModal
          work={works[selectedIndex]}
          onClose={closeModal}
          onPrevious={selectedIndex > 0 ? goToPrevious : undefined}
          onNext={selectedIndex < works.length - 1 ? goToNext : undefined}
          locale={locale}
        />
      )}
    </>
  )
}
