import type { GlobalConfig } from 'payload'

export const TranslationSettings: GlobalConfig = {
  slug: 'translation-settings',
  label: 'Translation Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'API Configuration',
          fields: [
            {
              name: 'provider',
              type: 'radio',
              label: 'Translation Provider',
              options: [
                {
                  label: 'Google Gemini (Free tier available)',
                  value: 'gemini',
                },
                {
                  label: 'OpenAI (Requires paid account)',
                  value: 'openai',
                },
              ],
              defaultValue: 'gemini',
              required: true,
              admin: {
                description: 'Choose which AI service to use for translations',
              },
            },
            {
              name: 'geminiApiKey',
              type: 'text',
              label: 'Google Gemini API Key',
              admin: {
                description: 'Get your API key from https://aistudio.google.com/app/apikey',
                condition: (data) => data.provider === 'gemini',
              },
            },
            {
              name: 'geminiModel',
              type: 'text',
              label: 'Gemini Model',
              defaultValue: 'gemini-2.0-flash',
              admin: {
                description: 'Model name (e.g., gemini-2.0-flash, gemini-2.5-flash-lite)',
                condition: (data) => data.provider === 'gemini',
              },
            },
            {
              type: 'ui',
              name: 'geminiPricingLink',
              admin: {
                condition: (data) => data.provider === 'gemini',
                components: {
                  Field: '@/components/admin/PricingLink#GeminiPricingLink',
                },
              },
            },
            {
              name: 'openaiApiKey',
              type: 'text',
              label: 'OpenAI API Key',
              admin: {
                description: 'Get your API key from https://platform.openai.com/api-keys',
                condition: (data) => data.provider === 'openai',
              },
            },
            {
              name: 'openaiModel',
              type: 'text',
              label: 'OpenAI Model',
              defaultValue: 'gpt-4o-mini',
              admin: {
                description: 'Model name (e.g., gpt-4o-mini, gpt-4o, gpt-4-turbo)',
                condition: (data) => data.provider === 'openai',
              },
            },
            {
              type: 'ui',
              name: 'openaiPricingLink',
              admin: {
                condition: (data) => data.provider === 'openai',
                components: {
                  Field: '@/components/admin/PricingLink#OpenAIPricingLink',
                },
              },
            },
          ],
        },
        {
          label: 'Locale Settings',
          description:
            'Control which languages are available on your website and for auto-translation',
          fields: [
            {
              type: 'collapsible',
              label: 'English (EN)',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'translateEnglish',
                      type: 'checkbox',
                      label: 'Auto-Translate',
                      defaultValue: true,
                      admin: {
                        width: '50%',
                        description: 'Automatically translate content to English',
                      },
                    },
                    {
                      name: 'showEnglish',
                      type: 'checkbox',
                      label: 'Show in Frontend',
                      defaultValue: true,
                      admin: {
                        width: '50%',
                        description: 'Display English in language switcher',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Armenian (HY)',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'translateArmenian',
                      type: 'checkbox',
                      label: 'Auto-Translate',
                      defaultValue: true,
                      admin: {
                        width: '50%',
                        description: 'Automatically translate content to Armenian',
                      },
                    },
                    {
                      name: 'showArmenian',
                      type: 'checkbox',
                      label: 'Show in Frontend',
                      defaultValue: true,
                      admin: {
                        width: '50%',
                        description: 'Display Armenian in language switcher',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Russian (RU)',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'translateRussian',
                      type: 'checkbox',
                      label: 'Auto-Translate',
                      defaultValue: true,
                      admin: {
                        width: '50%',
                        description: 'Automatically translate content to Russian',
                      },
                    },
                    {
                      name: 'showRussian',
                      type: 'checkbox',
                      label: 'Show in Frontend',
                      defaultValue: true,
                      admin: {
                        width: '50%',
                        description: 'Display Russian in language switcher',
                      },
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Important Information',
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'text',
                  name: 'localeHelp',
                  admin: {
                    readOnly: true,
                    description:
                      '• Auto-Translate: Automatically translate new content to this language\n' +
                      '• Show in Frontend: Display this language in the website language switcher\n' +
                      '• You can translate without showing (for testing) or show without auto-translation (manual translation)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Status & Testing',
          fields: [
            {
              name: 'enableTranslation',
              type: 'checkbox',
              label: 'Enable Auto-Translation',
              defaultValue: true,
              admin: {
                description:
                  'Turn off to temporarily disable automatic translations without losing your settings',
              },
            },
          ],
        },
      ],
    },
  ],
}
