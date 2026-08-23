<script setup>
/**
 * Testimonials — four quotes, each with its own portrait.
 *
 * The green line above the logo strip is the TIMER: it fills from 0 to 100%
 * of the card width over the slide duration and restarts on every slide.
 * There are no dots — the timer is the only indicator, as on the original.
 *
 * Hover-pause is on the portrait image group, delta is clamped, and the clock
 * is gated on an IntersectionObserver.
 */
const quotes = [
  {
    id: 1,
    body: 'Making this the first true generator on the Internet. It uses a dictionary of over words, combined with a handful of model sentence structures, to generate.',
    name: 'Dennis Lail',
    role: 'Marketer',
    photo: '/img/avatar-1.svg',
  },
  {
    id: 2,
    body: 'Very denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, combined with a handful so blinded.',
    name: 'Peter Leo,',
    role: 'CTO - Criston',
    photo: '/img/avatar-2.svg',
  },
  {
    id: 3,
    body: 'We use as filler text for layouts, non-readability is of great importance but because those who do not know how to pleasure rationally encounter consequences that are.',
    name: 'Aurthoe De,',
    role: 'CEO - Dorid Co',
    photo: '/img/avatar-3.svg',
  },
  {
    id: 4,
    body: 'I must explain to you how all this mistaken. Idea of denouncing pleasure and praising pain was born and I will give you a complete account.',
    name: 'Roe Smith',
    role: 'Director, Growth Marketing',
    photo: '/img/avatar-4.svg',
  },
]

const logos = ['jQuery', 'GitHub', 'Portis', 'envato', 'daomak']
const DWELL = 6000

const sectionEl = ref(null)
const index = ref(0)
const current = computed(() => quotes[index.value])

const progress = ref(0)
const paused = ref(false)
const isVisible = ref(false)
const reducedMotion = ref(false)

let lastTime = 0
let elapsed = 0
let rafId = null
let mq = null
let observer = null

function loop(currentTime) {
  if (!lastTime) lastTime = currentTime
  // Clamp delta to at most 100ms so backgrounded tabs don't skip slides upon return
  const delta = Math.min(currentTime - lastTime, 100)
  lastTime = currentTime

  if (isVisible.value && !paused.value && !reducedMotion.value) {
    elapsed += delta
    if (elapsed >= DWELL) {
      elapsed = 0
      progress.value = 0
      index.value = (index.value + 1) % quotes.length
    } else {
      progress.value = elapsed / DWELL
    }
  }

  rafId = requestAnimationFrame(loop)
}

function onMotionChange(e) {
  reducedMotion.value = e.matches
}

onMounted(() => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mq.matches
  mq.addEventListener('change', onMotionChange)

  if (sectionEl.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.value = entry.isIntersecting
      },
      { threshold: 0.1 },
    )
    observer.observe(sectionEl.value)
  }

  rafId = requestAnimationFrame(loop)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  observer?.disconnect()
  mq?.removeEventListener('change', onMotionChange)
})
</script>

<template>
  <section
    ref="sectionEl"
    class="bg-mist py-16 sm:py-24"
    aria-label="Customer testimonials"
    aria-roledescription="carousel"
  >
    <div class="mx-auto w-full max-w-[1213px] px-4 sm:px-6">
      <div v-reveal class="overflow-hidden rounded-[32px] bg-white">
        <div class="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:p-14">
          <!-- portrait: mint arch in front, forest arch peeking out behind; hover-pause scoped here -->
          <div
            class="relative min-w-0"
            @mouseenter="paused = true"
            @mouseleave="paused = false"
            @focusin="paused = true"
            @focusout="paused = false"
          >
            <span
              class="absolute -left-2 top-4 h-[86%] w-[78%] rounded-t-full bg-forest"
              aria-hidden="true"
            />
            <Transition name="fade" mode="out-in">
              <div :key="current.id" class="relative ml-8 overflow-hidden rounded-t-full bg-[#bdeba4]">
                <img
                  :src="current.photo" :alt="`${current.name}, ${current.role}`"
                  width="600" height="760" loading="lazy"
                  class="h-[320px] w-full object-cover sm:h-[400px]"
                />
              </div>
            </Transition>
          </div>

          <div class="min-w-0">
            <!-- speech-bubble badge: green ring, white face, navy 66, tail bottom-right -->
            <span
              class="grid h-[70px] w-[70px] place-items-center rounded-full rounded-br-none bg-brand"
              aria-hidden="true"
            >
              <span class="grid h-[58px] w-[58px] place-items-center rounded-full rounded-br-none bg-white text-xl font-extrabold text-ink">
                66
              </span>
            </span>

            <Transition name="fade" mode="out-in">
              <blockquote :key="current.id" class="mt-10">
                <p class="max-w-2xl text-[19px] leading-[1.9] text-heading sm:text-[21px]">
                  {{ current.body }}
                </p>
                <footer class="mt-10">
                  <p class="text-[17px] font-bold text-heading">{{ current.name }}</p>
                  <p class="mt-1.5 text-[16px] text-body">{{ current.role }}</p>
                </footer>
              </blockquote>
            </Transition>
          </div>
        </div>

        <!-- timer: fills the card width over the slide, restarts each time -->
        <div class="h-[3px] w-full bg-black/5 overflow-hidden">
          <div
            class="h-full w-full bg-brand will-change-transform"
            :style="{
              transform: `scaleX(${reducedMotion ? 1 : progress})`,
              transformOrigin: 'left center',
            }"
          />
        </div>

        <ul class="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 px-6 py-10 sm:px-10 lg:px-16">
          <li
            v-for="logo in logos" :key="logo"
            class="text-2xl font-bold tracking-tight text-black/20 sm:text-[28px]"
          >{{ logo }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active { transition: none; }
  .fade-enter-from,
  .fade-leave-to { opacity: 1; }
}
</style>
