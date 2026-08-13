import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  extends: ['nuxtcms'],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://jingsh.com',
    name: 'jingsh',
  },

  i18n: {
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'th', language: 'th-TH', name: 'ไทย', file: 'th.json' },
      { code: 'my', language: 'my-MM', name: 'မြန်မာ', file: 'my.json' },
      { code: 'cn', language: 'zh-CN', name: '简体中文', file: 'cn.json' },
    ],
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      meta: [
        { name: 'description', content: 'Professional conveyor equipment manufacturer — roller conveyors, belt conveyors, chain conveyors, lifts. 20+ years of industry experience.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preload', href: '/fonts/fonts.css', as: 'style', onload: 'this.onload=null;this.rel="stylesheet"' },
        { rel: 'alternate', type: 'application/json', title: 'jingsh — JSON Feed', href: '/api/public/feed.json' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'jingsh — RSS Feed', href: '/api/public/feed.xml' },
      ],
    },
  },

  routeRules: {
    '/us': { redirect: { to: '/en', statusCode: 301 } },
    '/us/**': { redirect: { to: '/en/**', statusCode: 301 } },
  },

  nitro: {
    alias: process.env.NITRO_PRESET === 'cloudflare_pages'
      ? { 'better-sqlite3': resolve(__dirname, 'server/utils/better-sqlite3-stub') }
      : {},
  },
})
