'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import type { Media } from '@/payload-types'
import LanguageSwitcher from '@/components/common/LanguageSwitcher'

interface NavItem {
  label: string
  link: string
}

interface HeaderClientProps {
  logo?: (number | null) | Media
  name?: string | null
  navItems: NavItem[]
}

export default function HeaderClient({ logo, name, navItems }: HeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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
      <div className="flex flex-1 justify-between p-6 relative">
        {/* Logo / Name */}
        <Link href="/" className="group flex items-center gap-3">
          {logo && typeof logo === 'object' && logo.url && (
            <Image
              src={logo.url}
              alt={logo.alt || 'Logo'}
              width={40}
              height={40}
              className="h-8 w-auto"
            />
          )}
          <motion.span
            className="font-sans text-sm md:text-base font-medium tracking-[0.2em] uppercase"
            animate={{
              color: isScrolled ? '#000000' : '#ffffff',
            }}
            transition={{ duration: 0.3 }}
          >
            {name || 'Artist Name'}
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
          <LanguageSwitcher />
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-xs font-sans uppercase tracking-[0.15em]"
          animate={{ color: isScrolled ? '#000000' : '#ffffff' }}
          transition={{ duration: 0.3 }}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </motion.button>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-screen bg-black/95 flex flex-col items-center justify-center z-50 md:hidden"
          >
            {/* Close (X) button */}
            <button
              className="absolute top-6 right-6 text-4xl text-white hover:text-gray-300 focus:outline-none"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              type="button"
            >
              &times;
            </button>
            <div className="w-full flex flex-col items-center justify-center mt-12 gap-8">
              {navItems.length > 0 ? (
                navItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.link || '#'}
                    className="w-11/12 max-w-xs text-center py-6 text-3xl font-sans uppercase tracking-[0.2em] text-white bg-white/10 rounded-xl shadow hover:bg-white/20 transition-colors"
                    onClick={() => setMenuOpen(false)}
                    role="button"
                  >
                    {item.label}
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="/"
                    className="w-11/12 max-w-xs text-center py-6 text-3xl font-sans uppercase tracking-[0.2em] text-white bg-white/10 rounded-xl shadow hover:bg-white/20 transition-colors"
                    onClick={() => setMenuOpen(false)}
                    role="button"
                  >
                    Work
                  </Link>
                  <Link
                    href="/about"
                    className="w-11/12 max-w-xs text-center py-6 text-3xl font-sans uppercase tracking-[0.2em] text-white bg-white/10 rounded-xl shadow hover:bg-white/20 transition-colors"
                    onClick={() => setMenuOpen(false)}
                    role="button"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="w-11/12 max-w-xs text-center py-6 text-3xl font-sans uppercase tracking-[0.2em] text-white bg-white/10 rounded-xl shadow hover:bg-white/20 transition-colors"
                    onClick={() => setMenuOpen(false)}
                    role="button"
                  >
                    Contact
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
