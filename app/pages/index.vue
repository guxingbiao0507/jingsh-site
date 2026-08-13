<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t, locale } = useYfLang()
const { data: site } = await useSite()

const phone = computed(() => site.value?.settings.companyPhone || '153-6521-5320')

useSeoMeta({
  title: () => `${site.value?.settings.siteName} — ${site.value?.settings.siteDescription}`,
  description: () => site.value?.settings.siteDescription,
  ogImage: '/api/media/uploads/banner/b1.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterImage: '/api/media/uploads/banner/b1.jpg',
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
