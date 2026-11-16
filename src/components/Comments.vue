<script setup lang="ts">
import { isDark } from '~/logics'

// Giscus, backed by this repo's GitHub Discussions
const el = ref<HTMLDivElement>()
const route = useRoute()
const theme = computed(() => isDark.value ? 'dark' : 'light')

// Discussions are titled after the old `/posts/<slug>/` URLs. Pinning the term
// keeps existing threads attached now that the blog lives at `/blog`.
const slug = route.path.split('/').filter(Boolean).pop()

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  Object.entries({
    'data-repo': 'rainxchzed/rainxchzed.github.io',
    'data-repo-id': 'R_kgDOR_9_JA',
    'data-category': 'General',
    'data-category-id': 'DIC_kwDOR_9_JM4C6poe',
    'data-mapping': 'specific',
    'data-term': `posts/${slug}/`,
    'data-strict': '0',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'top',
    'data-theme': theme.value,
    'data-lang': 'en',
    'data-loading': 'lazy',
  }).forEach(([k, v]) => script.setAttribute(k, v))
  script.crossOrigin = 'anonymous'
  script.async = true
  el.value!.appendChild(script)
})

watch(theme, (theme) => {
  el.value?.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    ?.contentWindow
    ?.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app')
})
</script>

<template>
  <div ref="el" class="giscus" />
</template>
