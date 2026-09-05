<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: post, error } = await useFetch(`/api/public/posts/${slug}`, {
  query: computed(() => ({ locale: locale.value })),
  watch: [locale],
})

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 500,
    statusMessage: error.value.statusMessage || t('news.empty'),
    fatal: true,
  })
}

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: t('news.empty'), fatal: true })
}

const { posts: siblingPosts, formatDate } = useJingshNews({ limit: 50, category: 'news' })

const siblings = computed(() => {
  const items = siblingPosts.value
  const idx = items.findIndex(p => p.slug === slug)
  return {
    prev: idx > 0 ? items[idx - 1] : null,
    next: idx >= 0 && idx < items.length - 1 ? items[idx + 1] : null,
  }
})

const tags = computed(() =>
  post.value?.tags?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
)

useSeoMeta({
  title: () => post.value?.metaTitle || post.value?.title,
  description: () => post.value?.metaDescription || post.value?.excerpt || undefined,
  ogTitle: () => post.value?.metaTitle || post.value?.title,
  ogDescription: () => post.value?.metaDescription || post.value?.excerpt || undefined,
  ogImage: () => post.value?.ogImage || post.value?.coverImage || '/assets/themes/jingsh/images/jingshi-top-bg.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value?.metaTitle || post.value?.title,
  twitterDescription: () => post.value?.metaDescription || post.value?.excerpt || undefined,
  twitterImage: () => post.value?.ogImage || post.value?.coverImage || '/assets/themes/jingsh/images/jingshi-top-bg.png',
  robots: () => post.value?.robots || undefined,
})

const config = useRuntimeConfig()
const articleUrl = computed(() => {
  const base = config.public.siteUrl || 'https://www.jingsh.fi'
  return `${base}${localePath(`/blog/${slug}`)}`
})

useHead({
  link: () => [
    { rel: 'canonical', href: post.value?.canonicalUrl || articleUrl.value },
  ],
  script: () => post.value ? [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.value.metaTitle || post.value.title,
      description: post.value.metaDescription || post.value.excerpt || undefined,
      image: post.value.ogImage || post.value.coverImage || undefined,
      datePublished: post.value.publishedAt ? new Date(post.value.publishedAt).toISOString() : undefined,
      dateModified: post.value.updatedAt ? new Date(post.value.updatedAt).toISOString() : undefined,
      author: post.value.authorName ? { '@type': 'Person', name: post.value.authorName } : undefined,
      keywords: post.value.tags || undefined,
      mainEntityOfPage: { '@type': 'WebPage', '@id': post.value.canonicalUrl || articleUrl.value },
    }),
  }] : [],
})
</script>

<template>
  <div v-if="post">
    <section class="bg-white py-16 md:py-12 border-b border-gray-100">
      <div class="jingsh-container px-4 max-w-4xl">
        <nav class="text-sm text-[rgb(82,100,124)] mb-6 flex flex-wrap items-center gap-2">
          <NuxtLink :to="localePath('/')" class="hover:text-[#EB9624]">{{ t('nav.home') }}</NuxtLink>
          <span>/</span>
          <NuxtLink :to="localePath('/news')" class="hover:text-[#EB9624]">{{ t('news.title') }}</NuxtLink>
          <span>/</span>
          <span class="text-[rgb(34,32,29)]">{{ t('news.article', 'Article') }}</span>
        </nav>

        <p v-if="post.categoryName" class="text-[#EB9624] font-semibold text-sm mb-3">{{ post.categoryName }}</p>
        <h1 class="text-3xl md:text-4xl font-bold text-[rgb(33,33,33)] leading-tight mb-4">{{ post.title }}</h1>
        <div class="flex flex-wrap items-center gap-4 text-sm text-[rgb(82,100,124)]">
          <span>{{ formatDate(post.publishedAt) }}</span>
          <span v-if="post.authorName">· {{ post.authorName }}</span>
        </div>
      </div>
    </section>

    <section class="py-12 md:py-16 bg-white">
      <div class="jingsh-container px-4 max-w-3xl">
        <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" class="w-full rounded-xl mb-10">

        <article class="jingsh-article prose max-w-none text-[rgb(34,32,29)] leading-relaxed">
          <MDC :value="post.content" />
        </article>

        <div v-if="tags.length" class="mt-10 flex flex-wrap gap-2">
          <span v-for="tag in tags" :key="tag" class="px-3 py-1 text-xs rounded-full border border-[#EB9624]/40 text-[#EB9624]">
            #{{ tag }}
          </span>
        </div>

        <div class="mt-12 p-6 rounded-2xl bg-[rgb(248,248,248)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p class="font-bold text-[rgb(33,33,33)] mb-1">{{ t('news.ctaTitle', 'Need professional legal services?') }}</p>
            <p class="text-sm text-[rgb(82,100,124)]">{{ t('news.ctaDesc', 'Contact JINGSH Nordic for cross-border legal and compliance support.') }}</p>
          </div>
          <a href="mailto:demi.wei@jingsh.fi" class="contact-form-submit !w-auto !px-6 whitespace-nowrap">{{ t('contact.title', 'Contact Us') }}</a>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 mt-10">
          <NuxtLink v-if="siblings.prev" :to="localePath(`/blog/${siblings.prev.slug}`)" class="news-card !min-h-0">
            <p class="text-xs text-[rgb(82,100,124)] mb-2">← {{ t('news.previous') }}</p>
            <p class="news-card-title !whitespace-normal">{{ siblings.prev.title }}</p>
          </NuxtLink>
          <NuxtLink v-if="siblings.next" :to="localePath(`/blog/${siblings.next.slug}`)" class="news-card !min-h-0 sm:text-right">
            <p class="text-xs text-[rgb(82,100,124)] mb-2">{{ t('news.next') }} →</p>
            <p class="news-card-title !whitespace-normal">{{ siblings.next.title }}</p>
          </NuxtLink>
        </div>

        <div class="mt-10 text-center">
          <NuxtLink :to="localePath('/news')" class="news-card-link text-base">← {{ t('news.backToList') }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.jingsh-article :deep(h1),
.jingsh-article :deep(h2),
.jingsh-article :deep(h3) {
  color: rgb(33, 33, 33);
  font-weight: 700;
  margin: 1.5rem 0 1rem;
}
.jingsh-article :deep(p) { margin-bottom: 1rem; line-height: 1.8; }
.jingsh-article :deep(a) { color: #EB9624; text-decoration: underline; }
.jingsh-article :deep(ul) { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
.jingsh-article :deep(li) { margin-bottom: 0.5rem; }
.jingsh-article :deep(img) { max-width: 100%; border-radius: 0.75rem; margin: 1.5rem 0; }
</style>
