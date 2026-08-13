<script setup lang="ts">
import { ui, categories, products, type CategoryId } from '~/composables/yf-content'

const { t } = useYfLang()
const localePath = useLocalePath()

const active = ref<CategoryId | 'all'>('all')

// Use static data (SSR-safe)
const filtered = computed(() => {
  if (active.value === 'all') return products
  return products.filter((p) => p.cat === active.value)
})

const countOf = (id: CategoryId) => products.filter((p) => p.cat === id).length
</script>

<template>
  <section id="products" class="relative py-20 lg:py-28">
    <div class="container-x">
      <YfReveal>
        <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 lg:mb-14">
          <div>
            <div class="kicker mb-4">{{ t(ui.products.kicker) }}</div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {{ t(ui.products.title) }}
            </h2>
          </div>
          <p class="max-w-md text-sm leading-relaxed text-slate-400">{{ t(ui.products.sub) }}</p>
        </div>
      </YfReveal>

      <!-- category cards -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-px mb-12" style="background: hsl(213 30% 18%)">
        <YfReveal v-for="(c, i) in categories" :key="c.id" :delay="i * 80">
          <button
            class="group relative w-full h-full p-6 text-left transition-all duration-300"
            :style="{ background: active === c.id ? 'hsl(187 92% 55% / 0.08)' : 'hsl(222 47% 4%)' }"
            @click="active = active === c.id ? 'all' : c.id"
          >
            <div class="flex items-start justify-between mb-8">
              <span class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-500">{{ c.code }}</span>
              <span
                class="font-mono-tech text-[10px] px-2 py-0.5 border"
                :style="{
                  borderColor: active === c.id ? 'hsl(187 92% 55% / 0.6)' : 'hsl(213 30% 18%)',
                  color: active === c.id ? 'hsl(187 92% 55%)' : 'hsl(215 20% 62%)',
                }"
              >
                {{ countOf(c.id) }} {{ t({ zh: '款', en: 'MODELS' }) }}
              </span>
            </div>
            <div
              class="text-lg font-bold mb-2 transition-colors"
              :class="active === c.id ? 'text-white' : 'text-slate-200 group-hover:text-white'"
            >
              {{ t(c.name) }}
            </div>
            <p class="text-xs leading-relaxed text-slate-500 line-clamp-2">{{ t(c.desc) }}</p>
            <div
              class="absolute left-0 top-0 h-full w-[2px] transition-all duration-300"
              :style="{
                background: 'linear-gradient(to bottom, hsl(187 92% 55%), hsl(217 100% 62%))',
                opacity: active === c.id ? 1 : 0,
              }"
            />
          </button>
        </YfReveal>
      </div>

      <!-- filter pills -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button
          class="px-4 py-2 font-mono-tech text-[11px] tracking-wider border transition-all duration-300"
          :style="{
            borderColor: active === 'all' ? 'hsl(187 92% 55%)' : 'hsl(213 30% 18%)',
            color: active === 'all' ? 'hsl(187 92% 55%)' : 'hsl(215 20% 62%)',
            background: active === 'all' ? 'hsl(187 92% 55% / 0.08)' : 'transparent',
          }"
          @click="active = 'all'"
        >
          {{ t(ui.products.all) }}
        </button>
        <button
          v-for="c in categories"
          :key="c.id"
          class="px-4 py-2 font-mono-tech text-[11px] tracking-wider border transition-all duration-300"
          :style="{
            borderColor: active === c.id ? 'hsl(187 92% 55%)' : 'hsl(213 30% 18%)',
            color: active === c.id ? 'hsl(187 92% 55%)' : 'hsl(215 20% 62%)',
            background: active === c.id ? 'hsl(187 92% 55% / 0.08)' : 'transparent',
          }"
          @click="active = c.id"
        >
          {{ t(c.name) }}
        </button>
      </div>

      <!-- product grid from CMS -->
      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px" style="background: hsl(213 30% 18%)">
        <div
          v-for="(p, i) in filtered"
          :key="p.slug"
          class="group relative overflow-hidden transition-colors duration-300 cursor-pointer"
          style="background: hsl(222 47% 4%)"
          @click="navigateTo(localePath(`/products/${p.slug}`))"
        >
          <div class="relative aspect-square overflow-hidden">
            <img
              :src="p.coverImage || `/assets/products/${p.slug}.jpg`"
              :alt="p.name"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              @error="($event.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23222%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 fill=%22%23555%22>No Image</text></svg>'"
            />
            <div
              class="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              style="background: linear-gradient(to top, hsl(222 47% 4% / 0.85), transparent 60%)"
            />
            <span class="absolute top-3 left-3 font-mono-tech text-[9px] tracking-[0.2em] text-slate-300/80">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <button
              class="absolute bottom-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-3 py-1.5 text-[11px] font-semibold"
              style="background: hsl(187 92% 55%); color: hsl(222 47% 4%)"
              @click.stop="navigateTo(localePath('/contact'))"
            >
              {{ t(ui.products.detail) }}
            </button>
          </div>
          <div class="p-4 border-t" style="border-color: hsl(213 30% 18%)">
            <div
              class="text-[13px] sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-1"
            >
              {{ t(p.name) }}
            </div>
            <div class="mt-1 font-mono-tech text-[9px] tracking-[0.2em] text-slate-500 uppercase">
              {{ t(categories.find(c => c.id === p.cat)?.name || { zh: '', en: '' }) }}
            </div>
          </div>
          <div
            class="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
            style="background: linear-gradient(90deg, hsl(187 92% 55%), hsl(217 100% 62%))"
          />
        </div>
      </div>
    </div>
  </section>
</template>
