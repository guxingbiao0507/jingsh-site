<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useYfLang()
const { locale } = useI18n()

useSeoMeta({
  title: () => 'jingsh — ' + (locale.value === 'en' ? 'Professional SEO Solutions' : '专业SEO优化解决方案'),
  description: () => locale.value === 'en'
    ? 'Wuxi Jingsh Network Technology — 20+ years in SEO, 3000+ projects, data-driven optimization.'
    : '无锡jingsh网络科技有限公司 — 20年SEO经验，3000+成功案例，数据驱动的专业优化。',
  ogImage: '/api/media/uploads/banner/b1.jpg',
  ogType: 'website',
})

useHead({
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'jingsh',
      url: 'https://jingsh.com',
    })},
  ],
})
</script>

<template>
  <div>
    <YfHero />
    <YfMarquee />
    <YfProducts />
    <YfStrengths />
    <YfCases />
    <YfAbout />
    <YfNews />
    <YfContact />
  </div>
</template>
