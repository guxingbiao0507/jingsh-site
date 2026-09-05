import { and, desc, eq } from 'drizzle-orm'
import { useDb, schema } from '../../database'

const locales = ['en', 'cn'] as const
const hreflang: Record<string, string> = { en: 'en', cn: 'zh-CN' }
const staticPages = ['', 'news'] as const

/** Normalize Date / unix seconds / ISO string → ISO 8601 for sitemap lastmod. */
function toLastmod(value: unknown): string | undefined {
  if (value == null) return undefined
  try {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? undefined : value.toISOString()
    }
    if (typeof value === 'number') {
      const ms = value > 1e12 ? value : value * 1000
      const d = new Date(ms)
      return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
    }
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return undefined
      if (/^\d+$/.test(trimmed)) {
        const n = Number(trimmed)
        const ms = n > 1e12 ? n : n * 1000
        const d = new Date(ms)
        return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
      }
      const d = new Date(trimmed)
      return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
    }
  }
  catch {
    return undefined
  }
  return undefined
}

function maxLastmod(values: unknown[]): string | undefined {
  let best: string | undefined
  let bestTime = -Infinity
  for (const v of values) {
    const iso = toLastmod(v)
    if (!iso) continue
    const t = Date.parse(iso)
    if (t > bestTime) {
      bestTime = t
      best = iso
    }
  }
  return best
}

/** Jingsh sitemap: home, news list, and published blog posts (en + cn). */
export default defineEventHandler(async (event) => {
  let postRows: {
    slug: string
    locale: string
    updatedAt: unknown
    publishedAt: unknown
  }[] = []

  try {
    const db = useDb(event)
    postRows = await db
      .select({
        slug: schema.posts.slug,
        locale: schema.posts.locale,
        updatedAt: schema.posts.updatedAt,
        publishedAt: schema.posts.publishedAt,
      })
      .from(schema.posts)
      .where(and(eq(schema.posts.status, 'published'), eq(schema.posts.type, 'post')))
      .orderBy(desc(schema.posts.updatedAt))
      .all()
  }
  catch {
    // DB unavailable during prerender — static URLs only
  }

  const siteLastmod = maxLastmod(postRows.flatMap(r => [r.updatedAt, r.publishedAt]))

  const urls: {
    loc: string
    lastmod?: string
    priority?: number
    changefreq?: string
    alternates?: { hreflang: string; href: string }[]
  }[] = []

  for (const page of staticPages) {
    const pageLastmod = page === 'news'
      ? maxLastmod(postRows.map(r => r.publishedAt ?? r.updatedAt))
      : siteLastmod

    for (const loc of locales) {
      const path = page ? `/${page}` : '/'
      urls.push({
        loc: `/${loc}${path}`,
        lastmod: pageLastmod,
        priority: page === '' ? 1 : 0.8,
        changefreq: page === '' ? 'weekly' : 'daily',
        alternates: [
          ...locales.map(l => ({ hreflang: hreflang[l] ?? l, href: `/${l}${path}` })),
          { hreflang: 'x-default', href: `/en${path}` },
        ],
      })
    }
  }

  const bySlug = new Map<string, { locale: string; updatedAt: unknown; publishedAt: unknown }[]>()
  for (const row of postRows) {
    if (!locales.includes(row.locale as typeof locales[number])) continue
    const list = bySlug.get(row.slug) ?? []
    list.push({
      locale: row.locale,
      updatedAt: row.updatedAt,
      publishedAt: row.publishedAt,
    })
    bySlug.set(row.slug, list)
  }

  for (const [slug, versions] of bySlug) {
    const alternates = [
      ...versions.map(v => ({
        hreflang: hreflang[v.locale] ?? v.locale,
        href: `/${v.locale}/blog/${slug}`,
      })),
      ...(versions.some(v => v.locale === 'en')
        ? [{ hreflang: 'x-default', href: `/en/blog/${slug}` }]
        : []),
    ]

    for (const v of versions) {
      urls.push({
        loc: `/${v.locale}/blog/${slug}`,
        lastmod: toLastmod(v.updatedAt) ?? toLastmod(v.publishedAt),
        priority: 0.6,
        changefreq: 'monthly',
        alternates,
      })
    }
  }

  return urls
})
