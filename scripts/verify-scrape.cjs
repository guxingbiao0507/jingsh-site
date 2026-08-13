const data = JSON.parse(require('fs').readFileSync('.data/scraped/all-content.json', 'utf8'))

console.log('=== Coverage summary ===')
const byType = { product: [], case: [], news: [] }
data.forEach(r => byType[r.type].push(r))
for (const [t, arr] of Object.entries(byType)) {
  const withMd = arr.filter(r => r.markdown && r.markdown.length > 50).length
  const withCover = arr.filter(r => r.coverImage).length
  console.log(`${t}: ${arr.length} pages | markdown>50char: ${withMd} | with cover: ${withCover}`)
}

console.log('\n=== NEWS tbseozx/21 markdown (first 700) ===')
const n = data.find(r => r.url.includes('tbseozx/21'))
console.log(n.markdown.slice(0, 700))

console.log('\n=== PRODUCT g/34 markdown (first 300) ===')
const p = data.find(r => r.url.includes('/g/34'))
console.log(p.markdown.slice(0, 300))
console.log('... cover:', p.coverImage)

console.log('\n=== CASE tbseo/17 markdown (first 300) ===')
const c = data.find(r => r.url.includes('tbseo/17'))
console.log(c.markdown.slice(0, 300))
console.log('... cover:', c.coverImage)

const broken = data.filter(r => r.markdown.includes('tbseo.com'))
console.log('\nMarkdown still referencing external wxyfwl.com:', broken.length)
