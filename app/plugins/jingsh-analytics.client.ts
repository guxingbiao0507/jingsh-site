/** Microsoft Clarity (legacy jingsh.fi uses clarityProjectId in CMS settings). */
export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const injected = new Set<string>()

  function injectClarity(projectId: string) {
    const key = `clarity-${projectId}`
    if (injected.has(key)) return
    injected.add(key)
    if (document.querySelector(`script[data-clarity="${projectId}"]`)) return

    const s = document.createElement('script')
    s.dataset.clarity = projectId
    s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`
    document.head.appendChild(s)
  }

  const { data: site } = useAsyncData('site:clarity', () => $fetch('/api/public/site'), {
    default: () => ({ settings: {} }),
  })

  watch(
    () => site.value?.settings?.clarityProjectId,
    (id) => {
      if (id?.trim()) injectClarity(id.trim())
    },
    { immediate: true },
  )
})
