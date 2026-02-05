import type { Press as PressType } from '@/payload-types'
import PressItem from './PressItem'
import { getTranslations } from '@/lib/translations'

interface Props {
  press: PressType[]
  locale: string
}

export default function PressGallery({ press, locale }: Props) {
  const t = getTranslations(locale)
  if (!press || !press.length) return null

  return (
    <section
      id="Press"
      className="relative bg-white py-20 md:py-28 px-6 md:px-8 lg:px-16 overflow-x-hidden"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 md:mb-16">
          <span className="block max-w-full text-2xl sm:text-3xl font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/40 font-bold break-words leading-tight">
            {t.press}
          </span>
          <div className="w-20 h-px bg-black/20 mt-4" />
        </div>

        <div className="w-full">
          <div className="divide-y divide-gray-100">
            {press.map((item) => (
              <div key={item.id} className="py-6 last:pb-0">
                <PressItem item={item} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
