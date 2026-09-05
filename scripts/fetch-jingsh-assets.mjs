import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const base = 'https://www.jingsh.fi/assets/themes/jingsh/images'
const files = ['logo.png', 'legal.png', 'accounting.png', 'others.png', 'jingshi-top-bg.png', 'ico_60.png', 'sou.png']
const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'themes', 'jingsh', 'images')

await mkdir(root, { recursive: true })

for (const file of files) {
  const res = await fetch(`${base}/${file}`)
  if (!res.ok) {
    console.warn(`skip ${file}: ${res.status}`)
    continue
  }
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(join(root, file), buf)
  console.log(`saved ${file} (${buf.length} bytes)`)
}

console.log('done')
