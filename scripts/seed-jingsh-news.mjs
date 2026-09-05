import { createClient } from '@libsql/client'
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

const db = createClient({ url: process.env.DATABASE_URL || 'file:.data/tbseo.sqlite' })

const posts = [
  {
    slug: 'jingsh-lawyer-received-invitation-for-the-fifth-bifp-in-russia',
    publishedAt: '2024-05-29T00:00:00.000Z',
    en: {
      title: 'Jingsh Lawyer Received Invitation for the fifth BIFP in Russia',
      excerpt: 'From 27 to 29 May 2024, the fifth Baikal International Forum of Partners (shortened as BIFP) was held in Irkutsk, Russia. Jingsh Lawyer Wen Guobiao, the Director of the China-Russia Commercial Service',
      content: `# Jingsh Lawyer Received Invitation for the fifth BIFP in Russia

From 27 to 29 May 2024, the fifth Baikal International Forum of Partners (shortened as BIFP) was held in Irkutsk, Russia.

Jingsh Lawyer Wen Guobiao, the Director of the China-Russia Commercial Service, received an invitation to participate in this important international legal and business forum.

The forum brought together legal professionals and business leaders from across the region to discuss cross-border cooperation and international legal services.`,
    },
    cn: {
      title: '京师律师受邀出席第五届俄罗斯贝加尔国际合作伙伴论坛',
      excerpt: '2024年5月27日至29日，第五届贝加尔国际合作伙伴论坛（BIFP）在俄罗斯伊尔库茨克举行。京师律师温国彪，中俄商业服务部主任',
      content: `# 京师律师受邀出席第五届俄罗斯贝加尔国际合作伙伴论坛

2024年5月27日至29日，第五届贝加尔国际合作伙伴论坛（BIFP）在俄罗斯伊尔库茨克举行。

京师律师温国彪，中俄商业服务部主任，受邀出席这一重要的国际法律与商业论坛。

论坛汇聚了来自各地区的法律专业人士和商业领袖，共同探讨跨境合作与国际法律服务。`,
    },
  },
  {
    slug: 'jingsh-korea-incorporated-officially-established-in-seoul-korea',
    publishedAt: '2024-04-18T00:00:00.000Z',
    en: {
      title: 'Jingsh Korea Incorporated Officially Established in Seoul, Korea',
      excerpt: 'On April 18, 2024, the Seoul Central District Court approved and issued the registration certificate for Jingsh Korea (Registration No.: 110111-8920088). On May 24, 2024, the Korean National Tax Servi',
      content: `# Jingsh Korea Incorporated Officially Established in Seoul, Korea

On April 18, 2024, the Seoul Central District Court approved and issued the registration certificate for Jingsh Korea (Registration No.: 110111-8920088).

On May 24, 2024, the Korean National Tax Service completed the relevant registration procedures, marking the official establishment of Jingsh Korea in Seoul.

This milestone further expands Jingsh Law Firm's global network and strengthens its presence in the Asia-Pacific region.`,
    },
    cn: {
      title: '京师韩国正式成立 — 首尔注册获批',
      excerpt: '2024年4月18日，首尔中央地方法院批准并颁发了京师韩国（注册号：110111-8920088）的注册证书。2024年5月24日，韩国国税厅',
      content: `# 京师韩国正式成立 — 首尔注册获批

2024年4月18日，首尔中央地方法院批准并颁发了京师韩国（注册号：110111-8920088）的注册证书。

2024年5月24日，韩国国税厅完成相关登记程序，标志着京师韩国在首尔正式成立。

这一里程碑进一步拓展了京师律师事务所的全球网络，并加强了其在亚太地区的影响力。`,
    },
  },
  {
    slug: 'governor-of-irkutsk-oblast-igor-kobzev-received-jingsh-lawyers',
    publishedAt: '2024-05-29T12:00:00.000Z',
    en: {
      title: 'Governor of Irkutsk Oblast Igor Kobzev Received Jingsh Lawyers',
      excerpt: 'On the afternoon of May 29th, Igor Ivanovich Kobzev, the Governor of Irkutsk Oblast, Russia, warmly received a delegation led by Wen Guobiao, the Director of the China-Russia Legal and Commercial Serv',
      content: `# Governor of Irkutsk Oblast Igor Kobzev Received Jingsh Lawyers

On the afternoon of May 29th, Igor Ivanovich Kobzev, the Governor of Irkutsk Oblast, Russia, warmly received a delegation led by Wen Guobiao, the Director of the China-Russia Legal and Commercial Service Center of Jingsh Law Firm.

The meeting focused on strengthening legal and commercial cooperation between China and Russia, and exploring opportunities for further collaboration in cross-border legal services.`,
    },
    cn: {
      title: '伊尔库茨克州州长接见京师律师代表团',
      excerpt: '5月29日下午，俄罗斯伊尔库茨克州州长伊戈尔·伊万诺维奇·科布泽夫亲切接见了由温国彪主任率领的京师中俄法律与商业服务代表团',
      content: `# 伊尔库茨克州州长接见京师律师代表团

5月29日下午，俄罗斯伊尔库茨克州州长伊戈尔·伊万诺维奇·科布泽夫亲切接见了由温国彪主任率领的京师中俄法律与商业服务代表团。

会晤重点讨论了加强中俄法律与商业合作，并探讨在跨境法律服务领域进一步合作的机会。`,
    },
  },
]

async function ensureSchema() {
  const info = await db.execute('PRAGMA table_info(cms_posts)')
  const columns = new Set(info.rows.map((row) => row.name))
  if (!columns.has('meta_title')) {
    await db.execute('ALTER TABLE cms_posts ADD COLUMN meta_title text')
    console.log('added cms_posts.meta_title column')
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

async function upsertPost(categoryId, authorId, locale, slug, data, publishedAtIso) {
  const publishedAt = Math.floor(new Date(publishedAtIso).getTime() / 1000)
  const existing = await db.execute(
    `SELECT id FROM cms_posts WHERE slug = ? AND locale = ? LIMIT 1`,
    [slug, locale],
  )

  const now = new Date().toISOString()
  const params = [
    data.title,
    slug,
    locale,
    data.excerpt,
    data.content,
    'published',
    'post',
    categoryId,
    authorId,
    'Jingsh Law Firm',
    publishedAt,
    now,
    now,
  ]

  if (existing.rows.length) {
    await db.execute(
      `UPDATE cms_posts SET title=?, slug=?, locale=?, excerpt=?, content=?, status=?, type=?, category_id=?, author_id=?, tags=?, published_at=?, updated_at=? WHERE id=?`,
      [data.title, slug, locale, data.excerpt, data.content, 'published', 'post', categoryId, authorId, 'Jingsh Law Firm', publishedAt, now, existing.rows[0].id],
    )
    return Number(existing.rows[0].id)
  }

  const result = await db.execute(
    `INSERT INTO cms_posts (title, slug, locale, excerpt, content, status, type, category_id, author_id, tags, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    params,
  )
  return Number(result.lastInsertRowid)
}

await ensureSchema()
const categoryId = await ensureCategory()
const authorId = await getAuthorId()

for (const item of posts) {
  await upsertPost(categoryId, authorId, 'en', item.slug, item.en, item.publishedAt)
  await upsertPost(categoryId, authorId, 'cn', item.slug, item.cn, item.publishedAt)
  console.log(`seeded ${item.slug} (en + cn)`)
}

console.log('done')
await db.close()
