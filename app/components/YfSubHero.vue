<script setup lang="ts">
import type { Bi } from '~/composables/yf-content'

defineProps<{
  kicker: Bi
  title: Bi
  crumbs: { label: Bi; onClick?: () => void }[]
}>()

const { t } = useYfLang()
const { go } = useYfNav()
</script>

<template>
  <div class="relative overflow-hidden pt-16 lg:pt-[72px]">
    <!-- backdrop -->
    <div class="absolute inset-0">
      <img src="/assets/about.jpg" alt="" class="h-full w-full object-cover opacity-25" />
      <div class="absolute inset-0" style="background: linear-gradient(to bottom, hsl(222 47% 4% / 0.7), hsl(222 47% 4%))" />
      <div class="absolute inset-0 grid-bg opacity-25" />
    </div>

    <div class="container-x relative py-14 lg:py-20">
      <!-- breadcrumb -->
      <nav class="flex flex-wrap items-center gap-2 font-mono-tech text-[10px] tracking-[0.25em] uppercase mb-6">
        <button class="text-slate-500 hover:text-[hsl(187_92%_55%)] transition-colors" @click="go({ page: 'home' })">
          {{ t({ zh: '首页', en: 'HOME' }) }}
        </button>
        <span v-for="(c, i) in crumbs" :key="i" class="flex items-center gap-2">
          <span class="text-slate-700">/</span>
          <button
            v-if="c.onClick"
            class="text-slate-500 hover:text-[hsl(187_92%_55%)] transition-colors"
            @click="c.onClick"
          >
            {{ t(c.label) }}
          </button>
          <span v-else style="color: hsl(187 92% 55%)">{{ t(c.label) }}</span>
        </span>
      </nav>

      <div class="kicker mb-4">{{ t(kicker) }}</div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-tight">
        {{ t(title) }}
      </h1>
      <slot name="extra" />
    </div>

    <div class="flow-line opacity-40" />
  </div>
</template>
