/**
 * Scrape jingsh.fi News & Blogs from Wayback Machine (live URLs often 404).
 * Downloads images to .data/uploads/ and writes .data/scraped/jingsh-news.json
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(root, '.data', 'scraped')
const UPLOAD_ROOT = join(root, '.data', 'uploads')
const OUT_FILE = join(OUT_DIR, 'jingsh-news.json')

const WAYBACK_TS = process.env.JINGSH_WAYBACK_TS || '20250712023600'
const ORIGIN = 'https://www.jingsh.fi'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

const SLUG_BY_ID = {
  1: 'jingsh-uzbekistan-tashkent-cooperative-office-was-officially-established',
  2: 'governor-of-irkutsk-oblast-igor-kobzev-received-jingsh-lawyers',
  3: 'jingsh-korea-incorporated-officially-established-in-seoul-korea',
  4: 'jingsh-lawyer-received-invitation-for-the-fifth-bifp-in-russia',
}

function waybackUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `https://web.archive.org/web/${WAYBACK_TS}/${ORIGIN}${p}`
}

function unwrapWayback(url) {
  const m = url.match(/\/web\/\d+(?:im_|js_|cs_)?\/(?:https?:\/\/)?([^/]+)(\/.*)/i)
  if (m) return `https://${m[1]}${m[2]}`
  if (url.startsWith('//')) return `https:${url}`
  if (url.startsWith('/')) return `${ORIGIN}${url}`
  return url
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&mdash;/g, '—')
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

async function fetchHtml(path) {
  const url = waybackUrl(path)
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.text()
}

async function downloadImage(rawUrl) {
  const original = unwrapWayback(rawUrl)
  if (!/^https?:\/\//i.test(original)) return null
  if (/logo\.png|favicon|wayback|archiveteam|archive\.org/i.test(original)) return null

  const u = new URL(original)
  let localKey
  const cdnMatch = u.pathname.match(/\/(\d{4})\/(\d{2})\/([^/?#]+)$/i)
  if (cdnMatch) {
    localKey = `news/${cdnMatch[1]}/${cdnMatch[2]}/${cdnMatch[3]}`
  }
  else {
    const hash = createHash('md5').update(original).digest('hex').slice(0, 10)
    const ext = extname(u.pathname) || '.jpg'
    localKey = `news/misc/${hash}${ext}`
  }

  const localPath = join(UPLOAD_ROOT, localKey)
  if (existsSync(localPath)) {
    return { original, localKey, mediaUrl: `/api/media/${localKey}` }
  }

  const fetchUrl = rawUrl.includes('web.archive.org') ? rawUrl : waybackUrl(u.pathname)
  let buf
  try {
    const res = await fetch(fetchUrl, { headers: { 'User-Agent': UA }, redirect: 'follow' })
    if (!res.ok) {
      const direct = await fetch(original, { headers: { 'User-Agent': UA }, redirect: 'follow' })
      if (!direct.ok) return null
      buf = Buffer.from(await direct.arrayBuffer())
    }
    else {
      buf = Buffer.from(await res.arrayBuffer())
    }
  }
  catch {
    return null
  }

  mkdirSync(dirname(localPath), { recursive: true })
  writeFileSync(localPath, buf)
  return { original, localKey, mediaUrl: `/api/media/${localKey}`, size: buf.length }
}

function extractListIds(html) {
  const ids = new Set()
  for (const m of html.matchAll(/news-blogs\/(\d+)\.html/gi)) ids.add(Number(m[1]))
  return [...ids].sort((a, b) => b - a)
}

function parsePublishedAt(dateRaw) {
  if (!dateRaw) return new Date().toISOString()
  const normalized = dateRaw.trim().replace('Time：', '').replace('Time:', '')
  const isoLike = normalized.replace(' ', 'T')
  const d = new Date(isoLike)
  if (!Number.isFinite(d.getTime())) {
    const m = normalized.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/)
    if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:00Z`).toISOString()
    return new Date().toISOString()
  }
  return d.toISOString()
}

function parseArticle(html, id) {
  const title = decodeEntities(html.match(/<h2>([^<]+)<\/h2>/i)?.[1]?.trim() || '')
  const dateRaw = html.match(/Time[：:]\s*([^<]+)/i)?.[1]?.trim() || ''
  const description = decodeEntities(html.match(/<meta name="description" content="([^"]*)"/i)?.[1]?.trim() || '')
  const contentHtml = html.match(/class="newsview">([\s\S]*?)<\/div>\s*<div class="viewpage">/i)?.[1]?.trim() || ''
  return {
    id,
    title,
    dateRaw,
    description,
    contentHtml,
    slug: SLUG_BY_ID[id] || slugify(title),
    publishedAt: parsePublishedAt(dateRaw),
  }
}

async function buildMarkdown(contentHtml, imgMap) {
  let md = contentHtml
    .replace(/<img[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi, (_, src) => {
      const original = unwrapWayback(src)
      const local = imgMap[original] || imgMap[src]
      return local ? `\n\n![](${local})\n\n` : ''
    })
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n')
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')

  md = decodeEntities(md)
  md = md.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
  return md
}

async function scrapeArticle(id) {
  const path = `/news-blogs/${id}.html`
  console.log(`  article ${id} …`)
  const html = await fetchHtml(path)
  const parsed = parseArticle(html, id)

  const imgUrls = new Set()
  for (const m of parsed.contentHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    imgUrls.add(m[1])
  }

  const imgMap = {}
  let downloaded = 0
  for (const src of imgUrls) {
    const r = await downloadImage(src)
    if (r) {
      imgMap[r.original] = r.mediaUrl
      imgMap[src] = r.mediaUrl
      if (r.size) downloaded++
    }
  }

  const markdown = await buildMarkdown(parsed.contentHtml, imgMap)
  const coverImageKey = Object.values(imgMap)[0]?.replace(/^\/api\/media\//, '') || null
  const excerpt = parsed.description || markdown.replace(/!\[[^\]]*\]\([^)]+\)/g, '').slice(0, 280).trim()

  return {
    id,
    slug: parsed.slug,
    locale: 'en',
    title: parsed.title,
    excerpt,
    content: `# ${parsed.title}\n\n${markdown}`,
    coverImage: coverImageKey,
    publishedAt: parsed.publishedAt,
    sourceUrl: `${ORIGIN}${path}`,
    imageCount: imgUrls.size,
    imagesDownloaded: downloaded,
    textLength: markdown.replace(/!\[[^\]]*\]\([^)]+\)/g, '').replace(/\s/g, '').length,
  }
}

/** Chinese locale — original jingsh.fi is EN-only; provide CN mirror content. */
const CN_POSTS = {
  'jingsh-uzbekistan-tashkent-cooperative-office-was-officially-established': {
    title: '京师乌兹别克斯坦塔什干合作办公室正式成立',
    excerpt: '京师律师事务所进入高质量发展新阶段以来，将国际化作为重要发展战略，积极拓展全球法律服务网络。',
  },
  'governor-of-irkutsk-oblast-igor-kobzev-received-jingsh-lawyers': {
    title: '伊尔库茨克州州长接见京师律师代表团',
    excerpt: '5月29日下午，俄罗斯伊尔库茨克州州长伊戈尔·伊万诺维奇·科布泽夫亲切接见了由温国彪主任率领的京师中俄法律与商业服务代表团。',
  },
  'jingsh-korea-incorporated-officially-established-in-seoul-korea': {
    title: '京师韩国正式成立 — 首尔注册获批',
    excerpt: '2024年4月18日，首尔中央地方法院批准并颁发了京师韩国（注册号：110111-8920088）的注册证书。',
  },
  'jingsh-lawyer-received-invitation-for-the-fifth-bifp-in-russia': {
    title: '京师律师受邀出席第五届俄罗斯贝加尔国际合作伙伴论坛',
    excerpt: '2024年5月27日至29日，第五届贝加尔国际合作伙伴论坛（BIFP）在俄罗斯伊尔库茨克举行。',
  },
}

