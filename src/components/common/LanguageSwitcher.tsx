'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Locale {
  code: string
  label: string
  name: string
}

export default function LanguageSwitcher({
  isScrolled = false,
  initialLocale,
}: {
  isScrolled?: boolean
  initialLocale?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [locales, setLocales] = useState<Locale[] | null>(null)

  const currentLocale = (pathname ? pathname.split('/')[1] : initialLocale) || 'en' // Extract current locale from path or use initialLocale

  useEffect(() => {
    fetch('/api/locales')
      .then((res) => res.json())
      .then((data) => {
        if (data.locales && data.locales.length > 0) {
          setLocales(data.locales)
        } else {
          setLocales([])
        }
      })
      .catch((error) => {
        console.error('Failed to fetch locales:', error)
        setLocales([])
      })
  }, [])

  const handleLocaleChange = (locale: string) => {
    locale = locale == 'hy' ? 'am' : locale // Map 'hy' to 'am'
    const newPathname = `/${locale}${pathname.substring(currentLocale.length + 1)}`
    router.push(newPathname)
  }

  const activeColor = isScrolled ? '#000000' : '#ffffff'
  const inactiveColor = isScrolled ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)'

  // Debug: log when isScrolled changes locally to verify prop passing
  useEffect(() => {
    console.debug('LanguageSwitcher isScrolled:', isScrolled, 'activeColor:', activeColor)
  }, [isScrolled, activeColor])

  if (!locales) {
    return (
      <div className="flex space-x-2">
        <motion.button
          className="text-sm font-sans uppercase"
          title={currentLocale}
          initial={{ color: activeColor }}
          animate={{ color: activeColor }}
          transition={{ duration: 0.3 }}
        >
          {currentLocale}
        </motion.button>
      </div>
    )
  }

  return (
    <div className="flex space-x-2">
      {locales.map((locale) => {
        const isActive =
          currentLocale === locale.code || (currentLocale === 'am' && locale.code === 'hy')
        return (
          <motion.button
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            className="text-sm font-sans uppercase"
            initial={{ color: isActive ? activeColor : inactiveColor }}
            animate={{ color: isActive ? activeColor : inactiveColor }}
            whileHover={{ color: activeColor }}
            transition={{ duration: 0.3 }}
            title={locale.name}
          >
            {locale.label}
          </motion.button>
        )
      })}
    </div>
  )
}
