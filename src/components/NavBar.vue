<script setup lang="ts">
function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const { y: scroll } = useWindowScroll()
</script>

<template>
  <header class="header z-40">
    <RouterLink
      class="w-10 h-10 absolute xl:fixed m-6 select-none outline-none"
      to="/"
      title="Home"
    >
      <Logo />
    </RouterLink>
    <button
      title="Scroll to top"
      fixed right-3 bottom-3 w-10 h-10 hover:op100 rounded-full
      hover-bg-hex-8883 transition duration-300 z-100 print:hidden
      :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
      @click="toTop()"
    >
      <div i-ri-arrow-up-line />
    </button>
    <nav class="nav">
      <div class="spacer" />
      <div class="right" print:op0>
        <RouterLink to="/blog" title="Blog">
          <span class="lt-md:hidden">Blog</span>
          <div i-ri-article-line md:hidden />
        </RouterLink>
        <RouterLink to="/projects" title="Projects">
          <span class="lt-md:hidden">Projects</span>
          <div i-ri-lightbulb-line md:hidden />
        </RouterLink>
        <a href="https://github.com/rainxchzed" target="_blank" title="GitHub">
          <div i-uil-github-alt />
        </a>
        <a href="https://linkedin.com/in/rainxchzed" target="_blank" title="LinkedIn" class="lt-md:hidden">
          <div i-ri-linkedin-box-line />
        </a>
        <a href="/rss.xml" target="_blank" title="RSS" class="lt-md:hidden">
          <div i-la-rss-square style="font-size:1.25rem; margin: 0 -0.125rem;" />
        </a>
        <ToggleTheme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav a,
.nav button {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover,
.nav button:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}
</style>
