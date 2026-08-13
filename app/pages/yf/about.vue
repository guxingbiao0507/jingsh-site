<script setup lang="ts">
const { t, lang } = useYfLang()
const { go } = useYfNav()

useSeoMeta({
  title: () => t({ zh: '关于jingsh — 无锡jingsh网络科技有限公司', en: 'About jingsh — Wuxi Jingsh Network Technology' }),
  description: () => t({ zh: '20年SEO经验，3000+项目案例，数据驱动的专业优化', en: '20 years SEO experience, 3000+ projects, data-driven optimization' }),
})
</script>

<template>
  <div>
    <YfSubHero
      :kicker="{ zh: '关于jingsh', en: 'ABOUT JINGSH' }"
      :title="{ zh: '专业SEO × 数字增长', en: 'Professional SEO × Digital Growth' }"
      :crumbs="[{ label: { zh: '关于jingsh', en: 'About' } }]"
    >
      <template #extra>
        <button class="btn-ghost mt-6" @click="go({ page: 'contact' })">
          {{ lang === 'zh' ? '获取免费方案' : 'Get Free Proposal' }}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
            <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </template>
    </YfSubHero>

    <section class="relative py-20 lg:py-28" style="background: hsl(222 47% 4%)">
      <div class="container-x">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <YfReveal>
            <div class="relative corner-frame">
              <div class="relative overflow-hidden">
                <img src="/assets/about.jpg" alt="jingsh office" class="w-full aspect-[16/10] object-cover" />
                <div class="absolute inset-0" style="background: linear-gradient(135deg, hsl(217 100% 62% / 0.15), transparent 50%)" />
              </div>
              <div class="absolute -bottom-6 left-5 sm:left-8 panel px-6 py-5 backdrop-blur-md" style="background: hsl(222 47% 4% / 0.85)">
                <div class="font-mono-tech text-3xl font-bold text-white">
                  70<span style="color: hsl(187 92% 55%)">+</span>
                </div>
                <div class="mt-1 text-[11px] tracking-wider text-slate-400">
                  {{ t({ zh: '年SEO技术传承', en: 'Years of SEO Tech Heritage' }) }}
                </div>
              </div>
            </div>
          </YfReveal>

          <div class="pt-6 lg:pt-12">
            <YfReveal>
              <div class="kicker mb-4">{{ t({ zh: '关于jingsh', en: 'ABOUT JINGSH' }) }}</div>
              <h2 class="text-3xl sm:text-4xl font-black tracking-tight text-white mb-8 leading-tight">
                {{ t({ zh: '专业SEO × 数字增长引擎', en: 'Professional SEO × Digital Growth Engine' }) }}
              </h2>
            </YfReveal>
            <YfReveal :delay="100">
              <div class="space-y-5 text-sm leading-[1.9] text-slate-400 mb-10">
                <p>{{ t({ zh: '无锡jingsh网络科技有限公司是专业从事搜索引擎优化与数字营销服务的科技公司。公司的SEO技术团队、内容策略团队以及数据分析团队都在互联网营销领域深耕 10 年以上，深谙搜索引擎算法规则与最佳实践。', en: 'Wuxi Jingsh Network Technology Co., Ltd. specializes in SEO and digital marketing services. Our SEO technical team, content strategy team and data analysis team each bring 10+ years of experience in internet marketing, with thorough knowledge of search engine algorithms and best practices.' }) }}</p>
                <p>{{ t({ zh: '公司秉承「客户至上」的经营理念，坚持以数据驱动增长、用诚信和共赢发展企业。选择jingsh，您将获得专业SEO技术、精准数据分析与贴心售后于一体的高品质服务。', en: 'Adhering to a customer-first philosophy, we grow through data-driven strategies and mutual success. Choosing jingsh means professional SEO technology, precise data analytics and thoughtful after-sales service.' }) }}</p>
              </div>
            </YfReveal>
            <YfReveal :delay="180">
              <div class="grid grid-cols-2 gap-px mb-10" style="background: hsl(213 30% 18%)">
                <div v-for="stat in [
                  { v: '20+', l: { zh: '年行业经验', en: 'Years Experience' } },
                  { v: '3000+', l: { zh: '成功案例', en: 'Projects' } },
                  { v: '118', l: { zh: '覆盖城市', en: 'Cities' } },
                  { v: '500+', l: { zh: '企业客户', en: 'Clients' } },
                ]" :key="stat.v" class="p-5" style="background: hsl(220 40% 7%)">
                  <div class="font-mono-tech text-2xl font-bold text-white">{{ stat.v }}</div>
                  <div class="mt-1 text-[11px] text-slate-400">{{ t(stat.l) }}</div>
                </div>
              </div>
            </YfReveal>
            <YfReveal :delay="240">
              <div class="flex flex-wrap gap-4">
                <button class="btn-primary" @click="go({ page: 'contact' })">
                  {{ t({ zh: '联系我们', en: 'Contact Us' }) }}
                </button>
                <button class="btn-ghost" @click="go({ page: 'home' })">
                  {{ t({ zh: '浏览产品', en: 'View Products' }) }}
                </button>
              </div>
            </YfReveal>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
