import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import type { Footer as FooterType } from '@/payload-types'

export default async function Footer() {
  const payload = await getPayload({ config: configPromise })

  const footer = (await payload.findGlobal({ slug: 'footer', depth: 1 })) as FooterType

  const socials = footer?.socials ?? []

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Left: Copyright */}
          <div>
            <p className="text-xs font-sans text-white/40">
              © {new Date().getFullYear()} Gagik Harutyunyan
            </p>
            <p className="text-xs font-sans text-white/40 mt-1">All rights reserved</p>
          </div>

          {/* Center: Location */}
          <div className="text-center">
            <address className="text-xs font-sans text-white/40 not-italic">
              Yerevan, Armenia
            </address>
          </div>

          {/* Right: Social Links */}
          <div className="md:text-right">
            <div className="flex gap-6 md:justify-end">
              {socials.length > 0 ? (
                socials.map((s, i: number) => (
                  <Link
                    key={i}
                    href={s.url}
                    className="text-xs font-sans text-white/40 hover:text-white transition-colors"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.platform}
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="#"
                    className="text-xs font-sans text-white/40 hover:text-white transition-colors"
                  >
                    Instagram
                  </Link>
                  <Link
                    href="#"
                    className="text-xs font-sans text-white/40 hover:text-white transition-colors"
                  >
                    Facebook
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
