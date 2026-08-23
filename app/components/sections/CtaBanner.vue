<script setup>
/**
 * "We are building financial foundations" band.
 *
 * Each arrow unit (colored head, colored stem, and white tail-stripe) is a
 * single fused SVG group that rises together as one continuous shape.
 *
 * Window opens when the band's top crosses ~55% of the viewport and completes
 * as the band reaches the top.
 */
const bannerEl = ref(null)
const progress = ref(0)
let raf = 0

function measure() {
  raf = 0
  const el = bannerEl.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const vh = window.innerHeight
  // Window opens when top crosses ~55% of viewport and finishes when band reaches top (0)
  const startTop = vh * 0.55
  const endTop = 0
  const p = (startTop - r.top) / (startTop - endTop)
  progress.value = Math.min(1, Math.max(0, p))
}
function onScroll() {
  if (!raf) raf = requestAnimationFrame(measure)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  measure()
})
onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})

const COLORS = ['#2f6d55', '#3d8163', '#4e9a74', '#63b489', '#7fd3a3']

const slice = (from, span) =>
  Math.min(1, Math.max(0, (progress.value - from) / span))

// Each arrow unit (head + stem + white stripe) rises from below the bottom clip
function arrowUnitStyle(i) {
  const p = slice(i * 0.08, 0.65)
  // Distance needed to hide entire unit below y=340
  const totalHeight = 220 + 26 * i
  return { transform: `translateY(${Math.round((1 - p) * totalHeight)}px)` }
}
</script>

<template>
  <section class="bg-white py-10 sm:py-16">
    <div class="mx-auto w-full max-w-[1213px] px-4 sm:px-6">
      <div
        ref="bannerEl"
        v-reveal
        class="relative overflow-hidden rounded-[32px] bg-forest px-8 py-16 sm:px-14 sm:py-20 lg:px-20 lg:py-24"
      >
        <h2 class="relative max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-5xl lg:text-[56px]">
          We are building<br />financial foundations
        </h2>

        <a
          href="#"
          class="relative mt-12 inline-flex items-center gap-3 rounded-full bg-mint px-9 py-5 text-base font-bold text-heading transition hover:bg-mint-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Let&#39;s Talk
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </a>

        <svg
          class="pointer-events-none absolute bottom-0 right-8 hidden h-[92%] w-[48%] lg:block"
          viewBox="0 0 480 340" fill="none" aria-hidden="true" preserveAspectRatio="xMaxYMax meet"
        >
          <!-- Fused arrow units: head, stem and white tail-stripe rise together per arrow -->
          <g
            v-for="(c, i) in COLORS"
            :key="i"
            class="will-change-transform"
            :style="arrowUnitStyle(i)"
          >
            <!-- White stripe joined to the foot of the arrow stem -->
            <path
              :d="`M${216 + i * 52} 231 h24 L${140 + i * 52} 340 h-34 Z`"
              fill="#ffffff"
            />
            <!-- Arrow head -->
            <path
              :d="`M${202 + i * 52} ${162 - i * 26} L${228 + i * 52} ${120 - i * 26} L${254 + i * 52} ${162 - i * 26} Z`"
              :fill="c"
            />
            <!-- Arrow stem -->
            <rect :x="216 + i * 52" :y="158 - i * 26" width="24" :height="74 + i * 26" :fill="c" />
          </g>
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
</style>
