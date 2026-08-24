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

        <!-- Exact perspective arrows SVG graphic aligned to bottom right without artificial trailing spacing -->
        <div
          class="pointer-events-none absolute bottom-0 right-0 hidden h-[85%] max-h-[300px] w-[35%] max-w-[420px] lg:flex lg:items-end lg:justify-end"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 372 250"
            fill="none"
            class="h-full w-auto transition-transform duration-100 ease-out"
            :style="{ transform: `translateY(${Math.round((1 - progress) * 100)}px)` }"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- White lanes -->
            <path d="M120.81 137.65L15.7733 235.304L0 249.943L46.5404 250L58.3819 235.35L137.134 137.65H120.81Z" fill="white"/>
            <path d="M149.295 137.65L90.2023 235.304L81.3184 249.943L127.882 250L132.822 235.35L165.618 137.65H149.295Z" fill="white"/>
            <path d="M177.781 137.65L164.622 235.304L162.627 249.943L209.225 250L207.276 235.35L194.105 137.65H177.781Z" fill="white"/>
            <path d="M206.268 137.65L239.052 235.304L243.947 249.943L290.579 250L281.73 235.35L222.591 137.65H206.268Z" fill="white"/>
            <path d="M234.754 137.65L313.471 235.304L325.267 249.943L371.922 250L356.172 235.35L251.077 137.65H234.754Z" fill="white"/>
            <!-- Arrow stems -->
            <path d="M137.134 105.312H120.811V137.65H137.134V105.312Z" fill="#22675D"/>
            <path d="M165.62 86.6959H149.297V137.65H165.62V86.6959Z" fill="#30766C"/>
            <path d="M194.105 66.1309H177.781V137.65H194.105V66.1309Z" fill="#3A8A7F"/>
            <path d="M222.591 45.1879H206.268V137.65H222.591V45.1879Z" fill="#6CA88B"/>
            <path d="M251.077 23.8549H234.754V137.65H251.077V23.8549Z" fill="#44C486"/>
            <!-- Arrow heads -->
            <path d="M127.919 87.8536L108.764 114.609H147.085L127.919 87.8536Z" fill="#22675D"/>
            <path d="M157.596 65.168L138.43 91.9115H176.751L157.596 65.168Z" fill="#30766C"/>
            <path d="M185.52 43.0557L166.365 69.7992H204.687L185.52 43.0557Z" fill="#3A8A7F"/>
            <path d="M214.419 22.1124L195.264 48.856H233.585L214.419 22.1124Z" fill="#6CA88B"/>
            <path d="M242.536 0L223.381 26.7435H261.702L242.536 0Z" fill="#44C486"/>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Intentionally empty: keeps a valid style module for this SFC so a stale
   HMR request for it can never resolve to the script block. */
</style>
