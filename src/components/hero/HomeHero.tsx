'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import type { Media } from '@/payload-types'

interface HeroProps {
  heading?: string | null
  subtitle?: string | null
  background?: (number | null) | Media
  ctaLabel?: string | null
  ctaLink?: string | null
}

export default function Hero({ heading, subtitle, background }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null)
  const backgroundUrl = background && typeof background === 'object' ? background.url : undefined
  const backgroundAlt =
    background && typeof background === 'object' ? background.alt : 'Hero background'

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Text parallax - moves up slower than scroll
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.9])

  // Image parallax - moves down relative to scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section ref={containerRef} className="h-screen w-full relative overflow-hidden bg-black">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: imageY, scale: imageScale }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {backgroundUrl ? (
          <Image
            src={backgroundUrl}
            alt={backgroundAlt || 'Hero background'}
            fill
            priority
            className="object-cover grayscale"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        )}
      </motion.div>

      {/* Hero Text - Centered & Sticky effect */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          className="flex flex-col items-center text-center px-4 gap-10"
          style={{ y: textY, opacity: textOpacity, scale: textScale }}
        >
          <motion.h1
            className="font-display text-[13vw] md:text-[13vw] leading-[0.85] font-bold uppercase text-white tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          >
            {heading || (
              <>
                GAGIK
                <br />
                HARUTYUNYAN
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className="text-md md:text-base font-sans uppercase tracking-[0.3em] text-white/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-white/50">
            Scroll
          </span>
          <motion.div
            className="w-[1px] h-16 bg-white/30 relative overflow-hidden"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full bg-white"
              animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
