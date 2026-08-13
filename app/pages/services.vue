<script setup lang="ts">
const { t } = useI18n()
const { data: site } = await useSite()

useSeoMeta({
  title: () => t('services.title'),
  description: () => site.value?.settings.siteDescription,
  ogImage: '/assets/hero.jpg',
  twitterCard: 'summary_large_image',
})

const services = [
  { icon: 'i-lucide-plane', key: 'services_freight', color: 'blue' },
  { icon: 'i-lucide-warehouse', key: 'services_warehouse', color: 'green' },
  { icon: 'i-lucide-file-check', key: 'services_customs', color: 'orange' },
  { icon: 'i-lucide-truck', key: 'services_delivery', color: 'red' },
  { icon: 'i-lucide-ship', key: 'services_cargo', color: 'purple' },
  { icon: 'i-lucide-users', key: 'services_consulting', color: 'cyan' },
]
</script>

<template>
  <div>
    <section class="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-primary/5 to-transparent">
      <UContainer class="py-16 text-center">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">{{ t('services.title') }}</h1>
        <p class="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{{ t('services.subtitle') }}</p>
      </UContainer>
    </section>

    <UContainer class="py-16">
      <div class="max-w-3xl mx-auto mb-12 text-center">
        <h2 class="text-3xl font-bold mb-4">{{ t('services.heading') }}</h2>
        <p class="text-gray-600 dark:text-gray-300">{{ t('services.description') }}</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <UCard v-for="svc in services" :key="svc.key">
          <div class="flex items-start gap-4">
            <div :class="`p-3 rounded-lg bg-${svc.color}-100 dark:bg-${svc.color}-900/30`">
              <UIcon :name="svc.icon" :class="`text-${svc.color}-600 dark:text-${svc.color}-400 text-2xl`" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <h3 class="font-semibold text-lg">{{ t(`services.${svc.key}.title`) }}</h3>
                <UBadge color="primary" variant="subtle" size="xs" class="shrink-0">{{ t(`services.${svc.key}.time`) }}</UBadge>
              </div>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ t(`services.${svc.key}.description`) }}</p>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
