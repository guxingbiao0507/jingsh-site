import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const cfgPath = resolve(root, '.cloudflare.env')

function loadEnvFile(path) {
  const env = {}
  if (!existsSync(path)) return env
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim()
  }
  return env
}

const cf = loadEnvFile(cfgPath)
const dotenv = loadEnvFile(resolve(root, '.env'))

const childEnv = {
  ...process.env,
  CLOUDFLARE_API_TOKEN: cf.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN,
  CLOUDFLARE_ACCOUNT_ID: cf.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID,
}

const project = cf.CF_PAGES_PROJECT || 'jingshi'
const database = cf.CF_D1_DATABASE || 'jingshi'
const bucket = cf.CF_R2_BUCKET || dotenv.NUXT_CF_R2_BUCKET || 'jingshi'

function run(cmd, { allowFail = false } = {}) {
  const res = spawnSync(cmd, { cwd: root, shell: true, encoding: 'utf8', env: childEnv })
  if (res.status !== 0 && !allowFail) {
    console.error(res.stderr || res.stdout)
    process.exit(res.status || 1)
  }
  return res.stdout || ''
}

console.log('▶ Resolving D1 database id for', database)
const listOut = run('pnpm exec wrangler d1 list --json')
const databases = JSON.parse(listOut)
const match = databases.find(d => d.name === database)

if (!match?.uuid) {
  console.log(`▶ Creating D1 database "${database}"`)
  run(`pnpm exec wrangler d1 create ${database}`)
  const listOut2 = run('pnpm exec wrangler d1 list --json')
  const created = JSON.parse(listOut2).find(d => d.name === database)
  if (!created?.uuid) {
    console.error(`✗ Could not find database "${database}" after create`)
    process.exit(1)
  }
  updateWrangler(created.uuid)
}
else {
  console.log(`  Found D1 "${database}" → ${match.uuid}`)
  updateWrangler(match.uuid)
}

function updateWrangler(databaseId) {
  const wranglerPath = resolve(root, 'wrangler.toml')
  let content = readFileSync(wranglerPath, 'utf8')
  content = content.replace(/^name = ".*"/m, `name = "${project}"`)
  content = content.replace(/database_name = ".*"/, `database_name = "${database}"`)
  content = content.replace(/database_id = ".*"/, `database_id = "${databaseId}"`)
  content = content.replace(/bucket_name = ".*"/, `bucket_name = "${bucket}"`)
  if (!content.includes('migrations_dir = "node_modules/nuxtcms/server/database/migrations"')) {
    content = content.replace(
      /migrations_dir = ".*"/,
      'migrations_dir = "node_modules/nuxtcms/server/database/migrations"',
    )
  }
  writeFileSync(wranglerPath, content)
  console.log('  Updated wrangler.toml')
}

console.log('▶ Ensuring R2 bucket exists:', bucket)
const bucketListRes = spawnSync('pnpm exec wrangler r2 bucket list', {
  cwd: root,
  shell: true,
  encoding: 'utf8',
  env: childEnv,
  stdio: ['pipe', 'pipe', 'pipe'],
})
const bucketExists = bucketListRes.status === 0 && bucketListRes.stdout.includes(bucket)
if (!bucketExists) {
  run(`pnpm exec wrangler r2 bucket create ${bucket}`, { allowFail: true })
}
else {
  console.log(`  R2 bucket "${bucket}" already exists`)
}

console.log('▶ Ensuring Pages project exists:', project)
run(`pnpm exec wrangler pages project create ${project} --production-branch main`, { allowFail: true })

console.log('▶ Setting Pages secrets from .env')
const secrets = {
  NUXT_SESSION_PASSWORD: dotenv.NUXT_SESSION_PASSWORD,
  NUXT_JWT_SECRET: dotenv.NUXT_JWT_SECRET,
  NUXT_ALTCHA_HMAC_KEY: dotenv.NUXT_ALTCHA_HMAC_KEY,
  NUXT_API_DOCS_KEY: dotenv.NUXT_API_DOCS_KEY,
  NUXT_PUBLIC_SITE_URL: (dotenv.NUXT_PUBLIC_SITE_URL || 'https://www.jingsh.fi').replace(/\/$/, ''),
}

console.log(`  Pages URL: https://${project}.pages.dev`)
console.log(`  Site URL:  ${secrets.NUXT_PUBLIC_SITE_URL}`)

for (const [key, value] of Object.entries(secrets)) {
  if (!value) continue
  console.log(`  ${key}`)
  spawnSync(`pnpm exec wrangler pages secret put ${key} --project-name ${project}`, {
    cwd: root,
    shell: true,
    stdio: ['pipe', 'inherit', 'inherit'],
    input: `${value}\n`,
    env: childEnv,
  })
}

console.log('✅ Cloudflare prep complete')
