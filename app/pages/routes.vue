<script setup lang="ts">
const { t, locale } = useI18n()
const { data: site } = await useSite()

useSeoMeta({
  title: () => t('routes.title'),
  description: () => site.value?.settings.siteDescription,
})

const routeKeys = [
  { name: 'chinaToThailand', descFrom: ['yunnanToChiangMai', 'guangdongToBangkok'] },
  { name: 'chinaToMyanmar', descFrom: ['yunnanToYangon', 'mandalayRoute'] },
  { name: 'thailandToMyanmar', descFrom: ['bangkokToYangon', 'bangkokToMawlamyine'] },
]

const routes = computed(() => routeKeys.map(r => ({
  name: t(`routes.${r.name}.name`),
  desc: t(`routes.${r.name}.desc`),
  time: t(`routes.${r.name}.time`),
})))
</script>

<template>
  <div>
    <section class="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-primary/5 to-transparent">
      <UContainer class="py-16 text-center">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">{{ t('routes.title') }}</h1>
        <p class="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{{ t('routes.subtitle') }}</p>
      </UContainer>
    </section>

    <UContainer class="py-16">
      <div class="max-w-3xl mx-auto mb-12 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ t('routes.heading') }}</h2>
        <p class="text-gray-600 dark:text-gray-300">{{ t('routes.description') }}</p>
      </div>

      <div class="max-w-4xl mx-auto space-y-6">
        <UCard v-for="route in routes" :key="route.name">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold">{{ route.name }}</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ route.desc }}</p>
            </div>
            <UBadge color="primary" variant="subtle" size="lg">
              {{ route.time }}
            </UBadge>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
