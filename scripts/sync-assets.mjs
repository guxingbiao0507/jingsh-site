/**
 * Fetch theme images + mirror to local uploads + upload to R2.
 * Usage: npm run sync:assets
 */
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function run(script) {
  const res = spawnSync('node', [join(root, 'scripts', script)], { cwd: root, stdio: 'inherit', shell: false })
  if (res.status !== 0) process.exit(res.status || 1)
}

console.log('═══ 1/2 Fetch from jingsh.fi ═══')
run('fetch-jingsh-assets.mjs')
console.log('\n═══ 2/2 Upload to Cloudflare R2 ═══')
run('upload-r2-assets.mjs')
console.log('\n✅ Asset sync complete')
