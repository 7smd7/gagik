import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
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
              admin: {
                description: 'Main hero title (e.g., "GAGIK HARUTYUNYAN")',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle',
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
