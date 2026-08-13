import type { DB } from './index'
import { schema } from './index'
import { count } from 'drizzle-orm'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * One-time seed: load existing i18n/locales/*.json files and populate cms_translations table.
 * This preserves all existing UI text when migrating from JSON-based to DB-driven i18n.
 */
export async function seedTranslations(db: DB, baseDir: string = process.cwd()): Promise<void> {
  // Check if already seeded
  const existing = await db.select({ c: count() }).from(schema.translations).get()
  if ((existing?.c ?? 0) > 0) return

  const locales = ['cn', 'en', 'th', 'my']
  const localeDir = resolve(baseDir, 'i18n', 'locales')

  // Collect all translation keys and values from all locale files
  const allKeys = new Set<string>()
  const localeData: Record<string, Record<string, any>> = {}

  for (const localeCode of locales) {
    const filePath = resolve(localeDir, `${localeCode}.json`)
    if (!existsSync(filePath)) {
      console.warn(`[seed-translations] 找不到文件: ${filePath}`)
      localeData[localeCode] = {}
      continue
    }

    try {
      const content = readFileSync(filePath, 'utf-8')
      localeData[localeCode] = JSON.parse(content)
    }
    catch (err) {
      console.error(`[seed-translations] 解析失败 ${localeCode}.json:`, err)
      localeData[localeCode] = {}
      continue
    }
  }

  // Flatten and collect all keys
  function flattenKeys(obj: any, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(obj || {})) {
      if (key === '_meta') continue
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'string') {
        result[fullKey] = value
        allKeys.add(fullKey)
      }
      else if (typeof value === 'object' && value !== null) {
        Object.assign(result, flattenKeys(value, fullKey))
      }
    }
    return result
  }

  const flatData: Record<string, Record<string, string>> = {}
  for (const [localeCode, data] of Object.entries(localeData)) {
    flatData[localeCode] = flattenKeys(data)
  }

  // Insert rows: one per (key, locale) pair, with empty value if missing in that locale
  const now = new Date()
  const rows = []
  for (const key of Array.from(allKeys).sort()) {
    for (const localeCode of locales) {
      const value = flatData[localeCode]?.[key] ?? ''
      rows.push({
        key,
        locale: localeCode,
        value,
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  if (rows.length === 0) {
    console.warn('[seed-translations] 没有找到翻译内容')
    return
  }

  // Batch insert
  const batchSize = 100
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    await db.insert(schema.translations).values(batch).run()
  }

  console.info(`[seed-translations] 已播种 ${rows.length} 条翻译记录`)
}
