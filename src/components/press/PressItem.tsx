import type { Press as PressType, Media } from '@/payload-types'
import { getTranslations } from '@/lib/translations'

interface Props {
  item: PressType
  locale: string
}

export default function PressItem({ item, locale }: Props) {
  const t = getTranslations(locale)
  const file = item.file as unknown as Media | undefined
  const fileUrl = file?.url
  const url = item.url

  // Map locale to supported locale for date formatting
  const dateLocale = locale === 'hy' ? 'hy-AM' : locale === 'ru' ? 'ru-RU' : 'en-US'

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString(dateLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className=" text-black">
      {/* Desktop: single-row table-like layout. Mobile: stacked compact layout. */}
      <div className="grid grid-cols-1 gap-1 md:items-center md:grid-cols-[minmax(0,1fr)_220px_110px]">
        <div className="min-w-0">
          <h3 className="font-serif italic text-sm md:text-base leading-tight md:leading-none">
            <span className="align-middle block">{item.title}</span>
            {item.author && (
              <span className="not-italic font-normal">
                {' '}
                {t.by} {item.author}
              </span>
            )}
          </h3>
        </div>

        <div className="text-xs md:text-sm text-gray-700 font-serif md:pl-4 md:text-right md:whitespace-nowrap">
          <div className="">{item.publisher}</div>
          {formattedDate ? <div className="text-xs md:text-sm md:mt-0">{formattedDate}</div> : null}
        </div>

        <div className="flex items-center gap-4 text-xs md:text-sm md:justify-end">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase text-xs md:text-sm font-sans"
            >
              <span className="hidden md:inline">{t.online}</span>
            </a>
          )}
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase text-xs md:text-sm font-sans"
            >
              PDF
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
