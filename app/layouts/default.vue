<script setup lang="ts">
import { nordicOffices, footer } from '~/composables/yf-content'

const { locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { t, li } = useYfLang()

const mobileOpen = ref(false)

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <header class="jingsh-header">
      <div class="jingsh-container max-lg:h-[60px]">
        <nav class="jingsh-header-nav">
          <div class="jingsh-header-main">
            <NuxtLink :to="localePath('/')" class="jingsh-header-brand shrink-0">
              <img
                src="/assets/themes/jingsh/images/logo.png"
                :alt="li('京师律师事务所', 'Jingsh Law Firm Logo')"
                class="h-12 md:h-16"
              />
              <span class="text-white text-2xl font-bold max-lg:text-sm whitespace-nowrap">
                {{ li('京师北欧 / JINGSH Nordic', '京师北欧 / JINGSH Nordic') }}
              </span>
            </NuxtLink>

            <div class="hidden lg:flex items-center gap-1">
              <NuxtLink :to="localePath('/')" class="jingsh-nav-link">
                {{ li('首页', 'Home') }}
              </NuxtLink>
              <NuxtLink :to="localePath('/news')" class="jingsh-nav-link">
                {{ li('新闻资讯', 'News & Blogs') }}
              </NuxtLink>
            </div>
          </div>

          <div class="jingsh-lang-switch hidden lg:flex items-center text-white">
            <NuxtLink
              :to="switchLocalePath('en')"
              :class="{ 'lang-current': locale === 'en' }"
              title="English Version"
            >EN</NuxtLink>
            <span class="px-2">/</span>
            <NuxtLink
              :to="switchLocalePath('cn')"
              :class="{ 'lang-current': locale === 'cn' }"
              title="中文版本"
            >CN</NuxtLink>
          </div>

          <button
            type="button"
            class="flex lg:hidden text-white focus:outline-none p-2"
            aria-label="menu"
            @click="toggleMobile"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round" />
            </svg>
          </button>
        </nav>
      </div>

      <div
        v-show="mobileOpen"
        class="lg:hidden bg-white border-t absolute top-[60px] lg:top-20 left-0 w-full z-40 shadow-md"
      >
        <div class="jingsh-container py-3 space-y-2">
          <div class="py-2 border-b border-gray-200 mb-2 text-sm font-semibold">
            <NuxtLink :to="switchLocalePath('en')" class="text-[#1e40af]" @click="mobileOpen = false">EN</NuxtLink>
            <span class="px-2 text-gray-500">/</span>
            <NuxtLink :to="switchLocalePath('cn')" class="text-gray-700" @click="mobileOpen = false">CN</NuxtLink>
          </div>
          <NuxtLink
            :to="localePath('/')"
            class="block py-2 text-gray-800 hover:text-[#1e40af]"
            @click="mobileOpen = false"
          >
            {{ li('首页', 'Home') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/news')"
            class="block py-2 text-gray-800 hover:text-[#1e40af]"
            @click="mobileOpen = false"
          >
            {{ li('新闻资讯', 'News & Blogs') }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <main id="main-content">
      <slot />
    </main>

    <footer class="jingsh-footer">
      <div class="jingsh-container py-4">
        <div class="flex flex-row items-center gap-2 mb-4">
          <img
            src="/assets/themes/jingsh/images/logo.png"
            alt="Jingsh Law Firm Logo"
            class="h-[60px]"
          />
          <span class="jingsh-footer-brand">
            {{ li('京师北欧 / JINGSH Nordic', '京师北欧 / JINGSH Nordic') }}
          </span>
        </div>
        <div class="flex justify-between gap-y-4 gap-x-2 max-lg:flex-col">
          <div class="flex flex-col gap-y-[15px] pl-0 lg:pl-[50px]">
            <p class="font-bold text-2xl">{{ t(footer.infoTitle) }}</p>
            <div class="flex flex-row gap-x-[50px] max-lg:flex-col gap-y-6">
              <div v-for="office in nordicOffices" :key="office.company" class="flex flex-col gap-y-[10px]">
                <p class="font-bold">{{ t(office.label) }}</p>
                <p class="text-sm">{{ office.company }}</p>
                <p class="text-sm">
                  Email: <a :href="`mailto:${office.email}`" class="!text-white hover:underline">{{ office.email }}</a>
                </p>
                <p class="text-sm">Address: {{ t(office.address) }}</p>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-y-[15px] max-lg:pl-0 list-none">
            <NuxtLink :to="localePath('/')" class="jingsh-nav-link">{{ li('首页', 'Home') }}</NuxtLink>
            <NuxtLink :to="switchLocalePath('en')" class="jingsh-nav-link">EN</NuxtLink>
            <NuxtLink :to="switchLocalePath('cn')" class="jingsh-nav-link">CN</NuxtLink>
          </div>
        </div>
        <p class="jingsh-footer-copyright">
          {{ t(footer.rights) }}
        </p>
      </div>
    </footer>

    <JingshContactFloat />
  </div>
</template>
