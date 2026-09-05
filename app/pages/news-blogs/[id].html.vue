<script setup lang="ts">
/** Legacy jingsh.fi URLs: /news-blogs/4.html → /blog/{slug} */
const LEGACY_SLUGS: Record<string, string> = {
  1: 'jingsh-uzbekistan-tashkent-cooperative-office-was-officially-established',
  2: 'governor-of-irkutsk-oblast-igor-kobzev-received-jingsh-lawyers',
  3: 'jingsh-korea-incorporated-officially-established-in-seoul-korea',
  4: 'jingsh-lawyer-received-invitation-for-the-fifth-bifp-in-russia',
}

const route = useRoute()
const localePath = useLocalePath()

const id = String(route.params.id || '')
const slug = LEGACY_SLUGS[id]

if (slug) {
  await navigateTo(localePath(`/blog/${slug}`), { redirectCode: 301 })
}
else {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}
</script>

<template>
  <div />
</template>
