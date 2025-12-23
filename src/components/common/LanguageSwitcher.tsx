'use client'

import { useRouter, usePathname } from 'next/navigation'
import React from 'react'

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'hy', label: 'HY' },
  { code: 'ru', label: 'RU' },
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = pathname.split('/')[1] || 'en' // Extract current locale from path

  const handleLocaleChange = (locale: string) => {
    // Replace the current locale in the pathname with the new locale
    const newPathname = `/${locale}${pathname.substring(currentLocale.length + 1)}`
    router.push(newPathname)
  }

  return (
    <div className="flex space-x-2">
      {locales.map((locale) => (
        <button
          key={locale.code}
          onClick={() => handleLocaleChange(locale.code)}
          className={`text-sm font-sans uppercase ${
            currentLocale === locale.code ? 'text-white' : 'text-white/40 hover:text-white'
          }`}
        >
          {locale.label}
        </button>
      ))}
    </div>
  )
}
