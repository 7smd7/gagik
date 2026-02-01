import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: ({ req }) => {
      // If there is a user logged in (admin),
      // let them retrieve all documents
      if (req.user) return true

      // If there is no user (public),
      // restrict the documents that are returned
      // to only those where `_status` is equal to `published`
      // or where `_status` does not exist (old documents)
      return {
        or: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            _status: {
              exists: false,
            },
          },
        ],
      }
    },
  },
  versions: {
    maxPerDoc: 100,
    drafts: {
      autosave: {
        interval: 800,
      },
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        description: 'URL slug for the page',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          localized: true,
          admin: {
            description:
              'SEO title (defaults to page title if empty). Recommended: 50-60 characters',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          localized: true,
          admin: {
            description: 'SEO description. Recommended: 150-160 characters',
          },
        },
        {
          name: 'metaKeywords',
          type: 'text',
          label: 'Keywords',
          localized: true,
          admin: {
            description: 'Comma-separated keywords',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Open Graph Image',
          admin: {
            description:
              'Custom image for social media sharing. Recommended: 1200x630px. Leave empty to use auto-generated image.',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          label: 'No Index',
          defaultValue: false,
          admin: {
            description: 'Prevent search engines from indexing this page',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        {
          slug: 'hero',
          labels: {
            singular: 'Hero',
            plural: 'Heroes',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: 'Title',
              localized: true,
              admin: {
                description: 'Main hero title (e.g., "GAGIK HARUTYUNYAN")',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle',
              localized: true,
              admin: {
                description: 'Optional subtitle displayed below the title (e.g., "Yerevan")',
              },
            },
            {
              name: 'background',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: {
                description: 'Hero background image (grayscale effect applied)',
              },
            },
            {
              name: 'ctaLabel',
              type: 'text',
              label: 'CTA Button Text',
              localized: true,
              admin: {
                description: 'Optional call-to-action button label',
              },
            },
            {
              name: 'ctaLink',
              type: 'text',
              label: 'CTA Button Link',
              admin: {
                description: 'Optional call-to-action button URL',
              },
            },
          ],
        },
        {
          slug: 'biography',
          labels: {
            singular: 'Biography',
            plural: 'Biographies',
          },
          fields: [
            {
              name: 'content',
              type: 'richText',
              label: 'Biography Content',
              localized: true,
              admin: {
                description: 'Main biography text - use rich text editor for formatting',
              },
              required: true,
            },
            {
              name: 'images',
              type: 'array',
              label: 'Images',
              admin: {
                description: 'Images to display alongside biography',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Photo Credit',
                  localized: true,
                  admin: {
                    description: 'Photo credit or copyright information',
                  },
                },
              ],
            },
            {
              name: 'files',
              type: 'array',
              label: 'Downloads',
              admin: {
                description: 'Files available for download (PDFs, documents, etc.)',
              },
              fields: [
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Download Label',
                  localized: true,
                  admin: {
                    description: 'Text to display for the download link',
                  },
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Pages
