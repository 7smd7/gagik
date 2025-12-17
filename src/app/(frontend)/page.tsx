import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import type { Page, Work } from '@/payload-types'
import Hero from '@/components/hero/HomeHero'
import Biography from '@/components/home/Biography'
import WorksGallery from '@/components/works/WorksGallery'

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

  if (!pages.docs.length) {
    notFound()
  }

  const page = pages.docs[0] as Page

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

      {/* Works Gallery Section */}
      {works.length > 0 && <WorksGallery works={works} />}

      {/* Biography Section - Slides over hero */}
      <Biography />
    </div>
  )
}
