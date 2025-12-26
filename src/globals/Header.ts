import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  versions: {
    max: 100,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Gagik Harutyunyan',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'navItems',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
  ],
}

export default Header
