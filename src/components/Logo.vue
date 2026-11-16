<!-- Hand-drawn "u", written stroke by stroke like antfu.me's signature -->
<template>
  <svg viewBox="0 0 100 100" fill="none" aria-label="Usmon N." class="w-full h-full">
    <path
      class="logo-path"
      d="M12 50 C18 44 24 34 27 28 C25 40 23 52 27 60 C31 68 43 67 49 57 C53 50 56 38 57 28 C56 40 55 52 59 60 C63 67 71 66 78 58 C82 53 85 48 88 44"
      stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"
    />
  </svg>
</template>

<style scoped>
.logo-path {
  stroke: #303030;
  stroke-dasharray: 190px;
  stroke-dashoffset: 0;
  animation: logo-write 1.6s cubic-bezier(0.65, 0, 0.35, 1) both;
}
.dark .logo-path {
  stroke: #fdfdfd;
}
@keyframes logo-write {
  from {
    stroke-dashoffset: 190px;
  }
}
@media (prefers-reduced-motion), print {
  .logo-path {
    animation: none;
  }
}
</style>
