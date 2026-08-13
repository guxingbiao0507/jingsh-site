<script setup lang="ts">
const { t } = useI18n()
const { data: site } = await useSite()

useSeoMeta({
  title: () => t('about.title'),
  description: () => t('about.subtitle'),
  ogImage: '/assets/hero.jpg',
  twitterCard: 'summary_large_image',
})

const stats = [
  { key: 'years', label: t('about.stats.years'), value: '20+' },
  { key: 'cases', label: t('about.stats.cases'), value: '3000+' },
  { key: 'cities', label: t('about.stats.cities'), value: '118' },
  { key: 'clients', label: t('about.stats.clients'), value: '500+' },
]

const { locale } = useI18n()
function li(zh: string, en: string) { return locale.value === 'en' ? en : zh }
</script>

<template>
  <div>
    <section class="border-b hairline flex flex-col items-center justify-center" style="min-height:260px; border-color: hsl(213 30% 18%); background: hsl(220 40% 7%)">
      <div class="container-x py-16 text-center">
        <div class="kicker mb-4">{{ li('关于jingsh', 'ABOUT JINGSH') }}</div>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white">{{ t('about.title') }}</h1>
        <p class="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">{{ t('about.subtitle') }}</p>
      </div>
    </section>

    <div class="container-x py-16">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold mb-6 text-white">{{ t('about.heading') }}</h2>
        <div class="space-y-5 text-slate-300 leading-relaxed mb-12">
          <p>{{ t('about.full.p1') }}</p>
          <p>{{ t('about.full.p2') }}</p>
          <p>{{ t('about.full.p3') }}</p>
          <p class="font-medium text-white">{{ t('about.full.p4') }}</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 mb-16">
          <div class="corner-frame panel p-6">
            <h3 class="text-xl font-semibold text-white mb-3">{{ t('about.mission') }}</h3>
            <p class="text-slate-300">{{ t('about.missionText') }}</p>
          </div>
          <div class="corner-frame panel p-6">
            <h3 class="text-xl font-semibold text-white mb-3">{{ t('about.vision') }}</h3>
            <p class="text-slate-300">{{ t('about.visionText') }}</p>
          </div>
        </div>

        <div class="mb-16">
          <h3 class="text-2xl font-bold mb-8 text-center text-white">{{ t('about.advantages.title') }}</h3>
          <div class="grid md:grid-cols-3 gap-6">
            <div v-for="adv in ['production', 'rd', 'support']" :key="adv" class="panel p-6">
              <h4 class="font-semibold text-lg mb-1 text-white">{{ t('about.advantages.' + adv + '.title') }}</h4>
              <p class="text-sm text-slate-400">{{ t('about.advantages.' + adv + '.desc') }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.key" class="text-center p-6 panel">
            <div class="text-3xl font-bold" style="color: hsl(187 92% 55%)">{{ stat.value }}</div>
            <div class="mt-2 text-sm text-slate-400">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
