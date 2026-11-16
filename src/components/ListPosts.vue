<script setup lang="ts">
import { formatDate } from '~/logics'

interface Post {
  path: string
  title: string
  date: string
  description?: string
}

const router = useRouter()
const posts: Post[] = router.getRoutes()
  .filter(i => i.path.startsWith('/blog/') && i.meta.frontmatter?.date && !i.meta.frontmatter.draft)
  .map(i => ({
    path: i.path,
    title: i.meta.frontmatter.title,
    date: i.meta.frontmatter.date,
    description: i.meta.frontmatter.description,
  }))
  .sort((a, b) => +new Date(b.date) - +new Date(a.date))

const getYear = (a: Date | string | number) => new Date(a).getFullYear()
</script>

<template>
  <ul>
    <template v-if="!posts.length">
      <div py2 op50>
        { nothing here yet }
      </div>
    </template>

    <template v-for="post, idx in posts" :key="post.path">
      <div
        v-if="getYear(post.date) !== getYear(posts[idx - 1]?.date ?? 0)"
        select-none relative h20 pointer-events-none slide-enter
        :style="{
          '--enter-stage': idx - 2,
          '--enter-step': '60ms',
        }"
      >
        <span text-8em color-transparent absolute left--3rem top--2rem font-bold text-stroke-2 text-stroke-hex-aaa op10>{{ getYear(post.date) }}</span>
      </div>
      <div
        class="slide-enter"
        :style="{
          '--enter-stage': idx,
          '--enter-step': '60ms',
        }"
      >
        <RouterLink :to="post.path" class="item block font-normal mb-6 mt-2 no-underline">
          <li class="no-underline" flex="~ col md:row gap-2 md:items-center">
            <div class="title text-lg leading-1.2em">
              {{ post.title }}
            </div>
            <span text-sm op50 ws-nowrap>
              {{ formatDate(post.date, true) }}
            </span>
          </li>
          <div v-if="post.description" op50 text-sm mt-1 line-clamp-2>
            {{ post.description }}
          </div>
        </RouterLink>
      </div>
    </template>
  </ul>
</template>
