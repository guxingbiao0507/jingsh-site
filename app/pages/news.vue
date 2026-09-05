<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { data: site } = await useSite()

const page = ref(1)
const pageSize = 9

const { posts, total, pending, formatDateTime } = useJingshNews({
  limit: pageSize,
  offset: computed(() => (page.value - 1) * pageSize),
  category: 'news',
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

useSeoMeta({
  title: () => `${t('news.title')} — ${site.value?.settings.siteName || '京师北欧 / JINGSH Nordic'}`,
  description: () => t('news.description'),
  ogImage: '/assets/themes/jingsh/images/jingshi-top-bg.png',
})

function goPage(p: number) {
  if (p < 1 || p > totalPages.value) return
  page.value = p
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="news-list-page">
    <div class="jingsh-container px-5 pb-5">
      <nav class="news-breadcrumb">
        <NuxtLink :to="localePath('/')">{{ t('nav.home') }}</NuxtLink>
        <span class="mx-1">&gt;</span>
        <span>{{ t('news.title') }}</span>
      </nav>

      <div v-if="pending" class="text-center py-20 text-[rgb(82,100,124)]">
        {{ t('news.loading') }}
      </div>

      <ul v-else-if="posts.length" class="news-list">
        <JingshNewsListItem
          v-for="post in posts"
          :key="post.id"
          :title="post.title"
          :excerpt="post.excerpt"
          :date="formatDateTime(post.publishedAt)"
          :href="localePath(`/blog/${post.slug}`)"
          :learn-more="t('news.learnMore')"
        />
      </ul>

      <div v-else class="text-center py-20 text-[rgb(82,100,124)]">
        {{ t('news.empty') }}
      </div>

      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
        <button
          type="button"
          class="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:border-[#EB9624] bg-white"
          :disabled="page <= 1"
          @click="goPage(page - 1)"
        >
          {{ t('news.previous') }}
        </button>
        <span class="text-sm text-[rgb(82,100,124)] px-3">{{ page }} / {{ totalPages }}</span>
        <button
          type="button"
          class="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:border-[#EB9624] bg-white"
          :disabled="page >= totalPages"
          @click="goPage(page + 1)"
        >
          {{ t('news.next') }}
        </button>
      </div>
    </div>
  </div>
</template>
