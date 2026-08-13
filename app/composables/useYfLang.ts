import type { Lang, Bi } from '~/composables/yf-content'

export function useYfLang() {
  const { locale } = useI18n()

  // Map design-system zh/en to i18n cn/en
  const lang = computed<Lang>({
    get: () => locale.value === 'en' ? 'en' : 'zh',
    set: (l) => {
      locale.value = l === 'en' ? 'en' : 'cn'
    },
  })

  const setLang = (l: Lang) => {
    locale.value = l === 'en' ? 'en' : 'cn'
    if (import.meta.client) {
      try { localStorage.setItem('yf-lang', l) } catch {}
      document.documentElement.lang = l === 'en' ? 'en' : 'zh-CN'
    }
  }

  const t = (b: Bi) => b[lang.value]

  // Restore saved preference on client
  if (import.meta.client) {
    onMounted(() => {
      try {
        const saved = localStorage.getItem('yf-lang') as Lang | null
        if (saved === 'en') {
          locale.value = 'en'
        }
        document.documentElement.lang = locale.value === 'en' ? 'en' : 'zh-CN'
      } catch {}
    })
  }

  return { lang, setLang, t }
}
