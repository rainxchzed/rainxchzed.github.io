<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { SITE } from '../scripts/site'

const route = useRoute()

const canonical = computed(() => `https://rainxchzed.dev${route.path === '/' ? '' : route.path.replace(/\/$/, '')}`)

useHead({
  titleTemplate: title => !title || title === 'Usmon N.' ? 'Usmon N.' : `${title} - Usmon N.`,
  meta: [
    { name: 'description', content: SITE.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonical },
    { property: 'og:site_name', content: 'rainxchzed' },
  ],
  link: [
    { rel: 'canonical', href: canonical },
  ],
})
</script>

<template>
  <NavBar />
  <main class="px-7 py-10 of-x-hidden">
    <RouterView />
    <Footer :key="route.path" />
  </main>
</template>
