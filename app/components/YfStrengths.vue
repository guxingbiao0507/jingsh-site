<script setup lang="ts">
import { ui } from '~/composables/yf-content'

const { t } = useYfLang()

const icons = [
  { viewBox: '0 0 24 24', paths: ['M3 21V9l6 4V9l6 4V4h6v17H3z', 'M7 17h2M12 17h2M17 17h2'] },
  { viewBox: '0 0 24 24', paths: ['M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.7-3.7z'] },
  { viewBox: '0 0 24 24', paths: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z', 'M9 12l2 2 4-4'] },
  { viewBox: '0 0 24 24', paths: ['M4 13a8 8 0 0 1 16 0', 'M3 13h4v6H3zM17 13h4v6h-4z', 'M20 19a3 3 0 0 1-3 3h-3'] },
]
</script>

<template>
  <section id="strengths" class="relative py-20 lg:py-28 overflow-hidden" style="background: hsl(220 40% 7%)">
    <div class="absolute inset-0 grid-bg opacity-20" />
    <div class="absolute -top-40 right-0 h-96 w-96 rounded-full opacity-20 blur-3xl" style="background: hsl(217 100% 62% / 0.5)" />

    <div class="container-x relative">
      <YfReveal>
        <div class="text-center mb-14 lg:mb-16">
          <div class="kicker mb-4">{{ t(ui.why.kicker) }}</div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">{{ t(ui.why.title) }}</h2>
        </div>
      </YfReveal>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style="background: hsl(213 30% 18%)">
        <YfReveal v-for="(it, i) in ui.why.items" :key="i" :delay="i * 90" class="h-full">
          <div class="group relative h-full p-7 lg:p-8 transition-colors duration-300" style="background: hsl(220 40% 7%)">
            <div class="flex items-center justify-between mb-10">
              <div
                class="flex h-12 w-12 items-center justify-center border transition-all duration-300 group-hover:border-transparent"
                style="border-color: hsl(213 30% 18%); color: hsl(187 92% 55%)"
              >
                <svg :viewBox="icons[i].viewBox" fill="none" stroke="currentColor" stroke-width="1.5" class="h-6 w-6">
                  <path v-for="(d, j) in icons[i].paths" :key="j" :d="d" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <span class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-600">0{{ i + 1 }}</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-3">{{ t(it.title) }}</h3>
            <p class="text-[13px] leading-relaxed text-slate-400">{{ t(it.desc) }}</p>
            <div
              class="absolute top-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
              style="background: linear-gradient(90deg, hsl(187 92% 55%), hsl(217 100% 62%))"
            />
          </div>
        </YfReveal>
      </div>
    </div>
  </section>
</template>
