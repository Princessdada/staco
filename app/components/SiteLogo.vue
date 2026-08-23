<script setup>
defineProps({ tone: { type: String, default: 'light' } }) // 'light' text on dark, 'dark' text on light
</script>

<template>
  <a href="/" class="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
    <span class="relative block h-9 w-9 overflow-hidden rounded-full">
      <span class="absolute inset-0 bg-gradient-to-br from-[#8fe6b0] via-[#4cae6f] to-[#d9f7e3]" />
      <span class="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/25 to-white/60" />
    </span>
    <span
      class="text-[26px] font-extrabold tracking-tight"
      :class="tone === 'light' ? 'text-white' : 'text-heading'"
    >Staco</span>
  </a>
</template>
