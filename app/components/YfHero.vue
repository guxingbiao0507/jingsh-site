<script setup lang="ts">
import { ui, stats } from '~/composables/yf-content'

const { t } = useYfLang()

const go = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const gridLines = [22, 44, 66, 88]

const phone = computed(() => '153-6521-5320')

const localePath = useLocalePath()
</script>

<template>
  <section class="relative min-h-[100svh] flex flex-col overflow-hidden">
    <!-- background -->
    <div class="absolute inset-0">
      <img src="/assets/hero.jpg" alt="" class="h-full w-full object-cover" fetchpriority="high" />
      <div
        class="absolute inset-0"
        style="
          background: linear-gradient(100deg, hsl(222 47% 4% / 0.96) 0%, hsl(222 47% 4% / 0.75) 45%, hsl(222 47% 4% / 0.35) 100%);
        "
      />
      <div class="absolute inset-0" style="background: linear-gradient(to top, hsl(222 47% 4%) 2%, transparent 35%)" />
      <div class="absolute inset-0 grid-bg opacity-30" />
      <div class="scanline" />
    </div>

    <div class="container-x relative flex-1 flex items-center pt-28 pb-16 lg:pt-32">
      <div class="grid lg:grid-cols-[1.35fr_1fr] gap-12 lg:gap-8 w-full items-center">
        <!-- left copy -->
        <div>
          <div
            class="inline-flex items-center gap-2.5 border px-3.5 py-2 mb-7"
            style="border-color: hsl(187 92% 55% / 0.35); background: hsl(187 92% 55% / 0.07)"
          >
            <span class="pulse-dot h-1.5 w-1.5 rounded-full" style="background: hsl(187 92% 55%)" />
            <span class="kicker !tracking-[0.25em]">{{ t(ui.hero.kicker) }}</span>
          </div>

          <h1 class="text-[42px] leading-[1.08] sm:text-6xl lg:text-7xl font-black tracking-tight text-white">
            {{ t(ui.hero.titleA) }}
            <br />
            <span class="text-gradient">{{ t(ui.hero.titleB) }}</span>
          </h1>

          <p class="mt-7 max-w-xl text-[15px] leading-relaxed text-slate-300/90">{{ t(ui.hero.sub) }}</p>

          <div class="mt-9 flex flex-wrap items-center gap-4">
            <button class="btn-primary" @click="go('products')">
              {{ t(ui.hero.cta1) }}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button class="btn-ghost" @click="go('contact')">{{ t(ui.hero.cta2) }}</button>
          </div>

          <div class="mt-10 flex items-center gap-3 font-mono-tech">
            <span class="text-[10px] tracking-[0.3em] text-slate-500 uppercase">{{ t(ui.hero.hotline) }}</span>
            <a
              :href="'tel:' + phone.replace(/-/g, '')"
              class="text-lg sm:text-xl font-semibold tracking-wider transition-colors"
              style="color: hsl(187 92% 55%)"
            >{{ phone }}</a>
          </div>
        </div>

        <!-- right telemetry panel -->
        <div class="hidden lg:block animate-floaty">
          <div class="corner-frame panel p-6 backdrop-blur-md" style="background: hsl(220 40% 7% / 0.72)">
            <div class="flex items-center justify-between mb-5">
              <span class="font-mono-tech text-[10px] tracking-[0.28em] text-slate-400">{{ t(ui.hero.panelTitle) }}</span>
              <span class="flex items-center gap-1.5 font-mono-tech text-[10px]" style="color: hsl(187 92% 55%)">
                <span class="pulse-dot h-1.5 w-1.5 rounded-full" style="background: hsl(187 92% 55%)" />
                LIVE
              </span>
            </div>

            <!-- fake line chart -->
            <svg viewBox="0 0 320 110" class="w-full mb-5">
              <defs>
                <linearGradient id="hg-hero" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="hsl(187 92% 55%)" stop-opacity="0.35" />
                  <stop offset="100%" stop-color="hsl(187 92% 55%)" stop-opacity="0" />
                </linearGradient>
              </defs>
              <line v-for="y in gridLines" :key="y" x1="0" :y1="y" x2="320" :y2="y" stroke="hsl(213 30% 18%)" stroke-width="0.6" />
              <path d="M0,84 L40,72 L80,78 L120,58 L160,64 L200,44 L240,50 L280,30 L320,36 L320,110 L0,110 Z" fill="url(#hg-hero)" />
              <path d="M0,84 L40,72 L80,78 L120,58 L160,64 L200,44 L240,50 L280,30 L320,36" fill="none" stroke="hsl(187 92% 55%)" stroke-width="1.6" />
              <circle cx="280" cy="30" r="3" fill="hsl(187 92% 55%)" class="pulse-dot" />
            </svg>

            <div class="grid grid-cols-2 gap-px" style="background: hsl(213 30% 18%)">
              <div v-for="it in ui.hero.panelItems" :key="it.v + String(it.k.zh)" class="p-3.5" style="background: hsl(220 40% 7%)">
                <div class="font-mono-tech text-[9px] tracking-[0.2em] text-slate-500 uppercase mb-1">{{ t(it.k) }}</div>
                <div class="font-mono-tech text-sm font-semibold text-white">{{ it.v }}</div>
              </div>
            </div>

            <div class="flow-line mt-5 opacity-60" />
          </div>
        </div>
      </div>
    </div>

    <!-- bottom stats bar -->
    <div
      class="relative border-t"
      style="border-color: hsl(213 30% 18%); background: hsl(222 47% 4% / 0.7); backdrop-filter: blur(12px)"
    >
      <div class="container-x grid grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(s, i) in stats"
          :key="i"
          class="py-6 lg:py-7 px-2 sm:px-6"
          :class="i > 0 ? 'border-l' : ''"
          style="border-color: hsl(213 30% 18%)"
        >
          <div class="font-mono-tech text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            <YfCountUp :to="s.value" />
            <span style="color: hsl(187 92% 55%)">{{ s.suffix }}</span>
          </div>
          <div class="mt-1 text-[11px] sm:text-xs tracking-wider text-slate-400">{{ t(s.label) }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
