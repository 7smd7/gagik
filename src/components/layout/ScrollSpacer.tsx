'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function ScrollSpacer() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start start'],
  })

  const height = useTransform(scrollYProgress, [0, 1], [64, 20])

  return <motion.div ref={ref} style={{ height }} />
}
