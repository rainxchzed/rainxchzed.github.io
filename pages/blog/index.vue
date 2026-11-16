<!--
  A .vue file (not index.md) so Decap CMS, which manages the .md files
  in this folder, never lists the blog index as an entry.
-->
<script setup lang="ts">
import { useHead } from '@unhead/vue'

const title = 'Blog'
const description = 'Writing about machine learning, learning itself, and building things.'

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: 'Blog - Usmon N.' },
    { property: 'og:description', content: description },
    { property: 'og:image', content: 'https://rainxchzed.dev/og.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>

<template>
  <ClientOnly>
    <ArtPlum />
  </ClientOnly>
  <div class="prose m-auto mb-8">
    <h1 class="mb-0 slide-enter-50">
      Blog
    </h1>
  </div>
  <div class="prose m-auto slide-enter-content">
    <ListPosts />
  </div>
  <div class="prose m-auto mt-8 mb-8 slide-enter animate-delay-500 print:hidden">
    <span font-mono op50>> </span>
    <RouterLink to="/" class="font-mono op50 hover:op75">
      cd ..
    </RouterLink>
  </div>
</template>
