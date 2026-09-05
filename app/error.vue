<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()

const isNotFound = computed(() => props.error.statusCode === 404)
const seconds = ref(10)
let timer: ReturnType<typeof setInterval> | null = null

function goHome() {
  navigateTo(localePath('/'))
}

onMounted(() => {
  if (!isNotFound.value) return
  timer = setInterval(() => {
    seconds.value -= 1
    if (seconds.value <= 0) {
      if (timer) clearInterval(timer)
      goHome()
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

useSeoMeta({
  title: () => (isNotFound.value ? t('error.notFoundTitle') : t('error.genericTitle')),
})
</script>

<template>
  <NuxtLayout name="default">
    <div class="error-page">
      <div class="jingsh-container px-4 py-20 md:py-28 text-center max-w-xl mx-auto">
        <p class="text-6xl font-bold text-[#EB9624] mb-4">{{ error.statusCode }}</p>
        <h1 class="text-2xl md:text-3xl font-bold text-[rgb(33,33,33)] mb-4">
          {{ isNotFound ? t('error.notFoundTitle') : t('error.genericTitle') }}
        </h1>
        <p class="text-[rgb(82,100,124)] mb-8 leading-relaxed">
          {{ isNotFound ? t('error.notFoundMessage') : (error.statusMessage || t('error.genericMessage')) }}
        </p>
        <p v-if="isNotFound" class="text-sm text-[rgb(82,100,124)] mb-6">
          {{ t('error.redirectIn', { seconds }) }}
        </p>
        <button
          type="button"
          class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#EB9624] text-white font-medium hover:opacity-90 transition-opacity"
          @click="goHome"
        >
          {{ t('error.goHome') }}
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>
