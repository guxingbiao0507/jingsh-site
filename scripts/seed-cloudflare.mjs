/**
 * Seed local SQLite, then sync CMS data to Cloudflare D1 (remote).
 *
 * Usage: npm run seed:cloudflare
 */
import { spawnSync } from 'node:child_process'
import { createClient } from '@libsql/client'
import { readFileSync, existsSync, writeFileSync, unlinkSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const migrationsDir = join(root, 'node_modules/nuxtcms/server/database/migrations')

function loadEnvFile(path) {
  const env = {}
  if (!existsSync(path)) return env
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx > -1) env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^"|"$/g, '')
  }
  return env
}

const dotenv = loadEnvFile(join(root, '.env'))
const cf = loadEnvFile(join(root, '.cloudflare.env'))
const DATABASE = cf.CF_D1_DATABASE || 'jingshi'
const localUrl = dotenv.DATABASE_URL || 'file:.data/jingsh.sqlite'

const childEnv = {
  ...process.env,
  CLOUDFLARE_API_TOKEN: cf.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_ACCOUNT_ID: cf.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID,
}

function run(cmd, extra = {}) {
  console.log(`\n▶ ${cmd}`)
  const res = spawnSync(cmd, { cwd: root, shell: true, stdio: 'inherit', env: { ...childEnv, ...extra } })
  if (res.status !== 0) process.exit(res.status || 1)
}

function runAllowFail(cmd) {
  spawnSync(cmd, { cwd: root, shell: true, stdio: 'inherit', env: childEnv })
}

async function ensureLocalSchema(dbUrl) {
  const rel = dbUrl.startsWith('file:') ? dbUrl.slice(5) : dbUrl
  const filePath = resolve(root, rel)
  mkdirSync(dirname(filePath), { recursive: true })

  const db = createClient({ url: `file:${filePath.replace(/\\/g, '/')}` })
  const tables = await db.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name='cms_users'`)
  if (tables.rows.length) {
    await db.close()
    return
  }

  console.log('▶ Applying local migrations to', dbUrl)
  const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()
  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), 'utf8')
    const statements = sql
      .split(/-->\s*statement-breakpoint/g)
      .map(s => s.trim())
      .filter(Boolean)
    for (const stmt of statements) {
      try {
        await db.execute(stmt)
      }
      catch (err) {
        if (!String(err.message).includes('duplicate column')) throw err
      }
    }
  }

  try {
    await db.execute('ALTER TABLE cms_posts ADD COLUMN meta_title text')
  }
  catch { /* already exists */ }

  await db.close()
  console.log('  Local schema ready')
}

function sqlValue(v) {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL'
  return `'${String(v).replace(/'/g, "''")}'`
}

function runRemoteSql(sql, label) {
  const file = join(tmpdir(), `jingsh-d1-${Date.now()}.sql`)
  writeFileSync(file, sql, 'utf8')
  try {
    console.log(`▶ Remote SQL: ${label}`)
    run(`pnpm exec wrangler d1 execute ${DATABASE} --remote --file="${file}"`)
  }
  finally {
    try { unlinkSync(file) } catch { /* ignore */ }
  }
}

console.log('═══ Step 1: Prepare local database ═══')
await ensureLocalSchema(localUrl)

console.log('\n═══ Step 2: Seed local database ═══')
run('node scripts/seed-jingsh-site.mjs', { DATABASE_URL: localUrl })
run('node scripts/seed-jingsh-news.mjs', { DATABASE_URL: localUrl })

console.log('\n═══ Step 3: Export local CMS data ═══')
const db = createClient({ url: localUrl })

const users = (await db.execute('SELECT * FROM cms_users ORDER BY id')).rows
const categories = (await db.execute('SELECT * FROM cms_categories ORDER BY id')).rows
const settings = (await db.execute('SELECT * FROM cms_settings ORDER BY key')).rows
const translations = (await db.execute('SELECT * FROM cms_translations ORDER BY id')).rows
const posts = (await db.execute('SELECT * FROM cms_posts ORDER BY id')).rows

