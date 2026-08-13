import { readFileSync } from 'node:fs'
const html = readFileSync('.data/sample-product.html', 'utf8')

function regionText(marker, len) {
  const i = html.indexOf(marker)
  if (i < 0) return '(not found)'
  const seg = html.slice(i, i + len)
  return seg
    .replace(/<img[^>]*>/gi, ' [图] ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

console.log('=== um-imgInfo 区(产品名/简介/参数) ===')
console.log(regionText('um-imgInfo left', 2500).slice(0, 700))

console.log('\n=== um-imgDetail 区 ===')
console.log(regionText('um-imgDetail', 3000).slice(0, 700))

console.log('\n=== content max-img 区 ===')
console.log(regionText('content max-img', 5000).slice(0, 900))
