<script setup lang="ts">
const { data: site } = await useSite()
const { locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

const scrolled = ref(false)
const mobileOpen = ref(false)
const langOpen = ref(false)

import { categories, contacts } from '~/composables/yf-content'

const lang = computed(() => (locale.value === 'en' ? 'en' : 'zh'))
function li(zh: string, en: string) { return lang.value === 'en' ? en : zh }

const { locales: allLocales } = useI18n()
const localeList = computed(() =>
  (allLocales.value as any[]).map(l => ({
    code: l.code,
    name: l.name || l.code,
    to: switchLocalePath(l.code),
  })),
)

let _onScroll: (() => void) | undefined
let _onClose: ((e: MouseEvent) => void) | undefined

onMounted(() => {
  _onScroll = () => (scrolled.value = window.scrollY > 24)
  _onScroll()
  window.addEventListener('scroll', _onScroll, { passive: true })
  _onClose = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest?.('.lang-dropdown')) langOpen.value = false
  }
  window.addEventListener('click', _onClose)
})

onBeforeUnmount(() => {
  if (_onScroll) window.removeEventListener('scroll', _onScroll)
  if (_onClose) window.removeEventListener('click', _onClose)
})

const { t } = useI18n()
const route = useRoute()
const colorMode = useColorMode()

const sectionToRoute: Record<string, string> = {
  products: '/products',
  cases: '/cases',
  about: '/about',
  news: '/blog',
}

const anchors = [
  { id: 'products', key: 'nav.products' },
  { id: 'strengths', key: 'nav.strengths' },
  { id: 'cases', key: 'nav.cases' },
  { id: 'about', key: 'nav.about' },
  { id: 'news', key: 'nav.news' },
]

const isHome = computed(() => {
  const p = route.path.replace(/^\/[a-z]{2}\/?/, '/').replace(/\/$/, '') || '/'
  return p === '/'
})

