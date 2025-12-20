import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import type { Page, Work, Series } from '@/payload-types'
import Hero from '@/components/hero/HomeHero'
import Biography from '@/components/biography/Biography'
import WorksGallery from '@/components/works/WorksGallery'
import SeriesGallery from '@/components/series/SeriesGallery'

export default async function PageComponent() {
  const payload = await getPayload({ config: configPromise })

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  // Fetch works sorted by order
  const worksResult = await payload.find({
    collection: 'works',
    sort: 'order',
    limit: 100,
  })

  const works = worksResult.docs as Work[]

  // Fetch series
  const seriesResult = await payload.find({
    collection: 'series',
    limit: 100,
  })

  const series = seriesResult.docs as Series[]

  if (!pages.docs.length) {
    notFound()
  }

  const page = pages.docs[0] as Page

  // Extract biography block from layout
  const biographyBlock = page.layout?.find((block) => block.blockType === 'biography')

  return (
    <div className="bg-black">
      {/* Hero Section */}
      {page.layout?.map((block, index) => {
        if (block.blockType === 'hero') {
          return (
            <Hero
              key={index}
              heading={block.heading}
              subtitle={block.subtitle}
              background={block.background}
              ctaLabel={block.ctaLabel}
              ctaLink={block.ctaLink}
            />
          )
        }
        return null
      })}

      {/* Biography Section */}
      {biographyBlock && (
        <Biography
          content={biographyBlock.content}
          images={biographyBlock.images}
          files={biographyBlock.files}
        />
      )}

      {/* Works Gallery Section */}
      {works.length > 0 && <WorksGallery works={works} />}

      {/* Series Gallery Section */}
      {series.length > 0 && <SeriesGallery series={series} />}
    </div>
  )
}
