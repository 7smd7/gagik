import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  versions: {
    max: 100,
  },
  fields: [
    {
      name: 'copyright',
      type: 'text',
      localized: true,
    },
    {
      name: 'socials',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'platform',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}

export default Footer
