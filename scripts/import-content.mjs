import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(process.cwd())
const data = JSON.parse(readFileSync(join(root, '.data', 'scraped', 'all-content.json'), 'utf8'))

const envContent = readFileSync(join(root, '.env'), 'utf8')
const env = {}
for (const line of envContent.split(/\n/)) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx > -1) env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1)
}
const DATABASE_URL = env.DATABASE_URL || `file:.data/${env.DATABASE_NAME || 'cms'}.sqlite`
import { createClient } from '@libsql/client'
const db = createClient({ url: DATABASE_URL })

function normalize(s) {
  return String(s || '').replace(/[\s？！。，、；：！？""''（）【】…—～·]/g, '').toLowerCase()
}

// Simple similarity: returns 0-1 ratio based on shared character n-grams
function similarity(a, b) {
  const aa = normalize(a), bb = normalize(b)
  if (!aa && !bb) return 1
  if (!aa || !bb) return 0
  // Jaccard similarity on 2-char shingles
  const setA = new Set(), setB = new Set()
  for (let i = 0; i < aa.length - 1; i++) setA.add(aa.slice(i, i + 2))
  for (let i = 0; i < bb.length - 1; i++) setB.add(bb.slice(i, i + 2))
  const inter = [...setA].filter(x => setB.has(x)).length
  const union = new Set([...setA, ...setB]).size
  return inter / union
}

// Prefer title over name, handle empty strings correctly
function itemLabel(item) {
  // 'title' field exists for posts, 'name' for products
  // Don't use || since empty string is falsy
  return item.title !== undefined && item.title !== null ? item.title : item.name
}

function findMatch(items, title) {
  // Exact match
  const exact = items.find(item => itemLabel(item) === title)
  if (exact) return exact.id

  // Fuzzy: strip punctuation/case
  const nt = normalize(title)
  const cleanMatch = items.find(item => normalize(itemLabel(item)) === nt)
  if (cleanMatch) return cleanMatch.id

  // Substring match
  const substr = items.find(item => {
    const dn = normalize(itemLabel(item))
    return nt.includes(dn) || dn.includes(nt)
  })
  if (substr) return substr.id

  // N-gram similarity (for duplicated-substring titles like "输送带输送带")
  const simMatch = items.reduce((best, item) => {
    const s = similarity(title, itemLabel(item))
    return s > best[0] ? [s, item] : best
  }, [0, null])
  if (simMatch[0] >= 0.7) return simMatch[1].id

  return null
}

async function main() {
  const [products, casesRows, newsRows] = await Promise.all([
    db.execute('SELECT id, name, slug FROM cms_products WHERE status = ?', ['published']),
    db.execute("SELECT id, slug, title FROM cms_posts WHERE type='post' AND status='published' AND category_id IN (SELECT id FROM cms_categories WHERE slug='cases')"),
    db.execute("SELECT id, slug, title FROM cms_posts WHERE type='post' AND status='published' AND category_id IN (SELECT id FROM cms_categories WHERE slug='news')"),
  ])

  console.log(`DB: ${products.rows.length} products, ${casesRows.rows.length} cases, ${newsRows.rows.length} news`)

  let updated = { products: 0, cases: 0, news: 0, skipped: 0 }

  for (const r of data) {
    let id = null
    if (r.type === 'product') id = findMatch(products.rows, r.title)
    else if (r.type === 'case') id = findMatch(casesRows.rows, r.title)
    else if (r.type === 'news') id = findMatch(newsRows.rows, r.title)

    if (!id) {
      console.log(`  ✗ No match: ${r.type} "${r.title}"`)
      updated.skipped++
      continue
    }

    const content = r.markdown || r.text || ''
    const coverImage = r.coverImage || null
    const table = r.type === 'product' ? 'cms_products' : 'cms_posts'
    await db.execute(`UPDATE ${table} SET content = ?, cover_image = ? WHERE id = ?`, [content, coverImage, id])
    updated[r.type + 's']++
    console.log(`  ✓ ${r.type} "${r.title}" (id=${id}, ${content.length} chars)`)
  }

  console.log(`\nDone: +${updated.products} products, +${updated.cases} cases, +${updated.news} news | skipped: ${updated.skipped}`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => db.close())
