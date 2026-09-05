<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const route = useRoute()
const { data: site } = await useSite()

onMounted(() => {
  const savedLocale = typeof localStorage !== 'undefined' ? localStorage.getItem('jingsh-locale') : null
  const currentPath = route.path
  const pathLocale = currentPath.match(/^\/([a-z]{2})\//)?.[1]

  if (pathLocale) {
    locale.value = pathLocale
    localStorage?.setItem('jingsh-locale', pathLocale)
  } else if (savedLocale) {
    setLocale(savedLocale)
  }
})

watch(() => route.path, (newPath) => {
  const pathLocale = newPath.match(/^\/([a-z]{2})\//)?.[1]
  if (pathLocale && pathLocale !== locale.value) {
    setLocale(pathLocale)
    localStorage?.setItem('jingsh-locale', pathLocale)
  }
})

const localeList = locales.value as any[]
const htmlLang = computed(() => {
  const l = localeList.find((item: any) => item.code === locale.value)
  return l?.language || locale.value
})

const SITE_TITLE = '京师北欧 / JINGSH Nordic'

const siteTitle = computed(() => site.value?.settings?.siteTitle || site.value?.settings?.siteName || SITE_TITLE)
const siteDesc = computed(() => site.value?.settings?.siteDescription || '')
const siteKeywords = computed(() => site.value?.settings?.siteKeywords || '')
const ogImage = computed(() => site.value?.settings?.ogImage || '/assets/themes/jingsh/images/jingshi-top-bg.png')
const googleVerification = computed(() => site.value?.settings?.googleVerification || '')
const config = useRuntimeConfig()
const siteUrl = computed(() => config.public.siteUrl || 'https://www.jingsh.fi')

const orgNames: Record<string, string> = {
  cn: '京师北欧 / JINGSH Nordic',
  en: '京师北欧 / JINGSH Nordic',
  th: '京师北欧 / JINGSH Nordic',
  my: '京师北欧 / JINGSH Nordic',
}
const orgDescs: Record<string, string> = {
  cn: '全球领先的综合性律师事务所，为客户提供全方位法律服务。',
  en: 'A leading global full-service law firm providing comprehensive legal solutions worldwide.',
  th: 'Leading global full-service law firm',
  my: 'Leading global full-service law firm',
}

const favicon = '/assets/themes/jingsh/images/logo.png'

useHead(() => ({
  htmlAttrs: { lang: htmlLang.value },
  title: siteTitle.value,
  // Override nuxtcms/@nuxtjs/seo default (`%s %separator %siteName` → … | NuxtCMS).
  titleTemplate: (titleChunk) => {
    const name = siteTitle.value
    return titleChunk ? `${titleChunk} · ${name}` : name
  },
  link: [
    { rel: 'icon', type: 'image/png', href: favicon, key: 'favicon' },
    { rel: 'shortcut icon', type: 'image/png', href: favicon, key: 'shortcut-icon' },
    { rel: 'apple-touch-icon', href: favicon, key: 'apple-touch-icon' },
  ],
  meta: [
    ...(siteDesc.value ? [{ name: 'description', content: siteDesc.value }] : []),
    ...(siteKeywords.value ? [{ name: 'keywords', content: siteKeywords.value }] : []),
    ...(ogImage.value ? [{ property: 'og:image', content: ogImage.value }] : []),
    { property: 'og:title', content: siteTitle.value },
    ...(siteDesc.value ? [{ property: 'og:description', content: siteDesc.value }] : []),
    { property: 'og:site_name', content: site.value?.settings?.siteName || SITE_TITLE },
    { property: 'og:url', content: siteUrl.value },
    ...(googleVerification.value ? [{ name: 'google-site-verification', content: googleVerification.value }] : []),
  ],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: orgNames[locale.value] || orgNames.en,
      alternateName: 'JINGSH Nordic',
      url: siteUrl.value,
      logo: `${siteUrl.value}/assets/themes/jingsh/images/logo.png`,
      description: siteDesc.value || orgDescs[locale.value] || orgDescs.en,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Fredrikinkatu 23 D 4',
        addressLocality: 'Helsinki',
        addressRegion: 'Uusimaa',
        postalCode: '00120',
        addressCountry: 'FI',
      },
      contactPoint: [
        { '@type': 'ContactPoint', telephone: '+358-demi.wei@jingsh.fi', contactType: 'Finland Office' },
        { '@type': 'ContactPoint', telephone: '+45-demi.wei@jingsh.fi', contactType: 'Denmark Office' },
      ],
      sameAs: [],
    }),
  }],
}))
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
