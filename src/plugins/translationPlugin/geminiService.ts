import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export type TranslationTargetLocale = 'en' | 'hy' | 'ru'

const localeNames: Record<TranslationTargetLocale, string> = {
  en: 'English',
  hy: 'Armenian',
  ru: 'Russian',
}

export async function translateContent(
  text: string,
  targetLocale: TranslationTargetLocale,
): Promise<string> {
  if (!text || text.trim().length === 0) {
    return ''
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const prompt = `Translate the following text to ${localeNames[targetLocale]}. Only provide the translated text, no explanations or additional content:

"${text}"`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const translatedText = response.text()
    return translatedText.trim()
  } catch (error) {
    console.error(`Error translating to ${targetLocale}:`, error)
    throw error
  }
}

export async function translateObject(
  obj: Record<string, any>,
  targetLocale: TranslationTargetLocale,
  localizedFields: string[],
): Promise<Record<string, any>> {
  const translated: Record<string, any> = { ...obj }

  for (const field of localizedFields) {
    if (obj[field] && typeof obj[field] === 'string') {
      try {
        translated[field] = await translateContent(obj[field], targetLocale)
      } catch (error) {
        console.warn(`Failed to translate field "${field}", using original`, error)
        translated[field] = obj[field]
      }
    } else if (obj[field] && typeof obj[field] === 'object') {
      // Handle nested localized fields (like in blocks)
      translated[field] = { ...obj[field] }
    }
  }

  return translated
}
