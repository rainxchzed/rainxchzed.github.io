<script setup lang="ts">
import { formatDate } from '~/logics'

const { frontmatter } = defineProps<{
  frontmatter: Record<string, any>
}>()

const router = useRouter()
const route = useRoute()
const content = ref<HTMLDivElement>()

const isPost = computed(() => route.path.startsWith('/blog/') && !!frontmatter.date)

onMounted(() => {
  const navigate = () => {
    if (location.hash) {
      const el = document.querySelector(decodeURIComponent(location.hash))
      if (el) {
        const rect = el.getBoundingClientRect()
        const y = window.scrollY + rect.top - 40
        window.scrollTo({
          top: y,
          behavior: 'smooth',
        })
        return true
      }
    }
  }

  // Route same-origin links in markdown through the router instead of a full reload
  const handleAnchors = (event: MouseEvent) => {
    const link = (event.target as HTMLElement).closest('a')

    if (
      !event.defaultPrevented
      && link
      && event.button === 0
      && link.target !== '_blank'
      && link.rel !== 'external'
      && !link.download
      && !event.metaKey
      && !event.ctrlKey
      && !event.shiftKey
      && !event.altKey
    ) {
      const url = new URL(link.href)
      if (url.origin !== window.location.origin)
        return

      event.preventDefault()
      const { pathname, hash } = url
      if (hash && (!pathname || pathname === location.pathname)) {
        window.history.replaceState({}, '', hash)
        navigate()
      }
      else {
        router.push({ path: pathname, hash })
      }
    }
  }

  useEventListener(window, 'hashchange', navigate)
  useEventListener(content.value!, 'click', handleAnchors, { passive: false })

  setTimeout(() => {
    if (!navigate())
      setTimeout(navigate, 1000)
  }, 1)
})

const ArtComponent = computed(() => {
  if (typeof window !== 'undefined' && frontmatter.art === 'plum')
    return defineAsyncComponent(() => import('./ArtPlum.vue'))
  return undefined
})
</script>

<template>
  <ClientOnly v-if="ArtComponent">
    <component :is="ArtComponent" />
  </ClientOnly>
  <div
    v-if="frontmatter.display ?? frontmatter.title"
    class="prose m-auto mb-8"
    :class="[frontmatter.wrapperClass]"
  >
    <h1 class="mb-0 slide-enter-50">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
    <p
      v-if="frontmatter.date"
      class="opacity-50 !-mt-6 slide-enter-50"
    >
      {{ formatDate(frontmatter.date, false) }} <span v-if="frontmatter.duration">· {{ frontmatter.duration }}</span>
    </p>
    <p
      v-if="frontmatter.subtitle"
      class="opacity-50 !-mt-6 italic slide-enter"
    >
      {{ frontmatter.subtitle }}
    </p>
    <p
      v-if="frontmatter.draft"
      class="slide-enter" bg-orange-4:10 text-orange-4 border="l-3 orange-4" px4 py2
    >
      This is a draft, the content may be incomplete.
    </p>
  </div>
  <article ref="content" :class="[frontmatter.class]">
    <slot />
  </article>
  <div v-if="isPost" class="prose m-auto mt-12 slide-enter animate-delay-500 print:hidden">
    <Newsletter />
    <Comments class="mt-10" />
  </div>
  <div v-if="route.path !== '/'" class="prose m-auto mt-8 mb-8 slide-enter animate-delay-500 print:hidden">
    <span font-mono op50>> </span>
    <RouterLink
      :to="route.path.replace(/\/$/, '').split('/').slice(0, -1).join('/') || '/'"
      class="font-mono op50 hover:op75"
    >
      cd ..
    </RouterLink>
  </div>
</template>
