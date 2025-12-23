import type { CollectionConfig } from 'payload'

export const Works: CollectionConfig = {
  slug: 'works',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['image', 'title', 'year', 'place'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Artwork Image',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Title',
      admin: {
        description: 'Title of the work (e.g., "Gold Mine, Serra Pelada, Brazil")',
      },
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      label: 'Year',
      admin: {
        description: 'Year the photograph was taken',
      },
    },
    {
      name: 'place',
      type: 'text',
      localized: true,
      label: 'Place',
      admin: {
        description: 'Location where the photograph was taken',
      },
    },
    {
      name: 'artist',
      type: 'text',
      label: 'Artist',
      defaultValue: 'Gagik Harutyunyan',
      admin: {
        description: 'Artist name (defaults to Gagik Harutyunyan)',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      admin: {
        description: 'Order in which the work appears in the gallery (lower = first)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        description: 'Show this work in featured sections',
      },
    },
  ],
}

export default Works
