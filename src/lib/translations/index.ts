import { en } from './en'
import { hy } from './hy'
import { ru } from './ru'

export const translations = {
  en,
  hy,
  ru,
}

export type Locale = keyof typeof translations

export function getTranslations(locale: string) {
  return translations[locale as Locale] || translations.en
}
