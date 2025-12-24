import type { Config, Plugin } from 'payload'
import {
  TranslationTargetLocale,
  translateBatch,
  getEnabledLocales,
  isTranslationEnabled,
} from './translationService'
import { log } from 'console'

interface TranslationPayload {
  id: string | number
  sourceLocale: string
  collectionSlug: string
  data: Record<string, any>
}

// Dynamically extract localized field paths from collection config
function getLocalizedFieldPaths(collectionConfig: any, prefix: string = ''): string[] {
  const localizedPaths: string[] = []

  if (!collectionConfig?.fields) return localizedPaths

  for (const field of collectionConfig.fields) {
    const fieldPath = prefix ? `${prefix}.${field.name}` : field.name

    // Check if field is localized
    if (field.localized === true && field.name) {
      localizedPaths.push(fieldPath)
    }

    // Handle nested fields (blocks, groups, arrays with fields)
    if (field.type === 'group' && field.fields) {
      localizedPaths.push(...getLocalizedFieldPaths({ fields: field.fields }, fieldPath))
    }

    if (field.type === 'array' && field.fields) {
      localizedPaths.push(...getLocalizedFieldPaths({ fields: field.fields }, fieldPath))
    }

    if (field.type === 'blocks' && field.blocks) {
      for (const block of field.blocks) {
        if (block.fields) {
          localizedPaths.push(...getLocalizedFieldPaths({ fields: block.fields }, fieldPath))
        }
      }
    }

    // Handle tabs
    if (field.type === 'tabs' && field.tabs) {
      for (const tab of field.tabs) {
        if (tab.fields) {
          localizedPaths.push(...getLocalizedFieldPaths({ fields: tab.fields }, prefix))
        }
      }
    }
  }

  return localizedPaths
}

const ALL_LOCALES: TranslationTargetLocale[] = ['en', 'hy', 'ru']

// Helper function to get a value from nested object path
function getNestedValue(obj: any, path: string): any {
  const parts = path.split('.')
  let current = obj

  for (const part of parts) {
    if (current == null) return undefined
    current = current[part]
  }

  return current
}

// Helper function to set a value in nested object path
function setNestedValue(obj: any, path: string, value: any): void {
  const parts = path.split('.')
  let current = obj

  for (let i = 0; i < parts.length - 1; i++) {
    if (current[parts[i]] == null) {
      current[parts[i]] = {}
    }
    current = current[parts[i]]
  }

  current[parts[parts.length - 1]] = value
}

// Helper function to extract all translatable values into a flat object
function extractTranslatableFields(
  data: Record<string, any>,
  fields: string[],
): Record<string, any> {
  const extracted: Record<string, any> = {}

  for (const fieldPath of fields) {
    const value = getNestedValue(data, fieldPath)
    if (value) {
      // Use field path as key to maintain mapping
      extracted[fieldPath] = value
    }
  }

  return extracted
}

// Helper function to apply translated values back to the structure
function applyTranslatedFields(translatedFlat: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [fieldPath, value] of Object.entries(translatedFlat)) {
    if (value && (typeof value === 'string' ? value.trim().length > 0 : true)) {
      setNestedValue(result, fieldPath, value)
    }
  }

  return result
}

async function translateFields(
  data: Record<string, any>,
  fields: string[],
  targetLocale: TranslationTargetLocale,
  payload: any,
): Promise<Record<string, any>> {
  try {
    // Extract all translatable fields into a flat structure
    const toTranslate = extractTranslatableFields(data, fields)

    if (Object.keys(toTranslate).length === 0) {
      return {}
    }

    // Translate all fields in one batch using JSON structured prompting
    const translated = await translateBatch(toTranslate, targetLocale, payload)

    // Apply translations back to nested structure
    return applyTranslatedFields(translated)
  } catch (error) {
    console.error(`Failed to batch translate fields:`, error)
    return {}
  }
}

