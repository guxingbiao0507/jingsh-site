import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  extends: ['nuxtcms'],

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.jingsh.fi',
    name: 'Jingsh Law Firm',
  },

  sitemap: {
    sitemaps: {
      en: { sources: ['/api/__sitemap__/urls'], include: ['/en/**'] },
      cn: { sources: ['/api/__sitemap__/urls'], include: ['/cn/**'] },
    },
  },

  robots: {
    sitemap: ['/sitemap_index.xml'],
  },

  i18n: {
    langDir: 'locales',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'cn', language: 'zh-CN', name: '简体中文', file: 'cn.json' },
    ],
  },

  css: ['~/assets/css/jingsh.css'],

  app: {
    head: {
      meta: [
        { name: 'description', content: 'Jingsh Law Firm — professional legal services in corporate, IP, dispute resolution, capital markets and more. 9,000+ lawyers across 50+ countries.' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/assets/themes/jingsh/images/logo.png', key: 'favicon' },
        { rel: 'shortcut icon', type: 'image/png', href: '/assets/themes/jingsh/images/logo.png', key: 'shortcut-icon' },
        { rel: 'apple-touch-icon', href: '/assets/themes/jingsh/images/logo.png', key: 'apple-touch-icon' },
        { rel: 'alternate', type: 'application/json', title: 'jingsh — JSON Feed', href: '/api/public/feed.json' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'jingsh — RSS Feed', href: '/api/public/feed.xml' },
      ],
      script: [
        { src: 'https://www.googletagmanager.com/gtag/js?id=G-T7LDC2SCF5', async: true },
        {
          innerHTML: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-T7LDC2SCF5');`,
        },
      ],
    },
  },

  routeRules: {
    '/us': { redirect: { to: '/en', statusCode: 301 } },
    '/us/**': { redirect: { to: '/en/**', statusCode: 301 } },
    '/favicon.ico': { redirect: { to: '/assets/themes/jingsh/images/logo.png', statusCode: 301 } },
    '/favicon.svg': { redirect: { to: '/assets/themes/jingsh/images/logo.png', statusCode: 301 } },
    '/news-blogs.html': { redirect: { to: '/en/news', statusCode: 301 } },
    '/news-blogs/1.html': { redirect: { to: '/en/blog/jingsh-uzbekistan-tashkent-cooperative-office-was-officially-established', statusCode: 301 } },
    '/news-blogs/2.html': { redirect: { to: '/en/blog/governor-of-irkutsk-oblast-igor-kobzev-received-jingsh-lawyers', statusCode: 301 } },
    '/news-blogs/3.html': { redirect: { to: '/en/blog/jingsh-korea-incorporated-officially-established-in-seoul-korea', statusCode: 301 } },
    '/news-blogs/4.html': { redirect: { to: '/en/blog/jingsh-lawyer-received-invitation-for-the-fifth-bifp-in-russia', statusCode: 301 } },
    '/**': {
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://scripts.clarity.ms https://ssl.bing.com https://unpkg.com https://cdn.jsdelivr.net",
          "style-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net https://fonts.googleapis.com",
          "font-src 'self' data: https://cdn.jsdelivr.net https://fonts.gstatic.com",
          "img-src 'self' data: blob: https:",
          "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.clarity.ms https://c.clarity.ms https://c.bing.com https://cdn.jsdelivr.net",
          "worker-src 'self' blob:",
          "frame-ancestors 'none'",
        ].join('; '),
      },
    },
  },

  nitro: {
    alias: process.env.NITRO_PRESET === 'cloudflare_pages'
      ? { 'better-sqlite3': resolve(__dirname, 'server/utils/better-sqlite3-stub') }
      : {},
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.jingsh.fi',
    },
  },
})
