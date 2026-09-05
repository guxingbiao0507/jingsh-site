import { createClient } from '@libsql/client'

const dbPath = process.env.DATABASE_URL || 'file:.data/tbseo.sqlite'
console.log('db', dbPath)
const db = createClient({ url: dbPath })

const tables = await db.execute(`SELECT name FROM sqlite_master WHERE type='table' AND (name LIKE 'cms_%post%' OR name LIKE 'cms_%trans%')`)
console.log('tables', tables.rows)

const posts = await db.execute(`SELECT id, title, slug, locale, status FROM cms_posts`)
console.log('posts count', posts.rows.length)
console.log('posts', posts.rows)

const cats = await db.execute(`SELECT id, name, slug FROM cms_categories`)
console.log('cats', cats.rows)

const cols = await db.execute(`PRAGMA table_info(cms_posts)`)
console.log('cms_posts cols', cols.rows.map(r => r.name))

await db.close()
