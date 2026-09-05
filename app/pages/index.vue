<script setup lang="ts">
import {
  hero,
  heroHighlights,
  about,
  nordicPresence,
  nordicOffices,
  nordicCapabilities,
  features,
} from '~/composables/yf-content'

const { t, lang, li } = useYfLang()
const { locale } = useI18n()
const localePath = useLocalePath()
const { data: site } = await useSite()

useSeoMeta({
  title: () => site.value?.settings.siteName || 'Jingsh Law Firm',
  description: () => site.value?.settings.siteDescription || t(hero.sub),
  ogImage: '/assets/themes/jingsh/images/jingshi-top-bg.png',
})

const heroSlides = computed(() => [
  { title: `${t(hero.titleA)} ${t(hero.titleB)}`, desc: t(hero.sub), isH1: true },
  { title: t(heroHighlights[0].title), desc: t(heroHighlights[0].desc), isH1: false },
  { title: t(heroHighlights[1].title), desc: t(heroHighlights[1].desc), isH1: false },
])

const { posts: latestNews, pending: newsPending, formatDate } = useJingshNews({ limit: 3, category: 'news' })

const featureIcons = [
  '/assets/themes/jingsh/images/legal.png',
  '/assets/themes/jingsh/images/accounting.png',
  '/assets/themes/jingsh/images/others.png',
]

const slideCount = computed(() => heroSlides.value.length)
const currentSlide = ref(0)
const isAnimating = ref(false)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

function resetAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer)
  if (import.meta.client) {
    autoplayTimer = setInterval(nextSlide, 5000)
  }
}

function goSlide(i: number) {
  if (isAnimating.value || slideCount.value === 0) return
  const next = ((i % slideCount.value) + slideCount.value) % slideCount.value
  if (next === currentSlide.value) return
  isAnimating.value = true
  currentSlide.value = next
  window.setTimeout(() => { isAnimating.value = false }, 650)
  resetAutoplay()
}

function nextSlide() {
  goSlide(currentSlide.value + 1)
}

function prevSlide() {
  goSlide(currentSlide.value - 1)
}

onMounted(() => {
  resetAutoplay()
})

onBeforeUnmount(() => {
  if (autoplayTimer) clearInterval(autoplayTimer)
})
</script>

