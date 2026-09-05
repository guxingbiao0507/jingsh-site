/**
 * Upload static assets to Cloudflare R2.
 * - public/assets/** → R2 key assets/...
 * - .data/uploads/** → R2 key (same path under uploads root)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicAssets = join(root, 'public', 'assets')
const uploadDir = join(root, '.data', 'uploads')

function loadEnv(path) {
  const env = {}
  if (!existsSync(path)) return env
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx > -1) env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
  }
  return env
}

const cf = loadEnv(join(root, '.cloudflare.env'))
const dotenv = loadEnv(join(root, '.env'))
const TOKEN = cf.CLOUDFLARE_API_TOKEN || dotenv.NUXT_CF_API_TOKEN
const ACCOUNT = cf.CLOUDFLARE_ACCOUNT_ID || dotenv.NUXT_CF_ACCOUNT_ID
const BUCKET = cf.CF_R2_BUCKET || dotenv.NUXT_CF_R2_BUCKET || 'jingshi'

if (!TOKEN || !ACCOUNT) {
  console.warn('⚠ Skipping R2 upload: missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID')
  process.exit(0)
}

const BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/r2/buckets/${BUCKET}/objects`

const MIME = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
  webp: 'image/webp', svg: 'image/svg+xml', ico: 'image/x-icon', css: 'text/css',
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) yield* walk(full)
    else yield full
  }
}

function collectFiles(baseDir, keyPrefix) {
  if (!existsSync(baseDir)) return []
  const out = []
  for (const filePath of walk(baseDir)) {
    const rel = relative(baseDir, filePath).replace(/\\/g, '/')
    out.push({ key: keyPrefix ? `${keyPrefix}/${rel}` : rel, path: filePath })
  }
  return out
}

async function put(key, path, retries = 3) {
  const buf = readFileSync(path)
  const ext = key.split('.').pop()?.toLowerCase() || ''
  const contentType = MIME[ext] || 'application/octet-stream'
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE}/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': contentType },
        body: buf,
      })
      if (res.ok) return true
      if (i === retries - 1) console.error(`  ✗ ${key}: HTTP ${res.status}`)
    }
    catch (e) {
      if (i === retries - 1) console.error(`  ✗ ${key}: ${e.message}`)
      await new Promise(r => setTimeout(r, 1000))
    }
  }
  return false
}

const byKey = new Map()
for (const f of collectFiles(publicAssets, 'assets')) byKey.set(f.key, f)
for (const f of collectFiles(uploadDir, '')) {
  if (!byKey.has(f.key)) byKey.set(f.key, f)
}
const files = [...byKey.values()]

if (files.length === 0) {
  console.error('✗ No assets found. Run: npm run fetch:assets')
  process.exit(1)
}

console.log(`▶ Uploading ${files.length} files to R2 bucket "${BUCKET}"`)

let ok = 0
let fail = 0
const BATCH = 8
for (let i = 0; i < files.length; i += BATCH) {
  const batch = files.slice(i, i + BATCH)
  const results = await Promise.all(batch.map(f => put(f.key, f.path)))
  for (const r of results) r ? ok++ : fail++
  process.stdout.write(`\r  ${Math.min(i + BATCH, files.length)}/${files.length}`)
}
console.log(`\n✅ R2 upload: ${ok} ok, ${fail} failed`)

if (fail > 0) process.exit(1)