async function translateAndUpdateLocale(
  payload: any,
  translationData: TranslationPayload,
  targetLocale: TranslationTargetLocale,
  localizedFields: string[],
): Promise<void> {
  const { id, sourceLocale, collectionSlug, data } = translationData

  if (localizedFields.length === 0) {
    console.log(`No localized fields found for collection: ${collectionSlug}`)
    return
  }

  // Don't translate to the same locale
  if (sourceLocale === targetLocale) {
    return
  }

  try {
    console.log(
      `[Translation] Translating ${collectionSlug}/${id} from ${sourceLocale} to ${targetLocale}`,
    )

    // First, fetch the existing document in the target locale
    const existingDoc = await payload.findByID({
      collection: collectionSlug,
      id,
      locale: targetLocale,
      fallbackLocale: false,
    })

    // Translate all localized fields
    const translatedFields = await translateFields(data, localizedFields, targetLocale, payload)

    // Skip update if no fields were successfully translated
    if (Object.keys(translatedFields).length === 0) {
      console.log(
        `[Translation] No fields successfully translated for ${collectionSlug}/${id} to ${targetLocale}, skipping update`,
      )
      return
    }

    // Merge translated fields with existing document data to preserve required fields
    const mergedData = { ...existingDoc, ...translatedFields }

    // Update the same document in the target locale using Payload API
    // Use context to prevent triggering translation hook again
    await payload.update({
      collection: collectionSlug,
      id,
      data: mergedData,
      locale: targetLocale,
      fallbackLocale: false,
      context: {
        skipTranslation: true, // Flag to prevent infinite loop
      },
    })

    console.log(`[Translation] Successfully translated ${collectionSlug}/${id} to ${targetLocale}`)
  } catch (error) {
    console.error(
      `[Translation] Error translating ${collectionSlug}/${id} to ${targetLocale}:`,
      error,
    )
  }
}

export const translationPlugin = (): Plugin => {
  return (incomingConfig: Config) => {
    const config = { ...incomingConfig }

    if (!config.hooks) {
      config.hooks = {}
    }

    // Hook into afterChange for all collections with localized fields
    config.collections?.forEach((originalCollectionConfig) => {
      // Extract localized fields from this collection's schema
      const localizedFields = getLocalizedFieldPaths(originalCollectionConfig)

      if (localizedFields.length === 0) {
        return
      }

      const collectionSlug = originalCollectionConfig.slug

      if (originalCollectionConfig) {
        if (!originalCollectionConfig.hooks) {
          originalCollectionConfig.hooks = {}
        }

        const originalAfterChange = originalCollectionConfig.hooks.afterChange

        originalCollectionConfig.hooks.afterChange = [
          ...(Array.isArray(originalAfterChange)
            ? originalAfterChange
            : originalAfterChange
              ? [originalAfterChange]
              : []),
          async ({ doc, operation, req, context }) => {
            // Fast checks first (no I/O operations)

            // Only trigger on create operations
            if (operation !== 'create') {
              return
            }

            // Skip if this update was triggered by the translation plugin itself
            if (context?.skipTranslation) {
              return
            }

            // Now check database setting (cached, but still slower than above checks)
            const translationEnabled = await isTranslationEnabled(req.payload)
            if (!translationEnabled) {
              return
            }

            const sourceLocale = req.locale || 'en'

            const translationData: TranslationPayload = {
              id: doc.id,
              sourceLocale,
              collectionSlug,
              data: doc,
            }

            // Get enabled locales from settings and exclude source locale
            const enabledLocales = await getEnabledLocales(req.payload)
            const targetLocales = enabledLocales.filter((locale) => locale !== sourceLocale)

            if (targetLocales.length === 0) {
              console.log('[Translation] No target locales enabled, skipping translation')
              return
            }

            console.log(
              `[Translation] Starting translation for ${collectionSlug}/${doc.id} from ${sourceLocale} to ${targetLocales.join(', ')}`,
            )

            // Translate to all enabled locales (non-blocking)
            targetLocales.forEach((targetLocale) => {
              translateAndUpdateLocale(
                req.payload,
                translationData,
                targetLocale,
                localizedFields,
              ).catch((error) => {
                console.error(`[Translation] Background translation failed:`, error)
              })
            })
          },
        ]
      }
    })

    return config
  }
}
