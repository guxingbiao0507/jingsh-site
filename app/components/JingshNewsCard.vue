<script setup lang="ts">
defineProps<{
  title: string
  excerpt?: string | null
  href: string
  date?: string
  learnMore?: string
}>()
</script>

<template>
  <div class="news-card">
    <NuxtLink :to="href">
      <p v-if="date" class="text-xs text-[rgb(82,100,124)] mb-2">{{ date }}</p>
      <p class="news-card-title">{{ title }}</p>
    </NuxtLink>
    <NuxtLink :to="href" class="flex-1 block">
      <p v-if="excerpt" class="news-card-desc">{{ excerpt }}</p>
    </NuxtLink>
    <NuxtLink :to="href" class="news-card-link">
      {{ learnMore || 'Learn more' }}
    </NuxtLink>
  </div>
</template>
