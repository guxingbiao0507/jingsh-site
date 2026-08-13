import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
const BASE = 'http://www.wxyfwl.com'
const OUT_DIR = join(process.cwd(), '.data', 'scraped')
const IMG_DIR = join(process.cwd(), '.data', 'uploads', 'uploads')
mkdirSync(OUT_DIR, { recursive: true })

const PRODUCTS = [
  { cat: 'g', catSlug: 'gun-tong-shu-song-ji', urls: [26, 32, 33, 34, 35, 36, 37, 38, 39] },
  { cat: 'pidai', catSlug: 'pi-dai-shu-song-ji', urls: [40, 41, 42, 43, 44, 45] },
  { cat: 'lianban', catSlug: 'lian-ban-shu-song-ji', urls: [27, 28, 29] },
  { cat: 'tishengji', catSlug: 'ti-sheng-ji', urls: [30, 31, 46, 47] },
]
const CASES = [12, 13, 14, 15, 16, 17, 18, 19, 20]
const NEWS = [4, 5, 6, 7, 8, 9, 10, 11, 21]

// Fetch page as UTF-8 text (the site's bytes are UTF-8 despite gbk meta label)
async function fetchPage(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) return null
  const buf = await res.arrayBuffer()
  return Buffer.from(buf).toString('utf8')
}

function stripScriptsStyles(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
}

// Extract the main content area: <div class="content max-img">...</div>
function extractContentHtml(html) {
  const clean = stripScriptsStyles(html)
  const m = clean.match(/<div class="content max-img"[^>]*>([\s\S]*?)(?:<div class="pagenav|<div class="um-bd_ft|<div class="tag|<div class="um-bd_recommend)/i)
  if (m) return m[1]
  return null
}

function extractTitle(html) {
  // <h1> or page title
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1) {
    const t = h1[1].replace(/<[^>]+>/g, '').trim()
    if (t) return t
  }
  const m = html.match(/<title>([^<]+)<\/title>/i)
  if (m) return m[1].split(/[-_]/)[0].trim()
  return ''
}

// Extract ALL image src (src, data-src, _src, original)
function extractImages(html) {
  const imgs = new Set()
  const re = /(?:data-src|data-original|_src|src)=["']([^"']+\.(?:jpg|jpeg|png|gif|webp))["']/gi
  let m
  while ((m = re.exec(html)) !== null) {
    let src = m[1]
    if (src.startsWith('//')) src = 'http:' + src
    else if (src.startsWith('/')) src = BASE + src
    else if (!src.startsWith('http')) src = BASE + '/' + src
    if (/wxyfwl\.com|\/Uploads\/|\/Template\//.test(src)) imgs.add(src)
  }
  return [...imgs]
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
}

function htmlToMarkdown(html, imgMap) {
  let md = html
    .replace(/<img[^>]*?(?:data-src|data-original|_src|src)=["']([^"']+)["'][^>]*>/gi, (m, src) => {
      if (src.startsWith('//')) src = 'http:' + src
      else if (src.startsWith('/')) src = BASE + src
      else if (!src.startsWith('http')) src = BASE + '/' + src
      const local = imgMap[src]
      return local ? `\n\n![](${local})\n\n` : ''
    })
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n\n')
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    .replace(/<\/(ul|ol)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (m) => {
      const rows = m.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || []
      const lines = rows.map(r => {
        const cells = r.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) || []
        return '| ' + cells.map(c => c.replace(/<[^>]+>/g, '').trim()).join(' | ') + ' |'
      })
      return '\n\n' + lines.join('\n') + '\n\n'
    })
    .replace(/<[^>]+>/g, '')
  md = decodeEntities(md)
  md = md.replace(/[ \t]+/g, ' ').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
  return md
}

async function downloadImage(url) {
  try {
    const u = new URL(url)
    const path = u.pathname
    const uploadsMatch = path.match(/\/Uploads\/(\d{6})\/(.+)/)
    let localPath
    if (uploadsMatch) localPath = `uploads/${uploadsMatch[1]}/${uploadsMatch[2]}`
    else if (path.includes('/Template/')) localPath = `uploads/template/${path.split('/').pop()}`
    else localPath = `uploads/misc/${path.split('/').pop()}`

    const fullPath = join(IMG_DIR, localPath)
    if (existsSync(fullPath)) return { url, localPath, status: 'exists' }
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (!res.ok) return { url, localPath, status: `err:${res.status}` }
    const buf = Buffer.from(await res.arrayBuffer())
    mkdirSync(dirname(fullPath), { recursive: true })
    writeFileSync(fullPath, buf)
    return { url, localPath, status: 'ok', size: buf.length }
  } catch (e) {
    return { url, localPath: null, status: `err:${e.message}` }
  }
}

async function processPage(url, type, catSlug) {
  const html = await fetchPage(url)
  if (!html) { console.log(`  ✗ fetch failed: ${url}`); return null }
  const title = extractTitle(html)
  const contentHtml = extractContentHtml(html)
  const images = extractImages(contentHtml || html)

  const imgMap = {}
  let okCount = 0
  for (const imgUrl of images) {
    const r = await downloadImage(imgUrl)
    if (r.localPath) { imgMap[imgUrl] = `/api/media/${r.localPath}`; if (r.status === 'ok') okCount++ }
  }

  const markdown = contentHtml ? htmlToMarkdown(contentHtml, imgMap) : ''
  // First image as cover
  const firstImg = Object.values(imgMap)[0] || null

  return {
    url, title, type, categorySlug: catSlug,
    markdown,
    coverImage: firstImg,
    imageCount: images.length,
    imagesDownloaded: okCount,
    textLength: markdown.replace(/!\[.*?\]\(.*?\)/g, '').replace(/\s/g, '').length,
  }
}

async function main() {
  const all = []
  console.log('=== Products ===')
  for (const { cat, catSlug, urls } of PRODUCTS) {
    for (const id of urls) {
      const url = `${BASE}/${cat}/${id}.html`
      process.stdout.write(`  ${cat}/${id} ... `)
      const r = await processPage(url, 'product', catSlug)
      if (r) { all.push(r); console.log(`"${r.title}" imgs=${r.imageCount} text=${r.textLength}`) }
    }
  }
  console.log('=== Cases ===')
  for (const id of CASES) {
    const url = `${BASE}/tbseo/${id}.html`
    process.stdout.write(`  tbseo/${id} ... `)
    const r = await processPage(url, 'case', 'cases')
    if (r) { all.push(r); console.log(`"${r.title}" imgs=${r.imageCount} text=${r.textLength}`) }
  }
  console.log('=== News ===')
  for (const id of NEWS) {
    const url = `${BASE}/tbseozx/${id}.html`
    process.stdout.write(`  tbseozx/${id} ... `)
    const r = await processPage(url, 'news', 'news')
    if (r) { all.push(r); console.log(`"${r.title}" imgs=${r.imageCount} text=${r.textLength}`) }
  }

  writeFileSync(join(OUT_DIR, 'all-content.json'), JSON.stringify(all, null, 2), 'utf8')
  const totalImgs = all.reduce((s, r) => s + r.imagesDownloaded, 0)
  console.log(`\n✓ ${all.length} pages | products=${all.filter(r=>r.type==='product').length} cases=${all.filter(r=>r.type==='case').length} news=${all.filter(r=>r.type==='news').length} | new images=${totalImgs}`)
}

main().catch(e => { console.error(e); process.exit(1) })
