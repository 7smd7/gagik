import type { CollectionConfig } from 'payload'

export const Series: CollectionConfig = {
  slug: 'series',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['cover', 'name', 'startDate', 'endDate'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Series Name',
      admin: {
        description: 'Name of the photography series (e.g., "Street Photography of Yerevan")',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Cover Image',
      admin: {
        description: 'Cover image for the series',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Start Date',
      admin: {
        description: 'When the series started',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'End Date',
      admin: {
        description: 'When the series ended',
      },
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      label: 'Images',
      admin: {
        description: 'Images in this series',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          admin: {
            description: 'Title of the photograph',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          admin: {
            description: 'Description of the photograph',
          },
        },
        {
          name: 'date',
          type: 'date',
          label: 'Date',
          admin: {
            description: 'Date the photograph was taken',
          },
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          admin: {
            description: 'Where the photograph was taken',
          },
        },
        {
          name: 'archiveNumber',
          type: 'text',
          label: 'Archive Number',
          admin: {
            description: 'Archive or reference number',
          },
        },
      ],
    },
  ],
}

export default Series
