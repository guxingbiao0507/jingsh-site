<script setup lang="ts">
const props = withDefaults(
  defineProps<{ delay?: number; y?: number }>(),
  { delay: 0, y: 28 }
)

const el = ref<HTMLDivElement | null>(null)
const shown = ref(false)

onMounted(() => {
  const node = el.value
  if (!node) return
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          shown.value = true
          io.disconnect()
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )
  io.observe(node)
  onBeforeUnmount(() => io.disconnect())
})

const style = computed(() => ({
  opacity: shown.value ? 1 : 0,
  transform: shown.value ? 'translate3d(0,0,0)' : `translate3d(0,${props.y}px,0)`,
  transition: `opacity .8s cubic-bezier(.22,1,.36,1) ${props.delay}ms, transform .8s cubic-bezier(.22,1,.36,1) ${props.delay}ms`,
  willChange: 'opacity, transform',
}))
</script>

<template>
  <div ref="el" :style="style">
    <slot />
  </div>
</template>
