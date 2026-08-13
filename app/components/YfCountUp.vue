<script setup lang="ts">
const props = withDefaults(defineProps<{ to: number; suffix?: string }>(), { suffix: '' })

const el = useTemplateRef<HTMLSpanElement>('el')
const current = ref(props.to) // show real value immediately
let raf: number | null = null
let observer: IntersectionObserver | null = null
let hasAnimated = false

onMounted(() => {
  const node = el.value
  if (!node) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && !hasAnimated) {
        hasAnimated = true
        current.value = 0
        const t0 = performance.now()
        const duration = 1800
        const tick = () => {
          const p = Math.min((performance.now() - t0) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          current.value = Math.round(eased * props.to)
          if (p < 1) {
            raf = requestAnimationFrame(tick)
          }
          else {
            current.value = props.to
          }
        }
        tick()
        observer?.disconnect()
      }
    },
    { threshold: 0.3 },
  )
  observer.observe(node)
})

onBeforeUnmount(() => {
  if (raf !== null) cancelAnimationFrame(raf)
  observer?.disconnect()
})
</script>

<template>
  <span ref="el">{{ current.toLocaleString() }}{{ suffix }}</span>
</template>
