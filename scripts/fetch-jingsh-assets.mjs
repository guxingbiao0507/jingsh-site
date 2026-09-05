/**
 * Download jingsh.fi theme assets to public/ and mirror to .data/uploads/ for /api/media.
 * Tries multiple sources: ASSET_SOURCE_URL env, jingsh.fi, Cloudflare Pages preview.
 */
import { mkdir, writeFile, readdir, stat } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicRoot = join(root, 'public', 'assets', 'themes', 'jingsh', 'images')
const uploadRoot = join(root, '.data', 'uploads', 'assets', 'themes', 'jingsh', 'images')

const knownFiles = [
  'logo.png',
  'legal.png',
  'accounting.png',
  'others.png',
  'jingshi-top-bg.png',
  'ico_60.png',
  'sou.png',
]

const defaultSources = [
  process.env.ASSET_SOURCE_URL,
  'https://www.jingsh.fi',
  'https://4a645690.jingshi-9zk.pages.dev',
].filter(Boolean)

function loadEnv(path) {
  if (!existsSync(path)) return {}
  const env = {}
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx > -1) env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
  }
  return env
}

const dotenv = loadEnv(join(root, '.env'))
if (dotenv.NUXT_PUBLIC_SITE_URL && !process.env.ASSET_SOURCE_URL) {
  defaultSources.unshift(dotenv.NUXT_PUBLIC_SITE_URL.replace(/\/$/, ''))
}

function collectFromHtml() {
  const htmlPath = join(root, '.tmp-jingsh.html')
  if (!existsSync(htmlPath)) return []
  const html = readFileSync(htmlPath, 'utf8')
  const found = new Set()
  for (const m of html.matchAll(/\/assets\/themes\/jingsh\/images\/([a-zA-Z0-9._-]+)/g)) {
    found.add(m[1])
  }
  return [...found]
}

async function downloadFrom(name, base) {
  const url = `${base.replace(/\/$/, '')}/assets/themes/jingsh/images/${name}`
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) return null
  return Buffer.from(await res.arrayBuffer())
}

async function downloadFile(name, sources) {
  const publicPath = join(publicRoot, name)
  if (existsSync(publicPath)) {
    const { size } = await stat(publicPath)
    if (size > 0) {
      await mkdir(uploadRoot, { recursive: true })
      const buf = readFileSync(publicPath)
      await writeFile(join(uploadRoot, name), buf)
      console.log(`  ✓ ${name} (cached, ${buf.length} bytes)`)
      return true
    }
  }

  for (const base of sources) {
    try {
      const buf = await downloadFrom(name, base)
      if (!buf?.length) continue
      await mkdir(publicRoot, { recursive: true })
      await mkdir(uploadRoot, { recursive: true })
      await writeFile(publicPath, buf)
      await writeFile(join(uploadRoot, name), buf)
      console.log(`  ✓ ${name} (${buf.length} bytes, from ${base})`)
      return true
    }
    catch {
      /* try next source */
    }
  }
  console.warn(`  ✗ ${name}: all sources failed`)
  return false
}

async function verifyLocal() {
  const files = await readdir(publicRoot).catch(() => [])
  console.log(`\nLocal public assets: ${files.length} files`)
  for (const f of files.sort()) {
    const { size } = await stat(join(publicRoot, f))
    console.log(`  - ${f} (${size} bytes)`)
  }
}

const files = [...new Set([...knownFiles, ...collectFromHtml()])]
console.log(`Fetching ${files.length} theme images…`)
console.log(`Sources: ${defaultSources.join(', ')}`)

let ok = 0
for (const file of files) {
  if (await downloadFile(file, defaultSources)) ok++
}

await verifyLocal()
console.log(`\nDone: ${ok}/${files.length} in public/ and .data/uploads/`)

if (ok === 0) process.exit(1)