function goSection(id: string) {
  mobileOpen.value = false
  if (isHome.value) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  } else if (sectionToRoute[id]) {
    navigateTo(localePath(sectionToRoute[id]))
  } else {
    navigateTo(localePath('/'))
    nextTick(() => {
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300)
    })
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[hsl(222_47%_4%)]">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded">
      Skip to content
    </a>
    <!-- Header -->
    <header
      class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
      :class="scrolled || mobileOpen ? 'backdrop-blur-xl' : 'backdrop-blur-none'"
      :style="{
        background: scrolled || mobileOpen
          ? (colorMode.value === 'dark' ? 'hsl(222 47% 4% / 0.82)' : 'hsl(0 0% 100% / 0.88)')
          : 'transparent',
        borderBottom: scrolled || mobileOpen
          ? (colorMode.value === 'dark' ? '1px solid hsl(213 30% 18%)' : '1px solid hsl(214 32% 91%)')
          : '1px solid transparent',
      }"
    >
      <div class="container-x flex h-16 lg:h-[72px] items-center justify-between gap-4">
        <!-- logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center gap-3 shrink-0">
          <div
            class="flex h-9 w-9 items-center justify-center font-mono-tech text-sm font-bold"
            style="
              background: linear-gradient(135deg, hsl(187 92% 55%), hsl(217 100% 62%));
              color: hsl(222 47% 4%);
              clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
            "
          >TB</div>
          <div class="text-left leading-tight">
            <div class="text-[15px] font-bold tracking-wide text-slate-900 dark:text-white">{{ li('tbseo', 'TBSEO') }}</div>
            <div class="font-mono-tech text-[9px] tracking-[0.25em] text-slate-500 dark:text-slate-400 uppercase">
              {{ li('TBSEO NETWORK TECH.', '无锡tbseo网络科技') }}
            </div>
          </div>
        </NuxtLink>

        <!-- desktop nav -->
        <nav class="hidden lg:flex items-center gap-1">
          <button
            v-for="a in anchors"
            :key="a.id"
            class="px-4 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors relative group"
            @click="goSection(a.id)"
          >
            {{ t(a.key) }}
            <span
              class="absolute left-4 right-4 -bottom-0.5 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style="background: hsl(187 92% 55%)"
            />
          </button>
          <NuxtLink
            :to="localePath('/contact')"
            class="px-4 py-2 text-[13px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors relative group"
          >
            {{ t('nav.contact') }}
            <span
              class="absolute left-4 right-4 -bottom-0.5 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style="background: hsl(187 92% 55%)"
            />
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2 sm:gap-3">
          <!-- theme toggle -->
          <button
            class="flex h-8 w-8 items-center justify-center rounded transition-colors text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
          >
            <UIcon v-if="colorMode.value === 'dark'" name="i-lucide-sun" class="text-lg" />
            <UIcon v-else name="i-lucide-moon" class="text-lg" />
          </button>

          <!-- lang switcher -->
          <div class="relative lang-dropdown">
            <button
              class="flex items-center gap-1.5 px-2.5 py-1.5 border hairline font-mono-tech text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:border-[hsl(187_92%_55%_/_0.5)] transition-colors"
              @click.stop="langOpen = !langOpen"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
              </svg>
              <span class="hidden sm:inline uppercase">{{ locale }}</span>
            </button>
            <Transition
              enter-active-class="transition duration-150"
              enter-from-class="opacity-0 -translate-y-1"
              leave-active-class="transition duration-100"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div
                v-if="langOpen"
                class="absolute right-0 top-full mt-1.5 min-w-[140px] py-1 border z-50"
                :style="{
                  background: colorMode.value === 'dark' ? 'hsl(220 40% 7%)' : '#fff',
                  borderColor: colorMode.value === 'dark' ? 'hsl(213 30% 18%)' : 'hsl(214 32% 91%)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: colorMode.value === 'dark' ? 'none' : '0 4px 12px rgba(0,0,0,0.08)',
                }"
              >
                <NuxtLink
                  v-for="loc in localeList"
                  :key="loc.code"
                  :to="loc.to"
                  class="flex items-center gap-2.5 px-4 py-2 text-[12px] transition-colors"
                  :class="loc.code === locale ? 'text-[hsl(187_92%_55%)]' : 'text-slate-400 hover:text-white hover:bg-white/5'"
                  @click="langOpen = false"
                >
                  <span class="font-mono-tech text-[10px] tracking-wider uppercase w-5">{{ loc.code }}</span>
                  <span>{{ loc.name }}</span>
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <NuxtLink
            :to="localePath('/contact')"
            class="btn-primary hidden md:inline-flex !px-5 !py-2 text-xs"
          >
            {{ t('common.getQuote') }}
          </NuxtLink>

          <!-- mobile hamburger -->
          <button
            class="lg:hidden flex h-9 w-9 flex-col items-center justify-center gap-[5px] border hairline"
            aria-label="menu"
            @click="mobileOpen = !mobileOpen"
          >
            <span class="h-px w-4 bg-slate-900 dark:bg-white transition-transform duration-300" :class="mobileOpen ? 'translate-y-[6px] rotate-45' : ''" />
            <span class="h-px w-4 bg-slate-900 dark:bg-white transition-opacity duration-300" :class="mobileOpen ? 'opacity-0' : ''" />
            <span class="h-px w-4 bg-slate-900 dark:bg-white transition-transform duration-300" :class="mobileOpen ? '-translate-y-[6px] -rotate-45' : ''" />
          </button>
        </div>
      </div>

      <!-- mobile menu -->
      <div
        class="lg:hidden overflow-hidden transition-all duration-400"
        :class="mobileOpen ? 'max-h-[28rem]' : 'max-h-0'"
        :style="{
          background: colorMode.value === 'dark' ? 'hsl(222 47% 4% / 0.96)' : 'hsl(0 0% 100% / 0.96)',
          borderTop: mobileOpen ? (colorMode.value === 'dark' ? '1px solid hsl(213 30% 18%)' : '1px solid hsl(214 32% 91%)') : 'none',
        }"
      >
        <nav class="container-x py-4 flex flex-col">
          <button
            v-for="(a, i) in anchors"
            :key="a.id"
            class="flex items-center justify-between py-3.5 text-left text-sm font-medium text-slate-700 dark:text-slate-200 border-b hairline last:border-0"
            @click="goSection(a.id)"
          >
            <span>{{ t(a.key) }}</span>
            <span class="font-mono-tech text-[10px] text-slate-500">0{{ i + 1 }}</span>
          </button>
          <NuxtLink
            :to="localePath('/contact')"
            class="flex items-center justify-between py-3.5 text-left text-sm font-medium text-slate-700 dark:text-slate-200"
            @click="mobileOpen = false"
          >
            <span>{{ t('nav.contact') }}</span>
            <span class="font-mono-tech text-[10px] text-slate-500">06</span>
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main id="main-content" class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="relative border-t bg-slate-50 dark:bg-[hsl(222_47%_4%)]" style="border-color: var(--site-line)">
      <div class="container-x py-14 lg:py-16">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <!-- brand -->
          <div class="lg:col-span-2">
            <div class="flex items-center gap-3 mb-5">
              <div
                class="flex h-9 w-9 items-center justify-center font-mono-tech text-sm font-bold"
                style="
                  background: linear-gradient(135deg, hsl(187 92% 55%), hsl(217 100% 62%));
                  color: hsl(222 47% 4%);
                  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                "
              >YF</div>
              <div class="text-base font-bold text-slate-900 dark:text-white">{{ site?.settings.siteName || li('无锡tbseo网络科技有限公司', 'Wuxi Tbseo Network Technology Co., Ltd.') }}</div>
            </div>
            <p class="max-w-sm text-[13px] leading-relaxed text-slate-500">
              {{ li('专业从事搜索引擎优化与数字营销服务，提供数据驱动的SEO解决方案。', 'A professional SEO and digital marketing agency — delivering data-driven search optimization solutions.') }}
            </p>
            <div class="flow-line mt-8 w-40 opacity-50" />
          </div>

          <!-- products -->
          <div>
            <div class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-5">
              {{ t('nav.products') }}
            </div>
            <ul class="space-y-3">
              <li v-for="c in categories" :key="c.id">
                <button class="text-[13px] text-slate-400 hover:text-[hsl(187_92%_55%)] transition-colors" @click="goSection('products')">
                  {{ li(c.name.zh, c.name.en) }}
                </button>
              </li>
              <li>
                <NuxtLink :to="localePath('/about')" class="text-[13px] text-slate-400 hover:text-[hsl(187_92%_55%)] transition-colors">
                  {{ t('nav.about') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath('/contact')" class="text-[13px] text-slate-400 hover:text-[hsl(187_92%_55%)] transition-colors">
                  {{ t('nav.contact') }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- contact -->
          <div>
            <div class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-5">
              {{ t('nav.contact') }}
            </div>
            <ul class="space-y-3 text-[13px] text-slate-400">
              <li v-for="p in contacts.phones" :key="p.num">
                <a :href="'tel:' + p.num.replace(/-/g, '')" class="hover:text-[hsl(187_92%_55%)] transition-colors font-mono-tech">{{ p.num }}</a>
                <span class="ml-2 text-slate-500">{{ li(p.who.zh, p.who.en) }}</span>
              </li>
              <li class="leading-relaxed pt-1">{{ li(contacts.address.zh, contacts.address.en) }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="border-t" style="border-color: var(--site-line)">
        <div class="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p class="text-[11px] text-slate-600">
            {{ li('无锡tbseo网络科技有限公司 版权所有', 'Wuxi Tbseo Network Technology Co., Ltd. All rights reserved.') }}
          </p>
          <div class="flex items-center gap-4 text-[11px] text-slate-600">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" class="hover:text-slate-400 transition-colors">苏ICP备2022048827号</a>
            <span class="hidden sm:inline text-slate-700">|</span>
            <span>苏公网安备32021402003517号</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
