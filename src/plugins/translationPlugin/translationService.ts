import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

export type TranslationTargetLocale = 'en' | 'hy' | 'ru'

const localeNames: Record<TranslationTargetLocale, string> = {
  en: 'English',
  hy: 'Armenian',
  ru: 'Russian',
}

// Cache for settings to avoid repeated database calls
let cachedSettings: any = null
let settingsCacheTime = 0
const CACHE_DURATION = 60000 // 1 minute

// Get translation settings from database
async function getTranslationSettings(payload: any): Promise<any> {
  const now = Date.now()

  // Return cached settings if still valid
  if (cachedSettings && now - settingsCacheTime < CACHE_DURATION) {
    return cachedSettings
  }

  try {
    const settings = await payload.findGlobal({
      slug: 'translation-settings',
    })

    cachedSettings = settings || {}
    settingsCacheTime = now
    return cachedSettings
  } catch (error) {
    console.warn('Failed to load translation settings, using defaults:', error)
    return {}
  }
}

// Check if translation is globally enabled
export async function isTranslationEnabled(payload: any): Promise<boolean> {
  const settings = await getTranslationSettings(payload)
  return settings.enableTranslation === true
}

// Get enabled locales for auto-translation from settings
export async function getEnabledLocales(payload: any): Promise<TranslationTargetLocale[]> {
  const settings = await getTranslationSettings(payload)

  if (!settings.enableTranslation) {
    return []
  }

  const enabled: TranslationTargetLocale[] = []

  // Check auto-translate flags (separate from frontend visibility)
  if (settings.translateEnglish !== false) enabled.push('en')
  if (settings.translateArmenian !== false) enabled.push('hy')
  if (settings.translateRussian !== false) enabled.push('ru')

  return enabled
}

// Initialize AI clients with settings from database
async function initClients(payload: any) {
  const settings = await getTranslationSettings(payload)

  // Use settings from database, fallback to env vars
  const geminiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY || ''
  const openaiKey = settings.openaiApiKey || process.env.OPENAI_API_KEY || ''
  const provider = settings.provider || process.env.TRANSLATION_PROVIDER || 'gemini'
  const geminiModel = settings.geminiModel || 'gemini-2.0-flash-exp'
  const openaiModel = settings.openaiModel || 'gpt-4o-mini'

  const genAI = new GoogleGenerativeAI(geminiKey)
  const openai = new OpenAI({ apiKey: openaiKey })

  return { genAI, openai, provider, geminiModel, openaiModel }
}

// Batch translate all fields at once using JSON structured prompting
export async function translateBatch(
  data: Record<string, any>,
  targetLocale: TranslationTargetLocale,
  payload: any,
): Promise<Record<string, any>> {
  if (!data || Object.keys(data).length === 0) {
    return {}
  }

  const { genAI, openai, provider, geminiModel, openaiModel } = await initClients(payload)

  let translated: Record<string, any>
  if (provider === 'openai') {
    translated = await translateBatchWithOpenAI(data, targetLocale, openai, openaiModel)
  } else {
    // Default: Gemini, fallback to OpenAI on error
    try {
      translated = await translateBatchWithGemini(data, targetLocale, genAI, geminiModel)
    } catch (err) {
      console.warn('Gemini failed, falling back to OpenAI:', err)
      translated = await translateBatchWithOpenAI(data, targetLocale, openai, openaiModel)
    }
  }

  return translated
}

async function translateBatchWithGemini(
  data: Record<string, any>,
  targetLocale: TranslationTargetLocale,
  genAI: GoogleGenerativeAI,
  modelName: string,
): Promise<Record<string, any>> {
  const model = genAI.getGenerativeModel({ model: modelName })

  const systemPrompt = [
    `You are a professional translator. Translate all text values in the JSON to ${localeNames[targetLocale]}.`,
    'Rules:',
    '- Return ONLY valid JSON with the same structure',
    '- Translate all string values',
    '- Keep all keys in English',
    '- Preserve array structures',
    '- Never add extra quotation marks',
    '- Maintain original formatting',
  ].join('\n')

  const prompt = `${systemPrompt}\n\nJSON to translate:\n${JSON.stringify(data, null, 2)}`

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  // Extract JSON from response (handle potential markdown code blocks)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/```\s*([\s\S]*?)```/)
  const jsonText = jsonMatch ? jsonMatch[1] : text

  return JSON.parse(jsonText.trim())
}

async function translateBatchWithOpenAI(
  data: Record<string, any>,
  targetLocale: TranslationTargetLocale,
  openai: OpenAI,
  modelName: string,
): Promise<Record<string, any>> {
  const completion = await openai.chat.completions.create({
    model: modelName,
    messages: [
      {
        role: 'system',
        content: [
          `You are a professional translator translating to ${localeNames[targetLocale]}.`,
          'Rules:',
          '- Return ONLY valid JSON with the same structure as input',
          '- Translate all string values to the target language',
          '- Keep all keys in English',
          '- Preserve array structures',
          '- Never add extra quotation marks',
          '- Maintain original formatting',
        ].join('\n'),
      },
      {
        role: 'user',
        content: JSON.stringify(data, null, 2),
      },
    ],
    response_format: { type: 'json_object' },
    max_completion_tokens: 2000,
    temperature: 0.3,
  })

  const responseText = completion.choices[0].message?.content?.trim() || '{}'
  return JSON.parse(responseText)
}
