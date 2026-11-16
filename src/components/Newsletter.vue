<script setup lang="ts">
const sent = ref(false)
</script>

<template>
  <form
    action="https://buttondown.com/api/emails/embed-subscribe/rainxchzed"
    method="post"
    target="_blank"
    font-mono text-sm
    @submit="sent = true"
  >
    <input type="hidden" name="tag" value="website">
    <div v-if="sent" op50>
      <span>> </span>check your inbox to confirm
    </div>
    <div v-else flex="~ wrap items-center gap-x-2 gap-y-1">
      <label for="newsletter-email" op50 ws-nowrap>> subscribe to the blog</label>
      <div flex="~ items-center gap-1" flex-auto min-w-50>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          autocomplete="email"
          flex-auto min-w-0 py1 bg-transparent outline-none
          border="b dashed base" transition-colors
          focus:border-solid focus:border-gray-400
          placeholder:op40
        >
        <button
          type="submit"
          title="Subscribe"
          op50 hover:op100 transition-opacity
          w-7 h-7 flex="~ items-center justify-center"
        >
          <div i-ri-corner-down-left-line />
        </button>
      </div>
    </div>
  </form>
</template>
