<script setup lang="ts">
import { toggleDark } from '~/logics'
</script>

<template>
  <button class="theme-toggle relative w-1.2em h-1.2em select-none" title="Toggle color scheme" @click="toggleDark">
    <div i-ri-sun-line class="icon-sun absolute inset-0" />
    <div i-ri-moon-line class="icon-moon absolute inset-0" />
  </button>
</template>

<style scoped>
/* Keyframe animations (not transitions), since useDark suspends transitions while switching */
.icon-moon,
.dark .icon-sun {
  opacity: 0;
}
.dark .icon-moon {
  opacity: 1;
  animation: icon-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
html:not(.dark) .icon-sun {
  animation: icon-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes icon-in {
  from {
    opacity: 0;
    transform: rotate(-90deg) scale(0.4);
  }
}
@media (prefers-reduced-motion: reduce) {
  .icon-sun,
  .icon-moon {
    animation: none !important;
  }
}
</style>
