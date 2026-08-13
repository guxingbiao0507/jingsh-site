<script setup lang="ts">
const { t } = useI18n()
const { data: site } = await useSite()
const { locale } = useI18n()
function li(zh: string, en: string) { return locale.value === 'en' ? en : zh }

useSeoMeta({
  title: () => t('contact.title'),
  description: () => t('contact.subtitle'),
  ogImage: '/assets/hero.jpg',
  twitterCard: 'summary_large_image',
})

const form = ref({ name: '', email: '', phone: '', message: '' })
const submitting = ref(false)
const sent = ref(false)
const errorMsg = ref('')
const verified = ref(false)

async function submitForm() {
  if (!verified.value) {
    errorMsg.value = t('contact.verifyRequired')
    return
  }
  submitting.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/contact', { method: 'POST', body: form.value })
    sent.value = true
    form.value = { name: '', email: '', phone: '', message: '' }
    verified.value = false
    setTimeout(() => { sent.value = false }, 5000)
  } catch {
    errorMsg.value = t('contact.error')
    verified.value = false
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <section class="border-b hairline" style="min-height:260px; border-color: hsl(213 30% 18%); background: hsl(220 40% 7%)">
      <div class="container-x py-16 text-center">
        <div class="kicker mb-4">{{ li('联系我们', 'CONTACT US') }}</div>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-white">{{ t('contact.title') }}</h1>
        <p class="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">{{ t('contact.subtitle') }}</p>
      </div>
    </section>

    <div class="container-x py-16">
      <div class="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 class="text-2xl font-bold mb-6 text-white">{{ t('contact.heading') }}</h2>
          <p class="text-slate-300 mb-8">{{ t('contact.description') }}</p>

          <div v-if="sent" class="panel p-6 mb-6 text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style="background: hsl(187 92% 55% / 0.12); border: 1px solid hsl(187 92% 55% / 0.5)">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 55%)" stroke-width="2.2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </div>
            <p class="text-base font-semibold text-white mb-2">{{ t('contact.sent') }}</p>
          </div>

          <form v-else @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-2">{{ t('contact.name') }}</label>
              <input v-model="form.name" required class="w-full bg-transparent border-b py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[hsl(187_92%_55%)]" style="border-color: hsl(213 30% 18%)" :placeholder="t('contact.name')" />
            </div>
            <div>
              <label class="block font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-2">{{ t('contact.email') }}</label>
              <input v-model="form.email" type="email" required class="w-full bg-transparent border-b py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[hsl(187_92%_55%)]" style="border-color: hsl(213 30% 18%)" :placeholder="t('contact.email')" />
            </div>
            <div>
              <label class="block font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-2">{{ t('contact.phone') }}</label>
              <input v-model="form.phone" class="w-full bg-transparent border-b py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[hsl(187_92%_55%)]" style="border-color: hsl(213 30% 18%)" :placeholder="t('contact.phone')" />
            </div>
            <div>
              <label class="block font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-2">{{ t('contact.message') }}</label>
              <textarea v-model="form.message" rows="5" required class="w-full bg-transparent border-b py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[hsl(187_92%_55%)] resize-none" style="border-color: hsl(213 30% 18%)" :placeholder="t('contact.message')" />
            </div>
            <div class="flex items-center gap-3 border rounded-lg p-3" style="border-color: hsl(213 30% 18%); background: hsl(220 40% 10%)">
              <input v-model="verified" type="checkbox" class="w-4 h-4 rounded accent-[hsl(187_92%_55%)]" />
              <span class="text-sm text-slate-300">{{ t('contact.verifyLabel') }}</span>
            </div>
            <div v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</div>
            <button type="submit" class="btn-primary w-full" :disabled="submitting || !verified">
              {{ submitting ? t('contact.sending') : t('contact.sendMessage') }}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </form>
        </div>

        <div>
          <div class="space-y-4 mb-10">
            <div v-for="item in [
              { icon: 'i-lucide-map-pin', label: t('contact.address'), value: '无锡市新吴区硕放中通路8号' },
              { icon: 'i-lucide-phone', label: t('contact.phone'), value: '151-6157-3181 / 153-6521-5320' },
              { icon: 'i-lucide-mail', label: t('contact.email'), value: 'info@tbseo.com' },
              { icon: 'i-lucide-clock', label: t('contact.workingHours'), value: li('周一至周五 8:00-17:00', 'Mon-Fri 8:00-17:00') },
            ]" :key="item.label" class="flex items-start gap-4">
              <div class="p-2.5 rounded-lg shrink-0" style="background: hsl(187 92% 55% / 0.08); border: 1px solid hsl(187 92% 55% / 0.2)">
                <UIcon :name="item.icon" class="text-lg" style="color: hsl(187 92% 55%)" />
              </div>
              <div>
                <div class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-1">{{ item.label }}</div>
                <div class="text-sm text-slate-200">{{ item.value }}</div>
              </div>
            </div>
          </div>

          <div class="panel p-6">
            <h3 class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-4">{{ t('contactExtra.companyCard') }}</h3>
            <div class="space-y-3 text-sm text-slate-300">
              <p><span class="text-slate-500">{{ t('contactExtra.hotline') }}</span> 153-6521-5320 刘 梅</p>
              <p><span class="text-slate-500">{{ t('contactExtra.mobile') }}</span> 151-6157-3181 孙 闪</p>
              <p><span class="text-slate-500">{{ t('contactExtra.landline') }}</span> 153-6529-7658</p>
              <p><span class="text-slate-500">{{ t('contactExtra.address') }}</span> 无锡市新吴区硕放中通路8号</p>
              <p><span class="text-slate-500">{{ t('contactExtra.website') }}</span> tbseo.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
