<script setup>
/**
 * "We are building financial foundations" band.
 *
 * The arrow graphic is scroll-linked in three phases, matching the original:
 *
 *   phase 0  band enters the viewport, even fully visible low on screen:
 *            nothing is drawn at all
 *   phase 1  further scrolling raises the ARROWS one by one, shortest first,
 *            each sliding up from below the clipped bottom edge; they finish
 *            while the band sits around mid-screen, with no stripes yet
 *   phase 2  the last stretch to the top raises all five WHITE STRIPES
 *            TOGETHER as a single group, completing the design as the band
 *            reaches the top of the screen
 *
 * Scroll position is the timeline: scrolling back down reverses everything.
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
  // window opens only once the band has climbed to the upper half of the
  // screen, and closes as it reaches the top
  const startTop = vh * 0.5
  const endTop = vh * 0.12
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

// phase 1: arrow i rises in its own slice, shortest (leftmost) first;
// hidden depth is the arrow full height so the head tip peeks first
function arrowStyle(i) {
  const p = slice(i * 0.07, 0.35)
  return { transform: `translateY(${Math.round((1 - p) * (120 + 26 * i))}px)` }
}

// phase 2: the five stripes rise TOGETHER, one group, after the arrows
const stripesStyle = computed(() => {
  const p = slice(0.65, 0.3)
  return { transform: `translateY(${Math.round((1 - p) * 118)}px)` }
})
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
          <!-- stripes: one group, they arrive together in the final stretch.
               Each stripe top is fused to the foot of its own arrow stem. -->
          <g class="will-change-transform" :style="stripesStyle">
            <path
              v-for="(c, i) in COLORS" :key="'s' + i"
              :d="`M${216 + i * 52} 231 h24 L${140 + i * 52} 340 h-34 Z`"
              fill="#ffffff"
            />
          </g>
          <!-- arrows: staggered, shortest first, blocky heads over thick stems -->
          <g v-for="(c, i) in COLORS" :key="i" class="will-change-transform" :style="arrowStyle(i)">
            <path
              :d="`M${202 + i * 52} ${162 - i * 26} L${228 + i * 52} ${120 - i * 26} L${254 + i * 52} ${162 - i * 26} Z`"
              :fill="c"
            />
            <rect :x="216 + i * 52" :y="158 - i * 26" width="24" :height="74 + i * 26" :fill="c" />
          </g>
        </svg>
      </div>
    </div>
  </section>
</template>
