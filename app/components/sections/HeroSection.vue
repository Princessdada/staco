<script setup>
const playing = ref(true)

/**
 * Rotating headline word.
 *
 * The green bar under the word starts as a short stub at the word's left edge
 * and grows to the word's full width. The moment it reaches the end, the word
 * swaps and the bar snaps back. The bar's target width is MEASURED from the
 * rendered word, so words of different lengths all work without hardcoding.
 *
 * Order matches the original: Easier -> Accountable -> Unbeatable, looping.
 */
const words = ['Easier', 'Accountable', 'Unbeatable']

const SEED_W = 34    // px — the stub width at the start of each cycle
const GROW_MS = 2400 // how long the bar takes to cross the word

const wordIndex = ref(0)
const currentWord = computed(() => words[wordIndex.value])

const wordEl = ref(null)
const barWidth = ref(SEED_W)
const growing = ref(false)   // gates the CSS transition, so the snap-back is instant
const reducedMotion = ref(false)

let watchdog = null
let cycle = 0                // guards against the watchdog double-firing
let mq = null
let disposed = false

// Grow the bar from the stub to the measured width of the word currently
// rendered. No timer decides when it is done — the transition itself does.
function startGrow() {
  if (disposed || reducedMotion.value) return
  const id = ++cycle

  growing.value = false
  barWidth.value = SEED_W

  // two frames so the reset paints before the growth starts; without this the
  // browser coalesces both writes and the transition is skipped entirely
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (disposed || id !== cycle) return
    growing.value = true
    barWidth.value = wordEl.value?.offsetWidth ?? SEED_W
  }))

  // safety net: transitionend does not fire in a backgrounded tab
  clearTimeout(watchdog)
  watchdog = setTimeout(() => { if (id === cycle) advance() }, GROW_MS + 900)
}

// Called the instant the bar finishes crossing the word — no hold, no gap.
async function advance() {
  if (disposed || reducedMotion.value) return
  clearTimeout(watchdog)
  wordIndex.value = (wordIndex.value + 1) % words.length
  await nextTick()   // the new word must be in the DOM before it is measured
  startGrow()
}

function onBarEnd(e) {
  if (e.propertyName === 'width') advance()
}

function onMotionChange(e) {
  reducedMotion.value = e.matches
  if (e.matches) {
    cycle++
    clearTimeout(watchdog)
    growing.value = false
    barWidth.value = SEED_W
  } else {
    startGrow()
  }
}

onMounted(async () => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mq.matches
  mq.addEventListener('change', onMotionChange)
  // reduced motion: the word stays put and the bar stays a stub. No cycling.
  if (!reducedMotion.value) { await nextTick(); startGrow() }
})

onUnmounted(() => {
  disposed = true
  clearTimeout(watchdog)
  mq?.removeEventListener('change', onMotionChange)
})

const barStyle = computed(() => ({
  width: `${barWidth.value}px`,
  transition: growing.value && !reducedMotion.value
    ? `width ${GROW_MS}ms linear`
    : 'none',
}))
</script>

<template>
  <!--
    Vertical rhythm measured off the original at a 1440px viewport:
      nav pill bottom .... 93px      H1 cap top ......... 266px  (gap 173)
      H1 line spacing .... 87px      H1 -> subcopy ...... 85px
      subcopy -> buttons . 54px      button height ...... 60px
  -->
  <section class="relative overflow-hidden bg-ink pt-[150px] pb-20 sm:pt-[190px] lg:pt-[243px] lg:pb-[140px]">
    <!-- decorative swoosh + leaves, purely ornamental -->
    <svg
      class="pointer-events-none absolute -top-10 right-0 hidden h-[130%] w-[62%] text-accent lg:block"
      viewBox="0 0 600 900" fill="none" aria-hidden="true"
    >
      <path
        d="M470 -40C470 160 300 150 250 250c-50 100 120 130 190 235 70 105-70 200-140 300-40 57-60 120-60 175"
        stroke="currentColor" stroke-width="7" stroke-linecap="round"
      />
    </svg>
    <span class="pointer-events-none absolute left-[26%] top-[24%] hidden h-14 w-14 rounded-tl-[999px] rounded-br-[999px] rounded-tr-[999px] bg-white/8 lg:block" aria-hidden="true" />
    <span class="pointer-events-none absolute left-[46%] top-[44%] hidden h-10 w-16 rounded-full bg-white/8 lg:block" aria-hidden="true" />
    <span class="pointer-events-none absolute left-[46%] bottom-[12%] hidden h-8 w-10 rounded-t-full bg-white/8 lg:block" aria-hidden="true" />

    <div class="relative mx-auto grid w-full max-w-[1213px] items-center gap-12 px-4 lg:items-start sm:px-6 lg:grid-cols-[1.42fr_1fr] lg:gap-10">
      <div v-reveal>
        <h1 class="text-[38px] font-extrabold leading-[1.2] tracking-[-0.02em] text-white sm:text-[46px] sm:leading-[1.3] lg:text-[52px] lg:leading-[1.62]">
          <span class="lg:whitespace-nowrap">Financial Security</span><br />
          Made
          <span class="relative inline-block whitespace-nowrap text-accent">
            <!-- aria-live so a screen reader announces the word when it changes -->
            <span ref="wordEl" class="inline-block" aria-live="polite">{{ currentWord }}</span>
            <span
              class="absolute -bottom-2 left-0 block h-1.5 rounded-sm bg-accent"
              aria-hidden="true"
              :style="barStyle"
              @transitionend="onBarEnd"
            />
          </span>
        </h1>

        <p class="mt-10 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl lg:mt-14">
          Staco is the dedicated platform for human management that helps to grow
          your startup business quickly
        </p>

        <div class="mt-10 flex flex-wrap items-center gap-6 sm:gap-8 lg:mt-12">
          <a
            href="#"
            class="rounded-full bg-brand px-9 py-5 text-base font-bold text-white transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
          >Get Start For Free</a>

          <a
            href="#"
            class="group inline-flex items-center gap-3 rounded-full py-2 text-base font-semibold text-white transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint"
          >
            Let's talk
            <!-- solid disc + chevron, not an outlined ring + full arrow -->
            <span class="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-accent group-hover:text-ink group-hover:ring-2 group-hover:ring-accent">
              <svg
                viewBox="0 0 24 24" class="h-5 w-5 transition-transform duration-300 group-hover:-rotate-45"
                fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"
              >
                <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      <div v-reveal="{ delay: 120 }" class="relative min-w-0">
        <div class="relative overflow-hidden rounded-[28px] rounded-tl-[72px] shadow-2xl">
          <img
            src="/img/hero-still.webp"
            alt="A Staco team gathered around a laptop in an open-plan office"
            width="1200" height="850" class="h-full w-full object-cover"
            fetchpriority="high" decoding="async"
          />
          <button
            type="button"
            class="absolute bottom-6 right-6 grid h-16 w-16 place-items-center rounded-full bg-white text-brand shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            :aria-label="playing ? 'Pause video' : 'Play video'"
            @click="playing = !playing"
          >
            <svg v-if="playing" viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1.3" /><rect x="14" y="5" width="4" height="14" rx="1.3" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
