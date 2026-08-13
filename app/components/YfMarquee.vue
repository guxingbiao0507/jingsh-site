<script setup lang="ts">
import { ui } from '~/composables/yf-content'

const { t } = useYfLang()
const items = [...ui.marquee, ...ui.marquee]
</script>

<template>
  <div
    class="relative border-y overflow-hidden py-4 marquee-mask"
    style="border-color: hsl(213 30% 18%); background: hsl(220 40% 7%)"
  >
    <div class="animate-marquee flex w-max items-center gap-10 whitespace-nowrap px-5">
      <span v-for="(m, i) in items" :key="i" class="flex items-center gap-10">
        <span class="font-mono-tech text-xs sm:text-sm tracking-[0.3em] text-slate-400 uppercase">{{ t(m) }}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" style="color: hsl(187 92% 55%)">
          <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" opacity="0.6" />
        </svg>
      </span>
    </div>
  </div>
</template>
