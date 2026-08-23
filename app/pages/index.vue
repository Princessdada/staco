<script setup>
useHead({
  title: 'Staco — Financial Security Made Easier',
  meta: [{ name: 'description', content: 'Staco is the dedicated platform for human management that helps to grow your startup business quickly.' }],
})

const showTop = ref(false)
let onScroll
onMounted(() => {
  onScroll = () => { showTop.value = window.scrollY > 700 }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function toTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-white font-sans text-heading antialiased">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-heading focus:px-5 focus:py-3 focus:text-white">
      Skip to content
    </a>

    <SiteHeader />

    <main id="main">
      <SectionsHeroSection />
      <SectionsFeatureCards />
      <SectionsCtaBanner />
      <SectionsWhyChooseUs />
      <SectionsTestimonialSection />
    </main>

    <SiteFooter />

    <Transition name="pop">
      <button
        v-if="showTop" type="button" aria-label="Back to top"
        class="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full border border-brand/40 bg-white text-brand shadow-lg transition hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        @click="toTop"
      >
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: opacity .25s ease, transform .25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(.8); }
</style>
