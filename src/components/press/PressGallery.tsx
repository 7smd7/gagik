import type { Press as PressType } from '@/payload-types'
import PressItem from './PressItem'

interface Props {
  press: PressType[]
}

export default function PressGallery({ press }: Props) {
  if (!press || !press.length) return null

  return (
    <section className="relative bg-white py-20 md:py-28 px-6 md:px-8 lg:px-16 overflow-x-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 md:mb-16">
          <span className="text-3xl font-sans uppercase tracking-[0.3em] text-black/40 font-bold">
            Press
          </span>
          <div className="w-20 h-px bg-black/20 mt-4" />
        </div>

        <div className="w-full">
          <div className="divide-y divide-gray-100">
            {press.map((item) => (
              <div key={item.id} className="py-6 last:pb-0">
                <PressItem item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
