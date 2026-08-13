// Upload scraped content images to R2 with the CORRECT single-prefix key.
// Files live at .data/uploads/uploads/uploads/<202212|202507|template>/...
// Content markdown references /api/media/uploads/<...> → key "uploads/<...>"
// So root must be .data/uploads/uploads/uploads and key = "uploads/" + rel.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const CF_TOKEN = readFileSync(join(process.cwd(), '.cloudflare.env'), 'utf8').match(/CLOUDFLARE_API_TOKEN=(\S+)/)[1]
const ACCOUNT = readFileSync(join(process.cwd(), '.cloudflare.env'), 'utf8').match(/CLOUDFLARE_ACCOUNT_ID=(\S+)/)[1]
const BUCKET = 'tbseo'
const ROOT = join(process.cwd(), '.data', 'uploads', 'uploads', 'uploads')
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
  const files = []
  for (const f of walk(ROOT)) {
    const rel = relative(ROOT, f).replace(/\\/g, '/')
    files.push({ key: `uploads/${rel}`, path: f })
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
