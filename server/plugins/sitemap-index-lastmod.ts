import { defineNitroPlugin } from 'nitropack/runtime'
import { getRequestURL } from 'h3'

type SitemapUrlEntry = { loc: string; lastmod?: string }

/** Set lastmod on each child sitemap in sitemap_index.xml (en.xml / cn.xml). */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:index-resolved', async ({ sitemaps, event }) => {
    let urls: SitemapUrlEntry[] = []
    try {
      const origin = getRequestURL(event).origin
      urls = await $fetch<SitemapUrlEntry[]>(`${origin}/api/__sitemap__/urls`)
    }
    catch {
      return
    }

    for (const entry of sitemaps) {
      const locale = entry.sitemap.split('/').pop()?.replace(/\.xml$/, '')
      if (locale !== 'en' && locale !== 'cn') continue

      let best: string | undefined
      let bestTime = -Infinity

      for (const url of urls) {
        if (!url.lastmod) continue
        const path = url.loc.replace(/\/$/, '') || '/'
        if (!path.startsWith(`/${locale}`)) continue
        const t = Date.parse(url.lastmod)
        if (Number.isNaN(t) || t <= bestTime) continue
        bestTime = t
        best = url.lastmod
      }

      if (best) {
        entry.lastmod = best.includes('.')
          ? best.replace(/\.\d{3}Z$/, 'Z')
          : best
      }
    }
  })
})
