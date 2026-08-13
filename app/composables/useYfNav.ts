import type { AppRoute } from '~/composables/yf-content'

export function useYfNav() {
  const { locale } = useI18n()
  const localePath = useLocalePath()

  const go = (r: AppRoute) => {
    switch (r.page) {
      case 'home':
        navigateTo(localePath('/'))
        break
      case 'product':
        navigateTo(localePath(`/products/${r.slug}`))
        break
      case 'article':
        navigateTo(localePath(`/blog/${r.id}`))
        break
      case 'case':
        navigateTo(localePath(`/cases/${r.slug}`))
        break
      case 'about':
        navigateTo(localePath('/about'))
        break
      case 'contact':
        navigateTo(localePath('/contact'))
        break
    }
  }

  const goHomeSection = (id: string) => {
    navigateTo(localePath('/') + '#' + id)
  }

  return { go, goHomeSection }
}
