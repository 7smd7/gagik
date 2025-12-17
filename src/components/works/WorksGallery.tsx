'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import type { Work, Media } from '@/payload-types'
import WorkModal from './WorkModal'

interface WorksGalleryProps {
  works: Work[]
}

function WorkCard({ work, index, onClick }: { work: Work; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const image = work.image as Media
  const imageUrl = image?.url

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: 'easeOut' }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-neutral-900 aspect-[4/5]">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={work.title}
            fill
            className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
      </div>

      {/* Work Info */}
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-sans text-white/90 leading-tight">
          {work.title}
          {work.place ? `, ${work.place}` : ''}
          {work.year ? `, ${work.year}` : ''}
        </h3>
      </div>
    </motion.div>
  )
}

export default function WorksGallery({ works }: WorksGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const titleInView = useInView(sectionRef, { once: true, margin: '-100px' })

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
      <section ref={sectionRef} className="relative bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-16 md:mb-24"
          >
            <h2 className="text-xs font-sans uppercase tracking-[0.3em] text-black/40 mb-4">
              Works
            </h2>
            <p className="text-2xl md:text-3xl font-display text-black/90 max-w-2xl">
              Selected Photographs
            </p>
          </motion.div>

          {/* Works Grid - Masonry-like layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {works.map((work, index) => (
              <WorkCard key={work.id} work={work} index={index} onClick={() => openModal(index)} />
            ))}
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
        />
      )}
    </>
  )
}
