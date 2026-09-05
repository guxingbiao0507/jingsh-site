// Upload CMS content images from .data/uploads to R2.
// Keys match /api/media/{key} — e.g. uploads/202212/foo.jpg
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

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
const CF_TOKEN = cf.CLOUDFLARE_API_TOKEN || dotenv.NUXT_CF_API_TOKEN
const ACCOUNT = cf.CLOUDFLARE_ACCOUNT_ID || dotenv.NUXT_CF_ACCOUNT_ID
const BUCKET = cf.CF_R2_BUCKET || dotenv.NUXT_CF_R2_BUCKET || 'jingshi'
const ROOT = join(root, '.data', 'uploads')
const BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/r2/buckets/${BUCKET}/objects`

const ct = (f) => ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' }[f.split('.').pop().toLowerCase()] || 'application/octet-stream')

function* walk(dir) {
  for (const n of readdirSync(dir)) {
    const full = join(dir, n)
    if (statSync(full).isDirectory()) yield* walk(full)
    else yield full
  }
}

async function put(key, path, retries = 3) {
  const buf = readFileSync(path)
  for (let i = 0; i < retries; i++) {
    try {
      const ctrl = new AbortController()
      const to = setTimeout(() => ctrl.abort(), 20000)
      const res = await fetch(`${BASE}/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${CF_TOKEN}`, 'Content-Type': ct(key) },
        body: buf, signal: ctrl.signal,
      })
      clearTimeout(to)
      if (res.ok) return true
      if (i === retries - 1) console.error(`  ✗ ${key}: ${res.status}`)
    } catch (e) {
      if (i === retries - 1) console.error(`  ✗ ${key}: ${e.message}`)
      await new Promise(r => setTimeout(r, 1500))
    }
  }
  return false
}

async function main() {
  if (!existsSync(ROOT)) {
    console.log('No .data/uploads directory — nothing to upload')
    return
  }
  const files = []
  for (const f of walk(ROOT)) {
    const rel = relative(ROOT, f).replace(/\\/g, '/')
    files.push({ key: rel, path: f })
  }
  console.log(`Uploading ${files.length} content images with single-prefix keys (uploads/<...>)`)
  console.log(`Sample key: ${files[0]?.key}`)

  const BATCH = 10
  let ok = 0, fail = 0
  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH)
    const rs = await Promise.all(batch.map(f => put(f.key, f.path)))
    for (const r of rs) r ? ok++ : fail++
    process.stdout.write(`\r  ${Math.min(i + BATCH, files.length)}/${files.length} (ok=${ok} fail=${fail})`)
  }
  console.log(`\nDone: ${ok} uploaded, ${fail} failed`)
}
main().catch(e => { console.error(e); process.exit(1) })
