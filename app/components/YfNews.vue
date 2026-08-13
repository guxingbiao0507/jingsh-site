<script setup lang="ts">
import { ui, news, newsArticleIds } from '~/composables/yf-content'

const { t } = useYfLang()
const localePath = useLocalePath()
</script>

<template>
  <section id="news" class="relative py-20 lg:py-28">
    <div class="container-x">
      <YfReveal>
        <div class="mb-10 lg:mb-14">
          <div class="kicker mb-4">{{ t(ui.newsSec.kicker) }}</div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {{ t(ui.newsSec.title) }}
          </h2>
        </div>
      </YfReveal>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style="background: hsl(213 30% 18%)">
        <YfReveal v-for="(n, i) in news" :key="i" :delay="(i % 3) * 80" class="h-full">
          <NuxtLink
            class="group relative h-full p-7 flex flex-col justify-between min-h-[180px] transition-colors duration-300 block"
            style="background: hsl(222 47% 4%)"
            :to="localePath(`/blog/${newsArticleIds[i]}`)"
          >
            <div>
              <div class="flex items-center justify-between mb-5">
                <span class="font-mono-tech text-[10px] tracking-[0.25em] text-slate-500">{{ n.date }}</span>
                <span class="font-mono-tech text-[10px] text-slate-600">/{{ String(i + 1).padStart(2, '0') }}</span>
              </div>
              <h3 class="text-[15px] font-semibold leading-relaxed text-slate-200 group-hover:text-white transition-colors">
                {{ t(n.title) }}
              </h3>
            </div>
            <div class="mt-6 flex items-center gap-2 text-[11px] font-medium tracking-wider transition-colors" style="color: hsl(215 20% 62%)">
              <span class="group-hover:text-[hsl(187_92%_55%)] transition-colors">{{ t(ui.newsSec.more) }}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div
              class="absolute left-0 top-0 h-full w-[2px] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500"
              style="background: linear-gradient(to bottom, hsl(187 92% 55%), hsl(217 100% 62%))"
            />
          </NuxtLink>
        </YfReveal>
      </div>
    </div>
  </section>
</template>
