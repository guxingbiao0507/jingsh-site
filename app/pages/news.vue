<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { data: site } = await useSite()

const page = ref(1)
const pageSize = 9

const { posts, total, pending, formatDate } = useJingshNews({
  limit: pageSize,
  offset: computed(() => (page.value - 1) * pageSize),
  category: 'news',
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

useSeoMeta({
  title: () => `${t('news.title')} — ${site.value?.settings.siteName || 'Jingsh Law Firm'}`,
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
  <div>
    <section class="bg-white py-16 md:py-12 border-b border-gray-100">
      <div class="jingsh-container px-4 text-center">
        <h1 class="text-[30px] font-bold text-[rgb(33,33,33)] mb-4">
          {{ t('news.title') }}
        </h1>
        <p class="text-[rgb(82,100,124)]">{{ t('news.subtitle') }}</p>
      </div>
    </section>

    <section class="py-16 md:py-12 bg-white">
      <div class="jingsh-container px-4">
        <div v-if="pending" class="text-center py-20 text-[rgb(82,100,124)]">
          {{ t('news.loading') }}
        </div>

        <div v-else-if="posts.length" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <JingshNewsCard
            v-for="post in posts"
            :key="post.id"
            :title="post.title"
            :excerpt="post.excerpt"
            :date="formatDate(post.publishedAt)"
            :href="localePath(`/blog/${post.slug}`)"
            :learn-more="t('news.learnMore')"
          />
        </div>

        <div v-else class="text-center py-20 text-[rgb(82,100,124)]">
          {{ t('news.empty') }}
        </div>

        <div v-if="totalPages > 1" class="mt-12 flex items-center justify-center gap-2">
          <button
            type="button"
            class="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:border-[#EB9624]"
            :disabled="page <= 1"
            @click="goPage(page - 1)"
          >
            {{ t('news.previous') }}
          </button>
          <span class="text-sm text-[rgb(82,100,124)] px-3">{{ page }} / {{ totalPages }}</span>
          <button
            type="button"
            class="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:border-[#EB9624]"
            :disabled="page >= totalPages"
            @click="goPage(page + 1)"
          >
            {{ t('news.next') }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
