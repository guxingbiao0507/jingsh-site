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
  <li class="news-list-item">
    <div v-if="date" class="news-list-date">
      <svg class="news-list-date-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8" />
        <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
      <span>{{ date }}</span>
    </div>
    <div class="news-list-body">
      <NuxtLink :to="href" class="news-list-title">{{ title }}</NuxtLink>
      <NuxtLink :to="href" class="news-list-excerpt block flex-1">
        <p v-if="excerpt">{{ excerpt }}</p>
      </NuxtLink>
      <NuxtLink :to="href" class="news-list-link">{{ learnMore || 'Learn More' }}</NuxtLink>
    </div>
  </li>
</template>
