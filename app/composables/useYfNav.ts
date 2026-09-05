export const useYfNav = () => {
  const localePath = useLocalePath()

  function go(route: { page: string }) {
    const map: Record<string, string> = {
      home: '/',
      news: '/news',
      about: '/#about',
      contact: '/#contact',
    }
    const path = map[route.page]
    if (path) {
      navigateTo(localePath(path))
    }
  }

  function goHomeSection(id: string) {
    if (import.meta.client) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return { go, goHomeSection }
}
