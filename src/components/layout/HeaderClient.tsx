'use client'

import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

interface NavItem {
  label: string
  link: string
}

interface HeaderClientProps {
  navItems: NavItem[]
}

export default function HeaderClient({ navItems }: HeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Change navbar style when scrolled past hero (100vh - 100px)
    const threshold = typeof window !== 'undefined' ? window.innerHeight - 100 : 800
    setIsScrolled(latest > threshold)
  })

  return (
    <motion.header
      className="fixed top-0 w-full z-50 transition-colors duration-500"
      initial={{ backgroundColor: 'transparent' }}
      animate={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
        borderBottomColor: isScrolled ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
      }}
      style={{
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
        {/* Logo / Name */}
        <Link href="/" className="group">
          <motion.span
            className="font-sans text-sm md:text-base font-medium tracking-[0.2em] uppercase"
            animate={{
              color: isScrolled ? '#000000' : '#ffffff',
            }}
            transition={{ duration: 0.3 }}
          >
            Gagik Harutyunyan
          </motion.span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.length > 0 ? (
            navItems.map((item, i: number) => (
              <Link key={i} href={item.link || '#'}>
                <motion.span
                  className="text-xs font-sans uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
                  animate={{
                    color: isScrolled ? '#000000' : '#ffffff',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))
          ) : (
            <>
              <Link href="/">
                <motion.span
                  className="text-xs font-sans uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
                  animate={{ color: isScrolled ? '#000000' : '#ffffff' }}
                  transition={{ duration: 0.3 }}
                >
                  Work
                </motion.span>
              </Link>
              <Link href="/about">
                <motion.span
                  className="text-xs font-sans uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
                  animate={{ color: isScrolled ? '#000000' : '#ffffff' }}
                  transition={{ duration: 0.3 }}
                >
                  About
                </motion.span>
              </Link>
              <Link href="/contact">
                <motion.span
                  className="text-xs font-sans uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
                  animate={{ color: isScrolled ? '#000000' : '#ffffff' }}
                  transition={{ duration: 0.3 }}
                >
                  Contact
                </motion.span>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-xs font-sans uppercase tracking-[0.15em]"
          animate={{ color: isScrolled ? '#000000' : '#ffffff' }}
          transition={{ duration: 0.3 }}
        >
          Menu
        </motion.button>
      </div>
    </motion.header>
  )
}
