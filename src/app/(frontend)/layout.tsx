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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${oswald.variable}`}>
      <body className="bg-black text-white font-sans antialiased">
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
