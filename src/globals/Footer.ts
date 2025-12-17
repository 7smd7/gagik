import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  fields: [
    {
      name: 'copyright',
      type: 'text',
    },
    {
      name: 'socials',
      type: 'array',
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
