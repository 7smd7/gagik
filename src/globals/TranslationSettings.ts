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
              name: 'openaiApiKey',
              type: 'text',
              label: 'OpenAI API Key',
              admin: {
                description: 'Get your API key from https://platform.openai.com/api-keys',
                condition: (data) => data.provider === 'openai',
              },
            },
          ],
        },
        {
          label: 'Locale Settings',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'enableEnglish',
                  type: 'checkbox',
                  label: 'Enable English',
                  defaultValue: true,
                  admin: {
                    width: '33%',
                    description: 'Auto-translate to English',
                  },
                },
                {
                  name: 'enableArmenian',
                  type: 'checkbox',
                  label: 'Enable Armenian',
                  defaultValue: true,
                  admin: {
                    width: '33%',
                    description: 'Auto-translate to Armenian',
                  },
                },
                {
                  name: 'enableRussian',
                  type: 'checkbox',
                  label: 'Enable Russian',
                  defaultValue: true,
                  admin: {
                    width: '33%',
                    description: 'Auto-translate to Russian',
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
