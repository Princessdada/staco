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
    <!-- floating leaves from original template -->
    <svg width="39" height="45" viewBox="0 0 39 45" fill="none" class="pointer-events-none absolute right-[30%] top-[20%] hidden text-accent lg:block" aria-hidden="true">
      <path d="M4.35993 8.12197C-0.593748 13.8731 -1.08911 28.1803 2.52242 35.9656C7.8417 47.1326 27.7987 47.1679 33.3327 36.604C37.5794 28.3821 36.4727 17.5359 38.6821 0.572389C22.3362 3.68367 9.16665 2.37763 4.35993 8.12197Z" fill="currentColor" fill-opacity="0.3"/>
    </svg>
    <svg width="52" height="41" viewBox="0 0 52 41" fill="none" class="pointer-events-none absolute left-[44%] top-[35%] hidden text-accent lg:block" aria-hidden="true">
      <path d="M18.6144 0.0465448C13.3054 -0.784969 1.64645 9.71291 0.397269 16.469C-1.99699 29.5653 6.64316 41.5183 20.5923 40.8947C28.816 40.4789 36.6234 31.2283 51.9258 21.2502C36.4152 10.7523 28.0873 1.81351 18.6144 0.0465448Z" fill="currentColor" fill-opacity="0.3"/>
    </svg>
    <svg width="46" height="36" viewBox="0 0 46 36" fill="none" class="pointer-events-none absolute left-[45%] bottom-[18%] hidden text-accent lg:block" aria-hidden="true">
      <path d="M11.4394 3.70549C-0.531861 10.5655 -4.38354 21.3752 6.75495 35.7188C18.3098 31.2494 30.3852 26.5721 46 20.5437C36.3188 2.66613 26.3254 -5.0254 11.4394 3.70549Z" fill="currentColor" fill-opacity="0.3"/>
    </svg>
    <svg width="43" height="42" viewBox="0 0 43 42" fill="none" class="pointer-events-none absolute right-[40%] top-[56%] hidden text-accent lg:block" aria-hidden="true">
      <path d="M11.8398 0C-0.443787 11.5373 -4.19132 22.8667 5.48979 33.5724C16.7324 45.9412 29.0159 42.8229 42.2364 27.4399C30.6815 17.046 21.5209 8.73089 11.8398 0Z" fill="currentColor" fill-opacity="0.3"/>
    </svg>
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" class="pointer-events-none absolute left-[25%] bottom-[13%] hidden text-accent lg:block" aria-hidden="true">
      <path d="M2.87043 11.9367C9.11631 10.5855 15.5704 9.1303 21.8163 7.77909C21.3999 5.28455 21.0876 2.89395 20.6712 0.399414C14.0089 1.02305 7.34665 1.64669 0.892578 2.27032C1.51717 5.59638 2.24584 8.71455 2.87043 11.9367Z" fill="currentColor" fill-opacity="0.3"/>
    </svg>
    <svg width="49" height="47" viewBox="0 0 49 47" fill="none" class="pointer-events-none absolute left-[25%] top-[18%] hidden text-accent lg:block" aria-hidden="true">
      <path d="M8.82762 7.31652C-2.25929 15.2616 -1.57861 29.3022 8.24752 39.1752C17.8521 48.9776 31.6961 50.2641 39.7268 38.9026C45.4458 31.1026 44.49 18.684 48.0973 0.246201C29.4497 3.29007 16.6336 1.84265 8.82762 7.31652Z" fill="currentColor" fill-opacity="0.3"/>
    </svg>

    <!-- container for decorative ribbon matching exact original bezier curve -->
    <div class="pointer-events-none absolute inset-0 z-0 mx-auto hidden h-full w-full max-w-[1213px] px-4 sm:px-6 lg:block">
      <svg
        viewBox="0 0 1140 800"
        fill="none"
        class="h-full w-full text-[#B2EDA1]"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 839.53 -31.11 C 965.27 209.06, 783.09 286.48, 683.30 283.32 C 583.52 280.16, 617.38 151.41, 691.02 239.92 C 965.31 641.32, 533.64 792.36, 533.64 792.36"
          stroke="currentColor"
          stroke-width="9.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <div class="relative z-10 mx-auto grid w-full max-w-[1213px] items-center gap-12 px-4 lg:items-start sm:px-6 lg:grid-cols-[1.42fr_1fr] lg:gap-10">
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
        <div class="relative overflow-hidden rounded-[28px] shadow-2xl">
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
