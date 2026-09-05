/**
 * Seed news posts from scraped jingsh.fi content (.data/scraped/jingsh-news.json).
 * Run: npm run scrape:news && npm run seed:news
 */
import { createClient } from '@libsql/client'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envFile = join(root, '.env')
const scrapeFile = join(root, '.data', 'scraped', 'jingsh-news.json')

if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx > -1) process.env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1).replace(/^"|"$/g, '')
  }
}

if (!existsSync(scrapeFile)) {
  console.error('✗ Missing .data/scraped/jingsh-news.json — run: npm run scrape:news')
  process.exit(1)
}

const { posts } = JSON.parse(readFileSync(scrapeFile, 'utf8'))
const db = createClient({ url: process.env.DATABASE_URL || 'file:.data/jingsh.sqlite' })

async function ensureSchema() {
  const info = await db.execute('PRAGMA table_info(cms_posts)')
  const columns = new Set(info.rows.map(row => row.name))
  for (const col of ['meta_title', 'meta_description', 'og_image']) {
    if (!columns.has(col)) {
      await db.execute(`ALTER TABLE cms_posts ADD COLUMN ${col} text`)
      console.log(`added cms_posts.${col}`)
    }
  }
}

async function ensureCategory() {
  const existing = await db.execute(`SELECT id FROM cms_categories WHERE slug = 'news' LIMIT 1`)
  if (existing.rows.length) return Number(existing.rows[0].id)
  const result = await db.execute(
    `INSERT INTO cms_categories (name, slug, description) VALUES (?, ?, ?)`,
    ['News & Blogs', 'news', 'Jingsh Law Firm news and blog posts'],
  )
  return Number(result.lastInsertRowid)
}

async function getAuthorId() {
  const row = await db.execute(`SELECT id FROM cms_users ORDER BY id ASC LIMIT 1`)
  if (row.rows.length) return Number(row.rows[0].id)
  const result = await db.execute(
    `INSERT INTO cms_users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    ['Jingsh Admin', 'admin@jingsh.fi', 'seed-placeholder-not-for-login', 'admin'],
  )
  return Number(result.lastInsertRowid)
}

async function upsertPost(categoryId, authorId, post) {
  const ts = Math.floor(new Date(post.publishedAt).getTime() / 1000)
  const publishedAt = Number.isFinite(ts) ? ts : Math.floor(Date.now() / 1000)
  const now = new Date().toISOString()
  const locale = post.locale || 'en'

  const existing = await db.execute(
    `SELECT id FROM cms_posts WHERE slug = ? AND locale = ? LIMIT 1`,
    [post.slug, locale],
  )

  const fields = {
    title: post.title,
    slug: post.slug,
    locale,
    excerpt: post.excerpt,
    content: post.content,
    cover_image: post.coverImage || null,
    status: 'published',
    type: 'post',
    category_id: categoryId,
    author_id: authorId,
    tags: 'Jingsh Law Firm',
    published_at: publishedAt,
    meta_description: post.excerpt,
    og_image: post.coverImage || null,
    updated_at: now,
  }

  if (existing.rows.length) {
    await db.execute(
      `UPDATE cms_posts SET title=?, slug=?, locale=?, excerpt=?, content=?, cover_image=?, status=?, type=?, category_id=?, author_id=?, tags=?, published_at=?, meta_description=?, og_image=?, updated_at=? WHERE id=?`,
      [
        fields.title, fields.slug, fields.locale, fields.excerpt, fields.content,
        fields.cover_image, fields.status, fields.type, fields.category_id, fields.author_id,
        fields.tags, fields.published_at, fields.meta_description, fields.og_image,
        fields.updated_at, existing.rows[0].id,
      ],
    )
    return Number(existing.rows[0].id)
  }

  const result = await db.execute(
    `INSERT INTO cms_posts (title, slug, locale, excerpt, content, cover_image, status, type, category_id, author_id, tags, published_at, meta_description, og_image, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      fields.title, fields.slug, fields.locale, fields.excerpt, fields.content,
      fields.cover_image, fields.status, fields.type, fields.category_id, fields.author_id,
      fields.tags, fields.published_at, fields.meta_description, fields.og_image, now, now,
    ],
  )
  return Number(result.lastInsertRowid)
}

await ensureSchema()
const categoryId = await ensureCategory()
const authorId = await getAuthorId()

for (const post of posts) {
  await upsertPost(categoryId, authorId, post)
  console.log(`seeded [${post.locale}] ${post.slug} (${post.content.length} chars)`)
}

console.log(`done — ${posts.length} posts`)
await db.close()
