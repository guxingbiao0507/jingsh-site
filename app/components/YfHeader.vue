<script setup lang="ts">
import { ui, categories } from '~/composables/yf-content'

const { t, lang } = useYfLang()
const { go, goHomeSection } = useYfNav()
const route = useRoute()
const colorMode = useColorMode()

const scrolled = ref(false)
const open = ref(false)

const anchors = [
  { id: 'products', key: 'products' },
  { id: 'strengths', key: 'strengths' },
  { id: 'cases', key: 'cases' },
  { id: 'about', key: 'about' },
  { id: 'news', key: 'news' },
] as const

const isHome = computed(() => route.path === '/' || route.path.startsWith('/cn') && route.path === '/cn' || route.path.startsWith('/en') && route.path === '/en' || route.path === '/' + useI18n().locale.value)

onMounted(() => {
  const onScroll = () => (scrolled.value = window.scrollY > 24)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})

const goSection = (id: string) => {
  open.value = false
  if (isHome.value) {
    goHomeSection(id)
  } else {
    go({ page: 'home' })
    setTimeout(() => goHomeSection(id), 100)
  }
}

const goContact = () => {
  open.value = false
  go({ page: 'contact' })
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
    :class="scrolled || open ? 'backdrop-blur-xl' : 'backdrop-blur-none'"
    :style="{
      background: scrolled || open
        ? (colorMode.value === 'dark' ? 'hsl(222 47% 4% / 0.82)' : 'hsl(0 0% 100% / 0.88)')
        : 'transparent',
      borderBottom: scrolled || open
        ? (colorMode.value === 'dark' ? '1px solid hsl(213 30% 18%)' : '1px solid hsl(214 32% 91%)')
        : '1px solid transparent',
    }"
  >
    <div class="container-x flex h-16 lg:h-[72px] items-center justify-between gap-4">
      <!-- logo -->
      <button class="flex items-center gap-3 shrink-0" @click="go({ page: 'home' })">
        <div
          class="flex h-9 w-9 items-center justify-center font-mono-tech text-sm font-bold"
          style="
            background: linear-gradient(135deg, hsl(187 92% 55%), hsl(217 100% 62%));
            color: hsl(222 47% 4%);
            clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          "
        >
          TB
        </div>
        <div class="text-left leading-tight">
          <div class="text-[15px] font-bold tracking-wide text-slate-900 dark:text-white">
            {{ lang === 'zh' ? 'tbseo' : 'TBSEO' }}
          </div>
          <div class="font-mono-tech text-[9px] tracking-[0.25em] text-slate-500 dark:text-slate-400 uppercase">
            {{ lang === 'zh' ? 'TBSEO NETWORK TECH.' : '无锡tbseo网络科技' }}
          </div>
        </div>
      </button>

      <!-- desktop nav -->
      <nav class="hidden lg:flex items-center gap-1">
        <button
          v-for="a in anchors"
          :key="a.id"
          class="px-4 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors relative group"
          @click="goSection(a.id)"
        >
          {{ t(ui.nav[a.key]) }}
          <span
            class="absolute left-4 right-4 -bottom-0.5 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            style="background: hsl(187 92% 55%)"
          />
        </button>
        <button
          class="px-4 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors relative group"
          @click="goContact"
        >
          {{ t(ui.nav.contact) }}
          <span
            class="absolute left-4 right-4 -bottom-0.5 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            style="background: hsl(187 92% 55%)"
          />
        </button>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <!-- theme toggle -->
        <button
          class="flex h-8 w-8 items-center justify-center rounded transition-colors text-slate-400 hover:text-white dark:text-slate-400 dark:hover:text-white"
          :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
        >
          <UIcon v-if="colorMode.value === 'dark'" name="i-lucide-sun" class="text-lg" />
          <UIcon v-else name="i-lucide-moon" class="text-lg" />
        </button>

        <!-- lang toggle -->
        <div class="flex items-center font-mono-tech text-[11px] border hairline overflow-hidden">
          <button
            class="px-2.5 py-1.5 transition-colors"
            :class="lang === 'zh' ? 'text-slate-950' : 'text-slate-400 hover:text-white dark:text-slate-400 dark:hover:text-white'"
            :style="lang === 'zh' ? { background: 'hsl(187 92% 55%)' } : {}"
            @click="useYfLang().setLang('zh')"
          >
            中
          </button>
          <button
            class="px-2.5 py-1.5 transition-colors"
            :class="lang === 'en' ? 'text-slate-950' : 'text-slate-400 hover:text-white dark:text-slate-400 dark:hover:text-white'"
            :style="lang === 'en' ? { background: 'hsl(187 92% 55%)' } : {}"
            @click="useYfLang().setLang('en')"
          >
            EN
          </button>
        </div>

        <button class="btn-primary hidden md:inline-flex !px-5 !py-2 text-xs" @click="goContact">
          {{ lang === 'zh' ? '免费获取方案' : 'Free Quote' }}
        </button>

        <!-- mobile hamburger -->
        <button
          class="lg:hidden flex h-9 w-9 flex-col items-center justify-center gap-[5px] border hairline"
          aria-label="menu"
          @click="open = !open"
        >
          <span
            class="h-px w-4 bg-slate-900 dark:bg-white transition-transform duration-300"
            :class="open ? 'translate-y-[6px] rotate-45' : ''"
          />
          <span class="h-px w-4 bg-slate-900 dark:bg-white transition-opacity duration-300" :class="open ? 'opacity-0' : ''" />
          <span
            class="h-px w-4 bg-slate-900 dark:bg-white transition-transform duration-300"
            :class="open ? '-translate-y-[6px] -rotate-45' : ''"
          />
        </button>
      </div>
    </div>

    <!-- mobile menu -->
    <div
      class="lg:hidden overflow-hidden transition-all duration-400"
      :class="open ? 'max-h-[28rem]' : 'max-h-0'"
      :style="{
        background: colorMode.value === 'dark' ? 'hsl(222 47% 4% / 0.96)' : 'hsl(0 0% 100% / 0.96)',
        borderTop: open ? (colorMode.value === 'dark' ? '1px solid hsl(213 30% 18%)' : '1px solid hsl(214 32% 91%)') : 'none',
      }"
    >
      <nav class="container-x py-4 flex flex-col">
        <button
          v-for="(a, i) in anchors"
          :key="a.id"
          class="flex items-center justify-between py-3.5 text-left text-sm font-medium text-slate-700 dark:text-slate-200 border-b hairline last:border-0"
          @click="goSection(a.id)"
        >
          <span>{{ t(ui.nav[a.key]) }}</span>
          <span class="font-mono-tech text-[10px] text-slate-500">0{{ i + 1 }}</span>
        </button>
        <button
          class="flex items-center justify-between py-3.5 text-left text-sm font-medium text-slate-700 dark:text-slate-200"
          @click="goContact"
        >
          <span>{{ t(ui.nav.contact) }}</span>
          <span class="font-mono-tech text-[10px] text-slate-500">06</span>
        </button>
      </nav>
    </div>
  </header>
</template>
