export const useYfLang = () => {
  const { locale } = useI18n()

  const lang = computed(() => (locale.value === 'en' ? 'en' : 'zh'))

  const t = (content: string | { zh: string; en: string }) => {
    if (typeof content === 'string') return content
    return lang.value === 'en' ? content.en : content.zh
  }

  function li(zh: string, en: string) {
    return lang.value === 'en' ? en : zh
  }

  function setLang(l: 'zh' | 'en') {
    locale.value = l
    localStorage.setItem('jingsh-locale', l)
  }

  return { t, lang, li, setLang }
}
