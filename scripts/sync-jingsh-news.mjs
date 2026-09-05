/**
 * Scrape jingsh.fi news → seed DB → upload images to R2.
 */
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function run(script) {
  const res = spawnSync('node', [join(root, 'scripts', script)], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env: process.env,
  })
  if (res.status !== 0) process.exit(res.status || 1)
}

console.log('═══ 1/3 Scrape news from jingsh.fi (Wayback) ═══')
run('scrape-jingsh-news.mjs')
console.log('\n═══ 2/3 Seed local database ═══')
run('seed-jingsh-news.mjs')
console.log('\n═══ 3/3 Upload images to R2 ═══')
run('upload-r2-assets.mjs')
console.log('\n✅ News sync complete')
