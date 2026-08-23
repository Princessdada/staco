<script setup>
/**
 * "Why choose us" — one index drives two loops that advance together:
 *
 *   copy    slides horizontally: outgoing block exits left, incoming enters
 *           from the right
 *   images  an accordion of three panels; the active panel widens and the
 *           others collapse, so the wide panel moves with the slide
 *
 * The only visible control is the white timer pill inside the active image:
 * a translucent track with a solid fill that runs the length of the slide.
 * There are no dots and no coloured progress bar — the original has neither.
 *
 * Auto-advances, pauses on hover and on keyboard focus (the pause mechanism
 * WCAG requires for auto-updating content), and does not auto-advance at all
 * under prefers-reduced-motion.
 */
const slides = [
  {
    eyebrow: 'text-sky',
    heading: 'Manage team increase productivity',
    body: 'We use as filler text for layouts, non-readability is of great importance but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful nor again is there anyone.',
    points: ['99% Survey Report', 'Trusted by teams', 'Self-Service'],
    images: ['/img/team-1.svg', '/img/team-2.svg', '/img/team-3.svg'],
    active: 1,
  },
  {
    eyebrow: 'text-brand',
    heading: 'Discover business Opportunities',
    body: 'We use as filler text for layouts, non-readability is of great importance but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful nor again is there anyone.',
    points: ['Profile Consultation', 'Asset management', 'No-risk business idea'],
    images: ['/img/team-4.svg', '/img/team-5.svg', '/img/team-6.svg'],
    active: 0,
  },
]

const DWELL = 6000

const index = ref(0)
const current = computed(() => slides[index.value])

const paused = ref(false)
const reducedMotion = ref(false)
let mq = null

function onAnimationEnd(e) {
  if (e.animationName === 'timer' && !reducedMotion.value) {
    index.value = (index.value + 1) % slides.length
  }
}

function onMotionChange(e) {
  reducedMotion.value = e.matches
}

onMounted(() => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mq.matches
  mq.addEventListener('change', onMotionChange)
})

onUnmounted(() => {
  mq?.removeEventListener('change', onMotionChange)
})
</script>

<template>
  <section
    class="bg-white py-16 sm:py-24 lg:py-32"
    aria-labelledby="why-heading"
    aria-roledescription="carousel"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div class="mx-auto grid w-full max-w-[1213px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 [&>*]:min-w-0">
      <div v-reveal class="overflow-hidden">
        <Transition name="slide" mode="out-in">
          <div :key="index">
            <p class="text-[15px] font-bold uppercase tracking-[0.18em]" :class="current.eyebrow">
              Why choose us
            </p>

            <h2
              id="why-heading"
              class="mt-7 max-w-xl text-[30px] font-extrabold leading-[1.2] tracking-[-0.02em] text-heading sm:text-[33px] lg:text-[36px]"
            >
              {{ current.heading }}
            </h2>

            <p class="mt-8 max-w-xl text-[17px] leading-[1.9] text-body">{{ current.body }}</p>

            <ul class="mt-10 grid max-w-md grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <li v-for="p in current.points" :key="p" class="flex items-center gap-3 text-[17px] font-medium text-heading">
                <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-brand" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 12.5 9.5 18 20 6.5" />
                </svg>
                {{ p }}
              </li>
            </ul>
          </div>
        </Transition>
      </div>

      <!-- accordion: the active panel widens, the others collapse -->
      <div v-reveal="{ delay: 120 }" class="min-w-0">
        <div class="flex h-[300px] gap-3 sm:h-[420px] sm:gap-4 lg:h-[520px]">
          <div
            v-for="(src, i) in current.images" :key="src"
            class="relative min-w-0 overflow-hidden rounded-3xl transition-[flex-grow] duration-700 ease-[cubic-bezier(.22,.61,.36,1)]"
            :style="{ flexGrow: i === current.active ? 3 : 1, flexBasis: 0 }"
          >
            <img :src="src" alt="" width="820" height="900" loading="lazy" class="h-full w-full object-cover" />

            <!-- timer pill: only on the active panel, restarts each slide -->
            <div
              v-if="i === current.active"
              class="absolute inset-x-6 bottom-7 h-[5px] overflow-hidden rounded-full bg-white/35"
            >
              <div
                :key="index"
                class="timer-fill h-full w-full rounded-full bg-white will-change-transform"
                :style="{ animationDuration: `${DWELL}ms`, animationPlayState: paused ? 'paused' : 'running' }"
                @animationend="onAnimationEnd"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* copy slides horizontally: out to the left, in from the right */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(60px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-60px);
}

/* GPU-accelerated smooth scaleX progression instead of width reflow */
.timer-fill {
  transform-origin: left center;
  animation-name: timer;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  transform: scaleX(0);
}
@keyframes timer {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@media (prefers-reduced-motion: reduce) {
  .slide-enter-active,
  .slide-leave-active {
    transition: none;
  }
  .slide-enter-from,
  .slide-leave-to {
    opacity: 1;
    transform: none;
  }
  .timer-fill {
    animation: none;
    transform: scaleX(1);
  }
}
</style>
