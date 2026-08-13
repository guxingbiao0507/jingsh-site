<script setup lang="ts">
import { ui, categories, contacts } from '~/composables/yf-content'

const { t, lang } = useYfLang()
const { go, goHomeSection } = useYfNav()

const telHref = (num: string) => `tel:${num.replace(/-/g, '')}`
</script>

<template>
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
            >
              TB
            </div>
            <div class="text-base font-bold text-slate-900 dark:text-white">
              {{ lang === 'zh' ? '无锡tbseo网络科技有限公司' : 'Wuxi Tbseo Network Technology Co., Ltd.' }}
            </div>
          </div>
          <p class="max-w-sm text-[13px] leading-relaxed text-slate-500">{{ t(ui.footer.desc) }}</p>
          <div class="flow-line mt-8 w-40 opacity-50" />
        </div>

        <!-- products -->
        <div>
          <div class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-5">
            {{ t(ui.footer.productTitle) }}
          </div>
          <ul class="space-y-3">
            <li v-for="c in categories" :key="c.id">
              <button class="text-[13px] text-slate-400 hover:text-[hsl(187_92%_55%)] transition-colors" @click="goHomeSection('products')">
                {{ t(c.name) }}
              </button>
            </li>
            <li>
              <button class="text-[13px] text-slate-400 hover:text-[hsl(187_92%_55%)] transition-colors" @click="go({ page: 'about' })">
                {{ t(ui.nav.about) }}
              </button>
            </li>
            <li>
              <button class="text-[13px] text-slate-400 hover:text-[hsl(187_92%_55%)] transition-colors" @click="go({ page: 'contact' })">
                {{ t(ui.nav.contact) }}
              </button>
            </li>
          </ul>
        </div>

        <!-- contact -->
        <div>
          <div class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-5">
            {{ t(ui.footer.contactTitle) }}
          </div>
          <ul class="space-y-3 text-[13px] text-slate-400">
            <li v-for="p in contacts.phones" :key="p.num">
              <a :href="telHref(p.num)" class="hover:text-[hsl(187_92%_55%)] transition-colors font-mono-tech">{{ p.num }}</a>
              <span class="ml-2 text-slate-500">{{ t(p.who) }}</span>
            </li>
            <li class="leading-relaxed pt-1">{{ t(contacts.address) }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t" style="border-color: var(--site-line)">
      <div class="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-[11px] text-slate-600">{{ t(ui.footer.rights) }}</p>
        <div class="flex items-center gap-4 text-[11px] text-slate-600">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" class="hover:text-slate-400 transition-colors">
            {{ ui.footer.icp }}
          </a>
          <span class="hidden sm:inline text-slate-700">|</span>
          <span>{{ ui.footer.psb }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>
