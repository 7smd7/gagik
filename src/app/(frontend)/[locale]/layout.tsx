import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/providers/SmoothScroll'
import { Analytics } from '@/components/common/Analytics'
import { StructuredData } from '@/components/common/StructuredData'
import '@/styles/globals.css'
import { ReactNode } from 'react'
import { Inter, Playfair_Display, Oswald } from 'next/font/google'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

interface LayoutProps {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gagikharutyunyan.com'

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params
  const normalizedLocale = locale === 'am' ? 'hy' : locale

  const localeNames: Record<string, string> = {
    en: 'en_US',
    hy: 'hy_AM',
    ru: 'ru_RU',
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'Gagik Harutyunyan — Artist',
      template: '%s | Gagik Harutyunyan',
    },
    description: 'Explore the works and artistic journey of Gagik Harutyunyan.',
    keywords: ['Gagik Harutyunyan', 'artist', 'contemporary art', 'Armenian art'],
    authors: [{ name: 'Gagik Harutyunyan' }],
    creator: 'Gagik Harutyunyan',
    publisher: 'Gagik Harutyunyan',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: localeNames[normalizedLocale] || 'en_US',
      alternateLocale: ['en_US', 'hy_AM', 'ru_RU'].filter(
        (l) => l !== localeNames[normalizedLocale],
      ),
      url: siteUrl,
      siteName: 'Gagik Harutyunyan',
      title: 'Gagik Harutyunyan — Artist',
      description: 'Explore the works and artistic journey of Gagik Harutyunyan.',
      images: [
        {
          url: `${siteUrl}/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: 'Gagik Harutyunyan',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Gagik Harutyunyan — Artist',
      description: 'Explore the works and artistic journey of Gagik Harutyunyan.',
      images: [`${siteUrl}/${locale}/opengraph-image`],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        hy: `${siteUrl}/hy`,
        ru: `${siteUrl}/ru`,
      },
    },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  const normalizedLocale = locale === 'am' ? 'hy' : locale
  const payload = await getPayload({ config: configPromise })

  // Fetch site settings
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale: normalizedLocale as 'en' | 'hy' | 'ru',
  })

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable} ${oswald.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <Analytics
          clarityId={siteSettings?.clarityId}
          googleAnalyticsId={siteSettings?.googleAnalyticsId}
          customScripts={siteSettings?.customScripts}
        />
        <StructuredData
          organizationType={siteSettings?.organizationType as any}
          siteName={siteSettings?.siteName || 'Gagik Harutyunyan'}
          siteUrl={siteSettings?.siteUrl || siteUrl}
          email={siteSettings?.email}
          jobTitle={siteSettings?.jobTitle}
          socialLinks={siteSettings?.socialLinks as any}
        />
      </head>
      <body suppressHydrationWarning={true} className="bg-black text-white font-sans antialiased">
        <SmoothScroll>
          <Header locale={locale} />
          <main>{children}</main>
          <Footer locale={locale} />
        </SmoothScroll>
      </body>
    </html>
  )
}
