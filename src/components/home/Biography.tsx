'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Biography() {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  })

  // Animate the section sliding up over the hero
  const y = useTransform(scrollYProgress, [0, 1], ['100px', '0px'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen bg-white text-black py-32 px-6 z-10"
      style={{ y }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column - Label (Sticky) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <motion.span
                className="text-xs font-sans uppercase tracking-[0.3em] text-black/40"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Biography
              </motion.span>
              <motion.div
                className="w-12 h-[1px] bg-black/20 mt-4"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-8">
            <motion.p
              className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-black mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </motion.p>

            <motion.p
              className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-black mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </motion.p>

            <motion.p
              className="font-serif text-2xl md:text-3xl lg:text-4xl leading-relaxed text-black/70"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo.
            </motion.p>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
