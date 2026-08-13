<script setup lang="ts">
import { ui, cases } from '~/composables/yf-content'

const { t } = useYfLang()
const localePath = useLocalePath()
</script>

<template>
  <section id="cases" class="relative py-20 lg:py-28">
    <div class="container-x">
      <YfReveal>
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-14">
          <div>
            <div class="kicker mb-4">{{ t(ui.casesSec.kicker) }}</div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {{ t(ui.casesSec.title) }}
            </h2>
          </div>
          <p class="max-w-md text-sm leading-relaxed text-slate-400">{{ t(ui.casesSec.sub) }}</p>
        </div>
      </YfReveal>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style="background: hsl(213 30% 18%)">
        <YfReveal v-for="(c, i) in cases" :key="c.slug" :delay="(i % 3) * 80" class="h-full">
          <NuxtLink
            class="group relative h-full overflow-hidden block"
            style="background: hsl(222 47% 4%)"
            :to="localePath(`/cases/${c.slug}`)"
          >
            <div class="relative aspect-[4/3] overflow-hidden">
              <img
                :src="`/assets/cases/${c.slug}.jpg`"
                :alt="t(c.name)"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
              />
              <div
                class="absolute inset-0"
                style="background: linear-gradient(to top, hsl(222 47% 4% / 0.9) 0%, transparent 55%)"
              />
              <span
                class="absolute top-3 left-3 px-2.5 py-1 font-mono-tech text-[10px] tracking-wider backdrop-blur-md"
                style="background: hsl(222 47% 4% / 0.6); color: hsl(187 92% 55%); border: 1px solid hsl(187 92% 55% / 0.3)"
              >
                {{ t(c.tag) }}
              </span>
            </div>
            <div class="absolute bottom-0 inset-x-0 p-5">
              <div class="text-sm font-semibold text-white leading-snug">{{ t(c.name) }}</div>
              <div class="mt-2 flex items-center gap-2 font-mono-tech text-[9px] tracking-[0.25em] text-slate-400">
                <span class="h-px w-6" style="background: hsl(187 92% 55%)" />
                CASE {{ String(i + 1).padStart(3, '0') }}
              </div>
            </div>
            <div
              class="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
              style="background: linear-gradient(90deg, hsl(187 92% 55%), hsl(217 100% 62%))"
            />
          </NuxtLink>
        </YfReveal>
      </div>
    </div>
  </section>
</template>
