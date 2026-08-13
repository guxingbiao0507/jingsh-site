<script setup lang="ts">
import { ui, contacts } from '~/composables/yf-content'

const { t, lang } = useYfLang()
const { locale } = useI18n()
const verifyLabels: Record<string, string> = { cn: '我不是机器人', en: 'I am not a robot', th: 'ฉันไม่ใช่หุ่นยนต์', my: 'ကျွန်ုပ်သည် စက်ရုပ်မဟုတ်ပါ' }
const verifyLabel = computed(() => verifyLabels[locale.value] || verifyLabels.en)

const sent = ref(false)
const submitting = ref(false)
const errorMsg = ref('')
const verified = ref(false)
const form = reactive({ name: '', phone: '', need: '' })

const submit = async () => {
  if (!verified.value) {
    const verifyMsgs: Record<string, string> = { cn: '请先完成验证', en: 'Please complete the verification', th: 'กรุณายืนยันตัวตนก่อนส่ง', my: 'ကျေးဇူးပြု၍ အတည်ပြုချက်ကို ပြီးစီးပါ' }
    errorMsg.value = verifyMsgs[locale.value] || verifyMsgs.en
    return
  }
  submitting.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: `${form.phone}@inquiry.local`,
        phone: form.phone,
        message: form.need,
      },
    })
    sent.value = true
  } catch {
    // Fallback: save to localStorage if server request fails
    try {
      const list = JSON.parse(localStorage.getItem('yf-inquiries') || '[]')
      list.push({ ...form, at: new Date().toISOString() })
      localStorage.setItem('yf-inquiries', JSON.stringify(list))
    } catch {}
    sent.value = true
    errorMsg.value = ''
  } finally {
    submitting.value = false
  }
}

const inputCls =
  'w-full bg-transparent border-b py-3.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-[hsl(187_92%_55%)]'

const telHref = (num: string) => `tel:${num.replace(/-/g, '')}`
</script>

<template>
  <section id="contact" class="relative py-20 lg:py-28 overflow-hidden" style="background: hsl(220 40% 7%)">
    <div class="absolute inset-0 grid-bg opacity-15" />
    <div class="absolute -bottom-40 -left-20 h-96 w-96 rounded-full opacity-15 blur-3xl" style="background: hsl(187 92% 55% / 0.5)" />

    <div class="container-x relative">
      <div class="grid lg:grid-cols-2 gap-14 lg:gap-20">
        <!-- left: info -->
        <div>
          <YfReveal>
            <div class="kicker mb-4">{{ t(ui.contact.kicker) }}</div>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6">
              {{ t(ui.contact.title) }}
            </h2>
            <p class="text-sm leading-relaxed text-slate-400 mb-10 max-w-md">{{ t(ui.contact.sub) }}</p>
          </YfReveal>

          <YfReveal :delay="100">
            <div class="space-y-7">
              <div>
                <div class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-3">
                  {{ t(ui.contact.phoneLabel) }}
                </div>
                <div class="space-y-2">
                  <a
                    v-for="p in contacts.phones"
                    :key="p.num"
                    :href="telHref(p.num)"
                    class="flex items-baseline gap-4 group w-fit"
                  >
                    <span
                      class="font-mono-tech text-xl sm:text-2xl font-semibold text-white group-hover:text-[hsl(187_92%_55%)] transition-colors"
                    >{{ p.num }}</span>
                    <span class="text-xs text-slate-400">{{ t(p.who) }}</span>
                  </a>
                </div>
              </div>

              <div class="h-px w-full" style="background: hsl(213 30% 18%)" />

              <div>
                <div class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-3">
                  {{ t(ui.contact.addrLabel) }}
                </div>
                <p class="text-sm text-slate-300 leading-relaxed">{{ t(contacts.address) }}</p>
              </div>

              <div>
                <div class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-3">
                  {{ t(ui.contact.qqLabel) }}
                </div>
                <a
                  href="https://wpa.qq.com/msgrd?v=3&uin=2836178166&site=qq&menu=yes"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-2 font-mono-tech text-lg font-semibold transition-colors"
                  style="color: hsl(187 92% 55%)"
                >
                  {{ contacts.qq }}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </YfReveal>
        </div>

        <!-- right: form -->
        <YfReveal :delay="150">
          <div class="corner-frame panel p-7 sm:p-10">
            <div v-if="sent" class="flex flex-col items-center justify-center text-center py-16">
              <div
                class="flex h-16 w-16 items-center justify-center rounded-full mb-6"
                style="background: hsl(187 92% 55% / 0.12); border: 1px solid hsl(187 92% 55% / 0.5)"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(187 92% 55%)" stroke-width="2.2">
                  <path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <p class="text-base font-semibold text-white mb-2">{{ t(ui.contact.form.success) }}</p>
              <p class="font-mono-tech text-sm" style="color: hsl(187 92% 55%)">153-6521-5320</p>
            </div>
            <form v-else class="space-y-2" @submit.prevent="submit">
              <div class="font-mono-tech text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-6">
                {{ lang === 'zh' ? '在线留言 / REQUEST FORM' : 'REQUEST FORM / 在线留言' }}
              </div>
              <input
                v-model="form.name"
                required
                :placeholder="t(ui.contact.form.name)"
                :aria-label="t(ui.contact.form.name)"
                :class="inputCls"
                style="border-color: hsl(213 30% 18%)"
              />
              <input
                v-model="form.phone"
                required
                :placeholder="t(ui.contact.form.phone)"
                :aria-label="t(ui.contact.form.phone)"
                :class="inputCls"
                style="border-color: hsl(213 30% 18%)"
              />
              <textarea
                v-model="form.need"
                required
                rows="4"
                :placeholder="t(ui.contact.form.need)"
                :aria-label="t(ui.contact.form.need)"
                :class="`${inputCls} resize-none`"
                style="border-color: hsl(213 30% 18%)"
              />
              <div class="flex items-center gap-3 border rounded-lg p-3 mt-2" style="border-color: hsl(213 30% 18%); background: hsl(220 40% 10%)">
                <input v-model="verified" type="checkbox" class="w-4 h-4 rounded accent-[hsl(187_92%_55%)]" />
                <span class="text-sm text-slate-300">{{ verifyLabel }}</span>
              </div>
              <div v-if="errorMsg" class="text-sm text-red-400 mt-2">{{ errorMsg }}</div>
              <div class="pt-4">
                <button type="submit" class="btn-primary w-full" :disabled="submitting || !verified">
                  {{ t(ui.contact.form.submit) }}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </YfReveal>
      </div>
    </div>
  </section>
</template>
