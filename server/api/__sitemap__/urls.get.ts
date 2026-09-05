import { and, eq } from 'drizzle-orm'
import { useDb, schema } from '../../database'

const locales = ['en', 'cn'] as const
const hreflang: Record<string, string> = { en: 'en', cn: 'zh-CN' }
const staticPages = ['', 'news'] as const

function lastmod(value: unknown) {
  if (!value) return undefined
  try {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? undefined : value.toISOString()
    }
    if (typeof value === 'number') {
      const d = new Date(value * 1000)
      return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
    }
    if (typeof value === 'string') {
      const d = new Date(value)
      return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
    }
  }
  catch {
    return undefined
  }
  return undefined
}

/** Jingsh sitemap: home, news list, and published blog posts (en + cn). */
export default defineEventHandler(async (event) => {
  let postRows: { slug: string; locale: string; updatedAt: unknown }[] = []

  try {
    const db = useDb(event)
    postRows = await db
      .select({
        slug: schema.posts.slug,
        locale: schema.posts.locale,
        updatedAt: schema.posts.updatedAt,
      })
      .from(schema.posts)
      .where(and(eq(schema.posts.status, 'published'), eq(schema.posts.type, 'post')))
      .all()
  }
  catch {
    // DB unavailable during prerender — static URLs only
  }

  const urls: {
    loc: string
    lastmod?: string
    priority?: number
    changefreq?: string
    alternates?: { hreflang: string; href: string }[]
  }[] = []

  for (const page of staticPages) {
    for (const loc of locales) {
      const path = page ? `/${page}` : '/'
      urls.push({
        loc: `/${loc}${path}`,
        priority: page === '' ? 1 : 0.8,
        changefreq: page === '' ? 'weekly' : 'daily',
        alternates: [
          ...locales.map(l => ({ hreflang: hreflang[l], href: `/${l}${path}` })),
          { hreflang: 'x-default', href: `/en${path}` },
        ],
      })
    }
  }

  const bySlug = new Map<string, { locale: string; updatedAt: unknown }[]>()
  for (const row of postRows) {
    if (!locales.includes(row.locale as typeof locales[number])) continue
    const list = bySlug.get(row.slug) ?? []
    list.push({ locale: row.locale, updatedAt: row.updatedAt })
    bySlug.set(row.slug, list)
  }

  for (const [slug, versions] of bySlug) {
    const alternates = [
      ...versions.map(v => ({
        hreflang: hreflang[v.locale] || v.locale,
        href: `/${v.locale}/blog/${slug}`,
      })),
      ...(versions.some(v => v.locale === 'en')
        ? [{ hreflang: 'x-default', href: `/en/blog/${slug}` }]
        : []),
    ]

    for (const v of versions) {
      urls.push({
        loc: `/${v.locale}/blog/${slug}`,
        lastmod: lastmod(v.updatedAt),
        priority: 0.6,
        changefreq: 'monthly',
        alternates,
      })
    }
  }

  return urls
})
