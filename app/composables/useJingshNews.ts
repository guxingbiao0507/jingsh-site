import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

export interface NewsPostItem {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  description?: string | null
  coverImage?: string | null
  publishedAt?: string | number | null
}

export function useJingshNews(options?: {
  limit?: number
  offset?: MaybeRefOrGetter<number>
  category?: string
}) {
  const { locale } = useI18n()
  const localePath = useLocalePath()

  const limit = options?.limit ?? 50
  const category = options?.category ?? 'news'

  const { data, pending, refresh } = useFetch('/api/public/posts', {
    query: computed(() => ({
      limit,
      offset: toValue(options?.offset) ?? 0,
      category,
      locale: locale.value,
    })),
    default: () => ({ items: [], total: 0, limit, offset: 0 }),
    watch: [locale, () => toValue(options?.offset)],
  })

  const posts = computed(() => (data.value?.items ?? []) as NewsPostItem[])
  const total = computed(() => data.value?.total ?? 0)

  function postHref(slug: string) {
    return localePath(`/blog/${slug}`)
  }

  function formatDate(value?: string | number | null) {
    if (!value) return ''
    return new Date(value).toLocaleDateString(
      locale.value === 'en' ? 'en-US' : 'zh-CN',
      { year: 'numeric', month: 'long', day: 'numeric' },
    )
  }

  function formatDateTime(value?: string | number | null) {
    if (!value) return ''
    const d = new Date(value)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  return { posts, total, pending, refresh, postHref, formatDate, formatDateTime, limit }
}
