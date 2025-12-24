'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Locale {
  code: string
  label: string
  name: string
}

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [locales, setLocales] = useState<Locale[] | null>(null)

  const currentLocale = pathname.split('/')[1] || 'en' // Extract current locale from path

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
    const newPathname = `/${locale}${pathname.substring(currentLocale.length + 1)}`
    router.push(newPathname)
  }

  if (!locales) {
    return (
      <div className="flex space-x-2">
        <button
          className={'text-sm font-sans uppercase text-white  hover:text-white'}
          title={currentLocale}
        >
          {currentLocale}
        </button>
      </div>
    )
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
          title={locale.name}
        >
          {locale.label}
        </button>
      ))}
    </div>
  )
}
