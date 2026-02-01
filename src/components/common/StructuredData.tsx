import Script from 'next/script'

interface StructuredDataProps {
  organizationType?: 'Person' | 'Organization' | 'LocalBusiness'
  siteName: string
  siteUrl: string
  email?: string | null
  jobTitle?: string | null
  socialLinks?: Array<{ platform: string; url: string }>
}

export function StructuredData({
  organizationType = 'Person',
  siteName,
  siteUrl,
  email,
  jobTitle,
  socialLinks = [],
}: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': organizationType,
    name: siteName,
    url: siteUrl,
    ...(email && { email: `mailto:${email}` }),
    ...(jobTitle && { jobTitle }),
    ...(socialLinks.length > 0 && {
      sameAs: socialLinks.map((link) => link.url),
    }),
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
