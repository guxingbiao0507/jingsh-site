import { createClient } from '@libsql/client'

const db = createClient({ url: 'file:.data/tbseo.sqlite' })
const p = await db.execute('SELECT id, title, published_at, typeof(published_at) as t FROM cms_posts LIMIT 3')
console.log(p.rows)
await db.close()
