import type { CollectionConfig } from 'payload'

export const Press: CollectionConfig = {
  slug: 'press',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publisher', 'date'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
      admin: {
        description: 'Title of the press article',
      },
    },
    {
      name: 'author',
      type: 'text',
      label: 'Author',
      admin: {
        description: 'Writer or author name',
      },
    },
    {
      name: 'publisher',
      type: 'text',
      label: 'Publisher',
      admin: {
        description: 'Publication name (e.g., "The New York Times", "The Times")',
      },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Publication Date',
      admin: {
        description: 'Date of publication',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'PDF File',
      admin: {
        description: 'Upload PDF of the press article',
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL',
      admin: {
        description: 'Link to the press article page',
      },
    },
  ],
}

export default Press
