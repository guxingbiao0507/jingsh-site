<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const route = useRoute()
const { data: site } = await useSite()

onMounted(() => {
  const savedLocale = typeof localStorage !== 'undefined' ? localStorage.getItem('tb-locale') : null
  const currentPath = route.path
  const pathLocale = currentPath.match(/^\/([a-z]{2})\//)?.[1]

  if (pathLocale) {
    locale.value = pathLocale
    localStorage?.setItem('tb-locale', pathLocale)
  } else if (savedLocale) {
    setLocale(savedLocale)
  }
})

watch(() => route.path, (newPath) => {
  const pathLocale = newPath.match(/^\/([a-z]{2})\//)?.[1]
  if (pathLocale && pathLocale !== locale.value) {
    setLocale(pathLocale)
    localStorage?.setItem('tb-locale', pathLocale)
  }
})

const localeList = locales.value as any[]
const htmlLang = computed(() => {
  const l = localeList.find((item: any) => item.code === locale.value)
  return l?.language || locale.value
})

const siteTitle = computed(() => site.value?.settings?.siteTitle || site.value?.settings?.siteName || 'NuxtCMS')
const siteDesc = computed(() => site.value?.settings?.siteDescription || '')
const siteKeywords = computed(() => site.value?.settings?.siteKeywords || '')
const ogImage = computed(() => site.value?.settings?.ogImage || '')

const orgNames: Record<string, string> = {
  cn: '无锡jingsh网络科技有限公司',
  en: 'Wuxi Jingsh Network Technology Co., Ltd.',
  th: 'บริษัท อู๋ซี ทีบีเอสอีออ เน็ทเวิร์ก เทคโนโลยี จำกัด',
  my: 'Wuxi Jingsh Network Technology Co., Ltd.',
}
const orgDescs: Record<string, string> = {
  cn: '专业搜索引擎优化与数字营销服务商，致力于为企业提供一站式SEO解决方案，提升品牌在线可见度与转化率。',
  en: 'Professional SEO optimization and digital marketing agency, dedicated to providing one-stop SEO solutions to enhance brand visibility and conversion rates.',
  th: 'ผู้เชี่ยวชาญด้าน SEO และการตลาดดิจิทัล มุ่งมั่นให้บริการโซลูชัน SEO ครบวงจร เพื่อเพิ่มความน่าจดจำของแบรนด์',
  my: 'ပညာရှာ SEO အမြဲတမ်းနှင့် ဒီဂျစ်တယ် ဈာင်မှုဆိုင်ရာ အကူအညီပေးသူ',
}

useHead(() => ({
  htmlAttrs: { lang: htmlLang.value },
  title: siteTitle.value,
  meta: [
    ...(siteDesc.value ? [{ name: 'description', content: siteDesc.value }] : []),
    ...(siteKeywords.value ? [{ name: 'keywords', content: siteKeywords.value }] : []),
    ...(ogImage.value ? [{ property: 'og:image', content: ogImage.value }] : []),
    { property: 'og:title', content: siteTitle.value },
    ...(siteDesc.value ? [{ property: 'og:description', content: siteDesc.value }] : []),
  ],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: orgNames[locale.value] || orgNames.cn,
      alternateName: 'Wuxi Jingsh Network Technology Co., Ltd.',
      url: 'https://jingsh.com',
      logo: 'https://jingsh.com/favicon.ico',
      description: siteDesc.value || orgDescs[locale.value] || orgDescs.cn,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '硕放中通路8号',
        addressLocality: '无锡市',
        addressRegion: '江苏省',
        postalCode: '214142',
        addressCountry: 'CN',
      },
      contactPoint: [
        { '@type': 'ContactPoint', telephone: '+86-151-6157-3181', contactType: 'sales' },
        { '@type': 'ContactPoint', telephone: '+86-153-6521-5320', contactType: 'customer service' },
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
