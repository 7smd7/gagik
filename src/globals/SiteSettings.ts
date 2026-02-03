import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'Gagik Harutyunyan',
              localized: true,
              admin: {
                description: 'The name of your website',
              },
            },
            {
              name: 'siteUrl',
              type: 'text',
              required: true,
              defaultValue: 'https://gagikharutyunyan.com',
              admin: {
                description: 'The base URL of your website (without trailing slash)',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              required: true,
              localized: true,
              defaultValue: 'Explore the works and artistic journey of Gagik Harutyunyan.',
              admin: {
                description: 'Default site description for SEO',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
              admin: {
                description: 'Favicon file (ICO or PNG). Will be used for site icon.',
              },
            },
            {
              name: 'appleTouchIcon',
              type: 'upload',
              relationTo: 'media',
              label: 'Apple Touch Icon',
              admin: {
                description: 'Apple touch icon (PNG, e.g. 180x180).',
              },
            },
          ],
        },
        {
          label: 'SEO Defaults',
          fields: [
            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Default OG Image',
              admin: {
                description:
                  'Default Open Graph image for pages without custom images. Recommended: 1200x630px',
              },
            },
            {
              name: 'twitterHandle',
              type: 'text',
              label: 'Twitter Handle',
              admin: {
                description: 'Your Twitter/X handle (e.g., @username)',
              },
            },
          ],
        },
        {
          label: 'Social Links',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Media Links',
              admin: {
                description: 'Your social media profiles for structured data',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Full URL to your social media profile',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Analytics & Tracking',
          fields: [
            {
              name: 'clarityId',
              type: 'text',
              label: 'Microsoft Clarity ID',
              admin: {
                description: 'Your Microsoft Clarity tracking ID',
              },
            },
            {
              name: 'googleAnalyticsId',
              type: 'text',
              label: 'Google Analytics ID',
              admin: {
                description: 'Your Google Analytics tracking ID (e.g., G-XXXXXXXXXX)',
              },
            },
            {
              name: 'customScripts',
              type: 'textarea',
              label: 'Custom Head Scripts',
              admin: {
                description: 'Additional scripts to inject into the <head> tag',
              },
            },
          ],
        },
        {
          label: 'Structured Data',
          fields: [
            {
              name: 'organizationType',
              type: 'select',
              label: 'Type',
              defaultValue: 'Person',
              options: [
                { label: 'Person', value: 'Person' },
                { label: 'Organization', value: 'Organization' },
                { label: 'LocalBusiness', value: 'LocalBusiness' },
              ],
              admin: {
                description: 'Schema.org type for structured data',
              },
            },
            {
              name: 'email',
              type: 'email',
              label: 'Contact Email',
              admin: {
                description: 'Contact email for structured data',
              },
            },
            {
              name: 'jobTitle',
              type: 'text',
              label: 'Job Title',
              localized: true,
              admin: {
                description: 'Job title or profession (for Person type)',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default SiteSettings
