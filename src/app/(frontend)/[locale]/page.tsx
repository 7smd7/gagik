import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import type { Page, Work, Series, Press, Media } from '@/payload-types'
import Hero from '@/components/hero/HomeHero'
import Biography from '@/components/biography/Biography'
import WorksGallery from '@/components/works/WorksGallery'
import SeriesGallery from '@/components/series/SeriesGallery'
import PressGallery from '@/components/press/PressGallery'
import ScrollSpacer from '@/components/layout/ScrollSpacer'
import HashScroller from '@/components/layout/HashScroller'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gagikharutyunyan.com'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: _local } = await params
  const locale = _local === 'am' ? 'hy' : _local
  const payload = await getPayload({ config: configPromise })
  const localeCode = locale as 'en' | 'hy' | 'ru'

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    locale: localeCode,
    limit: 1,
  })

  const page = pages.docs[0] as Page | undefined

  if (!page) {
    return {}
  }

  const seoTitle = page.seo?.metaTitle || page.title || 'Gagik Harutyunyan — Artist'
  const seoDescription =
    page.seo?.metaDescription || 'Explore the works and artistic journey of Gagik Harutyunyan.'
  const seoKeywords = page.seo?.metaKeywords || 'Gagik Harutyunyan, artist, contemporary art'

  // Handle OG image
  // Use the dynamic opengraph-image route and pass the title as query param
  let ogImageUrl = `${siteUrl}/${locale}/opengraph-image?title=${encodeURIComponent(seoTitle)}`
  if (page.seo?.ogImage) {
    const ogImage = page.seo.ogImage as Media
    if (typeof ogImage === 'object' && ogImage.url) {
      ogImageUrl = ogImage.url
    }
  }

  const robots = page.seo?.noIndex
    ? {
        index: false,
        follow: false,
      }
    : {
        index: true,
        follow: true,
      }

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    robots,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${siteUrl}/${locale}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [ogImageUrl],
    },
  }
}

export default async function PageComponent({ params }: PageProps) {
  const { locale: _local } = await params
  const locale = _local == 'am' ? 'hy' : _local
  const payload = await getPayload({ config: configPromise })

  const localeCode = locale as 'en' | 'hy' | 'ru'

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    locale: localeCode,
  })

  // Fetch works sorted by order
  const worksResult = await payload.find({
    collection: 'works',
    sort: 'order',
    limit: 100,
    locale: localeCode,
  })

  const works = worksResult.docs as Work[]

  // Fetch series
  const seriesResult = await payload.find({
    collection: 'series',
    limit: 100,
    locale: localeCode,
  })

  const series = seriesResult.docs as Series[]

  // Fetch press
  const pressResult = await payload.find({
    collection: 'press',
    limit: 100,
    locale: localeCode,
  })

  const press = pressResult.docs as Press[]

  if (!pages.docs.length) {
    notFound()
  }

  const page = pages.docs[0] as Page

  // Extract biography block from layout
  const biographyBlock = page.layout?.find((block) => block.blockType === 'biography')

  return (
    <div className="bg-black">
      <HashScroller />
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
              locale={locale}
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
          locale={locale}
        />
      )}

      <ScrollSpacer />

      {/* Works Gallery Section */}
      {works.length > 0 && <WorksGallery works={works} locale={locale} />}

      <ScrollSpacer />

      {/* Series Gallery Section */}
      {series.length > 0 && <SeriesGallery series={series} locale={locale} />}

      <ScrollSpacer />

      {/* Press Section */}
      {press.length > 0 && <PressGallery press={press} locale={locale} />}
    </div>
  )
}
