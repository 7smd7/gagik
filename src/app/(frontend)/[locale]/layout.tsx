import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/providers/SmoothScroll'
import '@/styles/globals.css'
import { ReactNode } from 'react'
import { Inter, Playfair_Display, Oswald } from 'next/font/google'

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

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable} ${oswald.variable}`}>
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
