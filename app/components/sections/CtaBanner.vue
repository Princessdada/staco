<script setup>
/**
 * "We are building financial foundations" band.
 *
 * The graphic is a perspective road: five arrows standing on a horizon, each
 * stem continuing toward the viewer as a white lane. Lane edges are rays from
 * a single vanishing point, so the lanes narrow at the horizon and fan out
 * toward the bottom left. Geometry measured off the original.
 *
 * Animation: the WHOLE graphic is one group sliding up behind the band's
 * clipped bottom edge. Everything moves together at one rate; the arrow tips
 * appear first only because they sit highest in the artwork, and the road
 * arrives last because it sits lowest. Scroll position is the timeline, so
 * scrolling back down puts it away again.
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
  // Nothing while the band sits low on screen. The window opens only once its
  // top has climbed to 45% of the viewport and closes as it nears the top.
  const startTop = vh * 0.45
  const endTop = vh * 0.05
  progress.value = Math.min(1, Math.max(0, (startTop - r.top) / (startTop - endTop)))
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

const HORIZON = 325
const BOTTOM = 500
const STEM = 27
const HEAD_W = 72
const HEAD_H = 45
const VX = 225
const K = 1.62

const ARROWS = [
  { cx: 122, top: 230, fill: '#2f6d55' },
  { cx: 179, top: 185, fill: '#3d8163' },
  { cx: 236, top: 142, fill: '#4e9a74' },
  { cx: 293, top: 100, fill: '#63b489' },
  { cx: 350, top: 52, fill: '#7fd3a3' },
]

// lane = the stem projected toward the viewer along rays from the vanishing point
function lane(cx) {
  const l = cx - STEM / 2
  const r = cx + STEM / 2
  const bl = VX + (l - VX) * K
  const br = VX + (r - VX) * K
  return `M${l} ${HORIZON} H${r} L${br} ${BOTTOM} H${bl} Z`
}

function head(a) {
  return `M${a.cx - HEAD_W / 2} ${a.top + HEAD_H} L${a.cx} ${a.top} L${a.cx + HEAD_W / 2} ${a.top + HEAD_H} Z`
}

// one offset for the whole group — everything rises together
const groupTransform = computed(
  () => `translate(0 ${Math.round((1 - progress.value) * 510)})`,
)
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

        <!-- Measured off the original: the graphic occupies ~25% of the band
             width, sitting at 62-87% across, with a clear margin on the right. -->
        <svg
          class="pointer-events-none absolute bottom-0 right-[12%] hidden h-[88%] w-[27%] lg:block"
          viewBox="0 0 470 510" fill="none" aria-hidden="true"
          preserveAspectRatio="xMaxYMax meet"
        >
          <g :transform="groupTransform">
            <path v-for="a in ARROWS" :key="'l' + a.cx" :d="lane(a.cx)" fill="#ffffff" />
            <g v-for="a in ARROWS" :key="a.cx">
              <path :d="head(a)" :fill="a.fill" />
              <rect
                :x="a.cx - STEM / 2" :y="a.top + HEAD_H"
                :width="STEM" :height="HORIZON - a.top - HEAD_H" :fill="a.fill"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Intentionally empty: keeps a valid style module for this SFC so a stale
   HMR request for it can never resolve to the script block. */
</style>
