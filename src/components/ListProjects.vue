<script setup lang="ts">
defineProps<{
  projects: Record<string, { name: string, link: string, desc: string, icon?: string, image?: string }[]>
}>()
</script>

<template>
  <div class="max-w-300 mx-auto">
    <p text-center mt--6 mb5 op50 text-lg italic>
      Things I've built and maintain.
    </p>
    <div
      v-for="key, cidx in Object.keys(projects)" :key="key" slide-enter
      :style="{ '--enter-stage': cidx + 1 }"
    >
      <div
        select-none relative h18 mt5 pointer-events-none slide-enter
        :style="{
          '--enter-stage': cidx - 2,
          '--enter-step': '60ms',
        }"
      >
        <span text-5em color-transparent absolute left--1rem top-0rem font-bold leading-1em text-stroke-1.5 text-stroke-hex-aaa op35 dark:op20>{{ key }}</span>
      </div>
      <div
        class="project-grid py-2 max-w-500 w-max mx-auto"
        grid="~ cols-1 md:cols-2 gap-4 lg:cols-3"
      >
        <a
          v-for="item in projects[key]"
          :key="item.name"
          class="item relative flex items-center"
          :href="item.link"
          target="_blank"
          :title="item.name"
        >
          <div class="pt-2 pr-5">
            <!-- `!` overrides the `.prose img` width/margins this page inherits -->
            <img v-if="item.image" :src="item.image" :alt="item.name" class="w-9! h-9! m-0! max-w-none">

            <div v-else class="text-3xl opacity-50" :class="item.icon || 'i-ri-github-line'" />
          </div>
          <div class="flex-auto">
            <div class="text-normal">{{ item.name }}</div>
            <div class="desc text-sm opacity-50 font-normal">{{ item.desc }}</div>
          </div>
        </a>
      </div>
    </div>
    <div class="prose pb5 mx-auto mt10 text-center">
      <a href="https://github.com/rainxchzed?tab=repositories" target="_blank" op50>All repositories on GitHub</a>
    </div>
  </div>
</template>

<style scoped>
.project-grid a.item {
  background: transparent;
  font-size: 1.1rem;
  width: 350px;
  max-width: 100%;
  padding: 0.5rem 0.875rem 0.875rem;
  border-radius: 6px;
}

.project-grid a.item:hover {
  background: #88888811;
}
</style>
