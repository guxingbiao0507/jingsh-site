<script setup lang="ts">
import { ui, categories } from '~/composables/yf-content'

const { t, lang } = useYfLang()
const { go } = useYfNav()
</script>

<template>
  <section id="about" class="relative py-20 lg:py-28 overflow-hidden" style="background: hsl(220 40% 7%)">
    <div class="container-x">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <!-- image side -->
        <YfReveal>
          <div class="relative corner-frame">
            <div class="relative overflow-hidden">
              <img src="/assets/about.jpg" alt="tbseo smart office" class="w-full aspect-[16/10] object-cover" />
              <div class="absolute inset-0" style="background: linear-gradient(135deg, hsl(217 100% 62% / 0.15), transparent 50%)" />
            </div>
            <!-- floating badge -->
            <div class="absolute -bottom-6 left-5 sm:left-8 panel px-6 py-5 backdrop-blur-md" style="background: hsl(222 47% 4% / 0.85)">
              <div class="font-mono-tech text-3xl font-bold text-white">
                70<span style="color: hsl(187 92% 55%)">+</span>
              </div>
              <div class="mt-1 text-[11px] tracking-wider text-slate-400">
                {{ t({ zh: '年日企技术传承', en: 'Years of Japanese Tech Heritage' }) }}
              </div>
            </div>
            <div class="flow-line absolute top-6 -right-2 w-24 rotate-90 origin-top-right opacity-70 hidden lg:block" />
          </div>
        </YfReveal>

        <!-- text side -->
        <div class="pt-6 lg:pt-0">
          <YfReveal>
            <div class="kicker mb-4">{{ t(ui.about.kicker) }}</div>
            <h2 class="text-3xl sm:text-4xl lg:text-[44px] leading-tight font-black tracking-tight text-white mb-7">
              {{ t(ui.about.title) }}
            </h2>
          </YfReveal>
          <YfReveal :delay="100">
            <p class="text-sm leading-[1.9] text-slate-400 mb-5">{{ t(ui.about.p1) }}</p>
            <p class="text-sm leading-[1.9] text-slate-400 mb-8">{{ t(ui.about.p2) }}</p>
          </YfReveal>
          <YfReveal :delay="180">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-px" style="background: hsl(213 30% 18%)">
              <div v-for="(p, i) in ui.about.points" :key="i" class="flex items-center gap-3 p-4" style="background: hsl(220 40% 7%)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 55%)" stroke-width="2.2">
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="text-[13px] text-slate-300">{{ t(p) }}</span>
              </div>
            </div>
          </YfReveal>
          <YfReveal :delay="240">
            <button class="btn-ghost mt-9" @click="go({ page: 'about' })">
              {{ lang === 'zh' ? '了解更多' : 'Learn More' }}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </YfReveal>
        </div>
      </div>
    </div>
  </section>
</template>
