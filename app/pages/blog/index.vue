<script setup lang="ts">
const localePath = useLocalePath()
await navigateTo(localePath('/news'), { redirectCode: 301 })
</script>

<template>
  <div />
</template>
