<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { data: site } = await useSite()
function li(zh: string, en: string) { return locale.value === 'en' ? en : zh }

useSeoMeta({
  title: () => `${t('news.title')} — ${site.value?.settings.siteName}`,
  description: () => site.value?.settings.siteDescription,
  ogImage: '/assets/hero.jpg',
  twitterCard: 'summary_large_image',
})

const { data: postsData } = await useFetch('/api/public/posts', {
  query: { limit: 50, category: 'news', locale },
  default: () => ({ items: [], total: 0 }),
  watch: [locale],
})

const posts = computed(() => postsData.value?.items ?? [])
</script>

<template>
  <div>
    <section class="border-b hairline" style="min-height:260px; border-color: hsl(213 30% 18%); background: hsl(220 40% 7%)">
      <div class="container-x py-16 text-center">
        <div class="kicker mb-4">{{ li('一番资讯', 'INSIGHTS') }}</div>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white">{{ t('news.title') }}</h1>
        <p class="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">{{ t('news.subtitle') }}</p>
      </div>
    </section>

    <div class="container-x py-16">
      <div v-if="posts.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-px max-w-6xl mx-auto" style="background: hsl(213 30% 18%)">
        <NuxtLink v-for="(post, i) in posts" :key="post.id" :to="localePath(`/blog/${post.slug}`)" class="group block p-7 flex flex-col justify-between min-h-[180px] transition-colors duration-300" style="background: hsl(222 47% 4%)">
          <div>
            <div class="flex items-center justify-between mb-5">
              <span class="font-mono-tech text-[10px] tracking-[0.25em] text-slate-500">{{ post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '' }}</span>
              <span class="font-mono-tech text-[10px] text-slate-600">/{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
            <h3 class="text-[15px] font-semibold leading-relaxed text-slate-200 group-hover:text-white transition-colors">{{ post.title }}</h3>
          </div>
          <div class="mt-6 flex items-center gap-2 text-[11px] font-medium tracking-wider transition-colors" style="color: hsl(215 20% 62%)">
            <span class="group-hover:text-[hsl(187_92%_55%)] transition-colors">{{ li('阅读文章', 'Read Article') }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
          <div class="absolute left-0 top-0 h-full w-[2px] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500" style="background: linear-gradient(to bottom, hsl(187 92% 55%), hsl(217 100% 62%))" />
        </NuxtLink>
      </div>
      <div v-else class="text-center py-20"><p class="text-slate-500">{{ t('news.empty') }}</p></div>
    </div>
  </div>
</template>