await db.close()

console.log(`  users=${users.length} categories=${categories.length} settings=${settings.length} translations=${translations.length} posts=${posts.length}`)

console.log('\n═══ Step 4: Sync to Cloudflare D1 ═══')
runAllowFail(`pnpm exec wrangler d1 execute ${DATABASE} --remote --command="ALTER TABLE cms_posts ADD COLUMN meta_title text"`)

const statements = [
  'PRAGMA foreign_keys = OFF;',
  'DELETE FROM cms_posts;',
  'DELETE FROM cms_translations;',
  'DELETE FROM cms_settings;',
  'DELETE FROM cms_categories;',
  'DELETE FROM cms_users;',
]

for (const u of users) {
  statements.push(
    `INSERT INTO cms_users (id, email, name, password, role, avatar, created_at) VALUES (${[
      u.id, sqlValue(u.email), sqlValue(u.name), sqlValue(u.password), sqlValue(u.role),
      sqlValue(u.avatar), sqlValue(u.created_at),
    ].join(', ')});`,
  )
}

for (const c of categories) {
  statements.push(
    `INSERT INTO cms_categories (id, name, slug, description) VALUES (${[
      c.id, sqlValue(c.name), sqlValue(c.slug), sqlValue(c.description),
    ].join(', ')});`,
  )
}

for (const s of settings) {
  statements.push(
    `INSERT INTO cms_settings (key, value) VALUES (${sqlValue(s.key)}, ${sqlValue(s.value)});`,
  )
}

for (const t of translations) {
  statements.push(
    `INSERT INTO cms_translations (id, key, locale, value, created_at, updated_at) VALUES (${[
      t.id, sqlValue(t.key), sqlValue(t.locale), sqlValue(t.value),
      sqlValue(t.created_at), sqlValue(t.updated_at),
    ].join(', ')});`,
  )
}

for (const p of posts) {
  const cols = [
    'id', 'title', 'slug', 'locale', 'excerpt', 'content', 'cover_image', 'status', 'type',
    'category_id', 'author_id', 'tags', 'published_at', 'created_at', 'updated_at',
    'meta_description', 'og_image', 'canonical_url', 'focus_keyword', 'robots', 'content_mobile',
  ]
  const optional = ['meta_title']
  for (const col of optional) {
    if (col in p) cols.push(col)
  }
  const vals = cols.map((col) => sqlValue(p[col]))
  statements.push(`INSERT INTO cms_posts (${cols.join(', ')}) VALUES (${vals.join(', ')});`)
}

statements.push('PRAGMA foreign_keys = ON;')

// D1 execute file size limit — split into chunks
const chunkSize = 8
for (let i = 0; i < statements.length; i += chunkSize) {
  const chunk = statements.slice(i, i + chunkSize).join('\n')
  runRemoteSql(chunk, `batch ${Math.floor(i / chunkSize) + 1}/${Math.ceil(statements.length / chunkSize)}`)
}

console.log('\n═══ Step 5: Verify remote API ═══')
const siteUrl = (dotenv.NUXT_PUBLIC_SITE_URL || 'https://jingshi.pages.dev').replace(/\/$/, '')
const pagesHost = `https://${cf.CF_PAGES_PROJECT || 'jingshi'}.pages.dev`

for (const base of [pagesHost, siteUrl]) {
  try {
    const res = await fetch(`${base}/api/public/posts?limit=1&category=news&locale=en`)
    const data = await res.json()
    const title = data?.items?.[0]?.title || '(empty)'
    console.log(`  ${base} → posts: ${data?.total ?? 0}, latest: ${title}`)
  }
  catch (err) {
    console.log(`  ${base} → verify skipped (${err.message})`)
  }
}

console.log('\n✅ Cloudflare D1 sync complete')
console.log(`   Admin: ${pagesHost}/en/admin/login`)
console.log('   Email: admin@jingsh.fi  Password: JingshAdmin2026')
