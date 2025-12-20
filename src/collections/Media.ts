import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Automatically resize images to reduce file size
    resizeOptions: {
      width: 2560,
      height: 2560,
      position: 'centre',
      withoutEnlargement: true,
    },
    // Use WebP as the only format for best web performance
    formatOptions: {
      format: 'webp',
      options: {
        quality: 80,
      },
    },
    focalPoint: true,
  },
}