function cnContentFromEn(enPost, cnMeta) {
  const body = enPost.content.replace(/^#[^\n]+\n+/, '')
  return `# ${cnMeta.title}\n\n${cnMeta.excerpt}\n\n${body}`
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  mkdirSync(UPLOAD_ROOT, { recursive: true })

  console.log(`▶ Fetching news list from Wayback (${WAYBACK_TS})`)
  const listHtml = await fetchHtml('/news-blogs.html')
  const ids = extractListIds(listHtml)
  console.log(`  Found ${ids.length} articles: ${ids.join(', ')}`)

  const enPosts = []
  for (const id of ids) {
    enPosts.push(await scrapeArticle(id))
  }

  const cnPosts = enPosts.map((en) => {
    const cnMeta = CN_POSTS[en.slug]
    if (!cnMeta) return null
    return {
      ...en,
      locale: 'cn',
      title: cnMeta.title,
      excerpt: cnMeta.excerpt,
      content: cnContentFromEn(en, cnMeta),
    }
  }).filter(Boolean)

  const payload = {
    scrapedAt: new Date().toISOString(),
    source: ORIGIN,
    waybackTimestamp: WAYBACK_TS,
    posts: [...enPosts, ...cnPosts],
  }

  writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2), 'utf8')

  const imgs = enPosts.reduce((s, p) => s + p.imagesDownloaded, 0)
  console.log(`\n✅ Saved ${payload.posts.length} posts (${enPosts.length} en + ${cnPosts.length} cn) → ${OUT_FILE}`)
  console.log(`   Images downloaded: ${imgs}`)
  for (const p of enPosts) {
    console.log(`   - [${p.id}] ${p.slug} (${p.textLength} chars, ${p.imageCount} imgs)`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
