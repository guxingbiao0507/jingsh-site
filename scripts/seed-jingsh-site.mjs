import { createClient } from '@libsql/client'
import { Scrypt } from '@adonisjs/hash/drivers/scrypt'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envFile = join(root, '.env')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx > -1) process.env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1).replace(/^"|"$/g, '')
  }
}

const DB_URL = process.env.DATABASE_URL || 'file:.data/tbseo.sqlite'
const ADMIN_EMAIL = process.env.JINGSH_ADMIN_EMAIL || 'admin@jingsh.fi'
const ADMIN_PASSWORD = process.argv[2] || process.env.JINGSH_ADMIN_PASSWORD || 'JingshAdmin2026'

const db = createClient({ url: DB_URL })
const scrypt = new Scrypt()

/** From https://www.jingsh.fi/ (GA4 + Microsoft Clarity). Bing meta not present on legacy site. */
const ANALYTICS = {
  ga4MeasurementId: 'G-T7LDC2SCF5',
  clarityProjectId: 's16fx7yyr5',
  bingSiteVerification: '',
}

const GLOBAL_SETTINGS = {
  siteName: 'Jingsh Law Firm',
  siteDescription: 'Jingsh Law Firm — professional legal services in corporate, IP, dispute resolution, capital markets and more. 9,000+ lawyers across 50+ countries.',
  siteKeywords: 'jingsh, legal service, accounting service, lawyer, Finland, Europe, Chinese speaking legal and accounting service in Finland and europe, company registration',
  footerText: '© Jingsh Law Firm. All rights reserved.',
  companyPhone: '+358',
  companyEmail: 'demi.wei@jingsh.fi',
  companyAddress: 'Fredrikinkatu 23 D 4, 00120 Helsinki, Finland',
  companyHours: 'Mon-Fri 9:00-17:00',
  postsPerPage: '9',
  ogImage: 'https://www.jingsh.fi/assets/themes/jingsh/images/jingshi-top-bg.png',
  robotsTxt: '',
  googleVerification: '',
  ...ANALYTICS,
}

const LOCALE_SEO = {
  en: {
    siteTitle: 'Jingsh Law Firm',
    siteDescription: 'Jingsh Law Firm — professional legal services in corporate, IP, dispute resolution, capital markets and more. Nordic and global presence.',
    siteKeywords: GLOBAL_SETTINGS.siteKeywords,
    ogImage: GLOBAL_SETTINGS.ogImage,
  },
  cn: {
    siteTitle: '京师律师事务所',
    siteDescription: '京师律师事务所 — 公司、知识产权、争议解决、资本市场等专业法律服务。9000+律师，覆盖50+国家，北欧及全球布局。',
    siteKeywords: '京师, 律师事务所, 法律服务, 芬兰, 欧洲, 跨境, 公司注册, 合规',
    ogImage: GLOBAL_SETTINGS.ogImage,
  },
}

async function upsertSetting(key, value) {
  await db.execute(
    `INSERT INTO cms_settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, value],
  )
}

async function upsertTranslation(locale, key, value) {
  const existing = await db.execute(
    `SELECT id FROM cms_translations WHERE locale = ? AND key = ? LIMIT 1`,
    [locale, key],
  )
  const now = Math.floor(Date.now() / 1000)
  if (existing.rows.length) {
    await db.execute(
      `UPDATE cms_translations SET value = ?, updated_at = ? WHERE locale = ? AND key = ?`,
      [value, now, locale, key],
    )
    return
  }
  await db.execute(
    `INSERT INTO cms_translations (key, locale, value, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
    [key, locale, value, now, now],
  )
}

async function ensureAdmin() {
  const hash = await scrypt.make(ADMIN_PASSWORD)
  const users = await db.execute(`SELECT id, email FROM cms_users WHERE role = 'admin' LIMIT 1`)

  if (users.rows.length) {
    await db.execute(`UPDATE cms_users SET email = ?, password = ? WHERE id = ?`, [
      ADMIN_EMAIL.toLowerCase(),
      hash,
      users.rows[0].id,
    ])
    console.log(`admin password reset for ${ADMIN_EMAIL}`)
    return
  }

  await db.execute(
    `INSERT INTO cms_users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    ['Jingsh Admin', ADMIN_EMAIL.toLowerCase(), hash, 'admin'],
  )
  console.log(`admin created: ${ADMIN_EMAIL}`)
}

async function seedSettings() {
  for (const [key, value] of Object.entries(GLOBAL_SETTINGS)) {
    await upsertSetting(key, value)
  }

  for (const [locale, fields] of Object.entries(LOCALE_SEO)) {
    for (const [field, value] of Object.entries(fields)) {
      await upsertTranslation(locale, `settings.${field}`, value)
    }
  }
  console.log('site settings + locale SEO seeded')
}

await ensureAdmin()
await seedSettings()
console.log('\nAdmin login:')
console.log(`  URL:      /en/admin/login`)
console.log(`  Email:    ${ADMIN_EMAIL}`)
console.log(`  Password: ${ADMIN_PASSWORD}`)
console.log('\nAnalytics:')
console.log(`  GA4:     ${ANALYTICS.ga4MeasurementId}`)
console.log(`  Clarity: ${ANALYTICS.clarityProjectId}`)
console.log(`  Bing:    (not on legacy site — set bingSiteVerification in /admin/settings)`)

await db.close()