<template>
  <div>
    <!-- Hero Carousel (horizontal slide like jingsh.fi Swiper) -->
    <section class="hero-carousel relative text-white overflow-hidden">
      <div
        class="hero-track"
        :style="{ transform: `translate3d(-${currentSlide * 100}%, 0, 0)` }"
      >
        <div
          v-for="(slide, i) in heroSlides"
          :key="i"
          class="hero-slide"
        >
          <div class="jingsh-container relative z-10 py-16 md:py-24">
            <div class="hero-card">
              <component :is="slide.isH1 ? 'h1' : 'h2'" class="hero-title">
                {{ slide.title }}
              </component>
              <p class="hero-desc">{{ slide.desc }}</p>
            </div>
          </div>
        </div>
      </div>
      <button type="button" class="hero-nav-btn prev" aria-label="Previous" @click="prevSlide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <button type="button" class="hero-nav-btn next" aria-label="Next" @click="nextSlide">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
      <div class="hero-dots">
        <button
          v-for="(_, i) in heroSlides"
          :key="i"
          type="button"
          class="hero-dot"
          :class="{ active: i === currentSlide }"
          :aria-label="`Slide ${i + 1}`"
          @click="goSlide(i)"
        />
      </div>
    </section>

    <!-- About Us (combined section like jingsh.fi) -->
    <section id="about" class="bg-white py-16 md:py-12">
      <div class="jingsh-container max-lg:px-5">
        <p class="jingsh-section-title mx-auto">{{ t(about.title) }}</p>
        <div class="mx-auto mb-6 space-y-4 text-base">
          <p>
            <span class="jingsh-accent">{{ lang === 'zh' ? '京师律师事务所' : 'Jingsh Law Firm' }}</span>
            {{ lang === 'zh'
              ? '成立于 1994 年，已成长为中国领先的综合性律师事务所之一。律所在全球范围内运营近 100 家办公室，覆盖约 50 个国家和地区，覆盖中国主要城市及国际重要城市。'
              : ' was established in 1994 and has grown into one of the leading full-service law firms in China. The firm operates nearly 100 offices across approximately 50 countries and regions, covering major cities both in China and internationally.'
            }}
          </p>
          <p v-for="(p, i) in about.paragraphs.slice(1)" :key="i">{{ t(p) }}</p>
        </div>

        <p class="mx-auto text-base mb-2">
          <span class="jingsh-accent">{{ t(nordicPresence.title) }}</span>
        </p>
        <div class="mx-auto text-base space-y-4">
          <p>{{ t(nordicPresence.intro) }}</p>
          <template v-for="office in nordicOffices" :key="office.company">
            <p>{{ office.flag }} <span class="font-bold">{{ t(office.name) }}</span></p>
            <p>
              {{ office.company }}<br>
              ({{ t(office.location) }})<br>
              {{ t(office.focus) }}
            </p>
            <hr class="my-4 border-gray-200">
          </template>

          <p><span class="font-bold">{{ t(nordicCapabilities.title) }}</span></p>
          <p>{{ t(nordicCapabilities.intro) }}</p>
          <ul class="list-disc list-inside space-y-1">
            <li v-for="(item, i) in nordicCapabilities.items" :key="i">{{ t(item) }}</li>
          </ul>
          <p>{{ t(nordicCapabilities.closing) }}</p>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section id="services" class="bg-[rgb(248,248,248)] py-16 md:py-12">
      <div class="jingsh-container px-4">
        <div class="service-main-card">
          <img :src="featureIcons[0]" class="w-[50px] h-[50px]" alt="">
          <p class="service-card-title">{{ t(features[0].title) }}</p>
          <p class="service-card-text">
            <template v-for="(line, j) in (lang === 'zh' ? features[0].items.zh.split('\n') : features[0].items.en.split('\n'))" :key="j">
              • {{ line }}<br>
            </template>
            {{ t(features[0].sub) }}
          </p>
        </div>
        <div class="flex flex-row gap-5 w-full mt-5 max-lg:flex-col">
          <div v-for="(f, i) in features.slice(1)" :key="i" class="service-sub-card">
            <img :src="featureIcons[i + 1]" class="w-[50px] h-[50px]" alt="">
            <p class="service-card-title">{{ t(f.title) }}</p>
            <p class="service-card-text">
              <template v-for="(line, j) in (lang === 'zh' ? f.items.zh.split('\n') : f.items.en.split('\n'))" :key="j">
                • {{ line }}<br>
              </template>
              {{ t(f.sub) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest News -->
    <section id="news" class="py-16 md:py-12 bg-white">
      <div class="jingsh-container px-4">
        <div class="text-center max-w-3xl mx-auto mb-8">
          <h2 class="text-[30px] font-bold text-[rgb(33,33,33)] mb-4">
            <NuxtLink :to="localePath('/news')">{{ li('最新资讯', 'Latest News') }}</NuxtLink>
          </h2>
        </div>

        <div v-if="newsPending" class="text-center py-10 text-[rgb(82,100,124)]">
          {{ li('加载中…', 'Loading…') }}
        </div>

        <div v-else-if="latestNews.length" class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 max-lg:px-2.5">
          <JingshNewsCard
            v-for="post in latestNews"
            :key="post.id"
            :title="post.title"
            :excerpt="post.excerpt"
            :date="formatDate(post.publishedAt)"
            :href="localePath(`/blog/${post.slug}`)"
            :learn-more="li('了解更多', 'Learn more')"
          />
        </div>

        <div v-else class="text-center py-10 text-[rgb(82,100,124)]">
          {{ li('暂无资讯', 'No news yet') }}
        </div>

        <div v-if="latestNews.length" class="text-center mt-10">
          <NuxtLink :to="localePath('/news')" class="news-card-link text-base">
            {{ li('查看全部资讯', 'View All News') }} →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
