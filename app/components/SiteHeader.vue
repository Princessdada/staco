<script setup>
/**
 * The original page has a dark floating pill over the hero that turns into a
 * light bar pinned to the top once you scroll past the hero. Reproduced here.
 *
 * The nav itself is the TabBar component, per the brief.
 */
// The brief says to swap the page's navbar for the motion-tabs bar. The bar is
// the mechanism; the labels stay Staco's own navigation, since this is the site
// nav and not the demo. Adding or renaming an item here is all it takes — the
// TabBar measures whatever it is given.
const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'pages', label: 'Pages' },
  { id: 'services', label: 'Services' },
  { id: 'blogs', label: 'Blogs' },
  { id: 'contact', label: 'Contact Us' },
]
const active = ref('home')

const stuck = ref(false)   // past the hero -> light bar styling
const hidden = ref(false)  // scrolling DOWN deep in the page -> bar slides away
let lastY = 0
let onScroll

onMounted(() => {
  onScroll = () => {
    const y = window.scrollY
    stuck.value = y > 120
    // matches the original: downward scroll hides the bar, any upward
    // scroll brings it back; near the top it is always shown
    hidden.value = y > 300 && y > lastY
    lastY = y
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
    :class="[
      stuck ? 'bg-white/95 backdrop-blur' : 'bg-transparent pt-4 sm:pt-6',
      hidden ? '-translate-y-full' : 'translate-y-0',
    ]"
  >
    <!-- feathered fade under the light bar, as on the original -->
    <div
      v-if="stuck"
      class="pointer-events-none absolute inset-x-0 top-full h-6 bg-gradient-to-b from-white/95 to-transparent"
      aria-hidden="true"
    />
    <div class="mx-auto w-full max-w-[1213px] px-4 sm:px-6">
      <!--
        Below lg the row wraps: logo + Start Free stay on line one, the tab bar
        drops to its own full-width line and scrolls horizontally if it has to.
        Order is swapped back at lg so the wide layout is logo | nav | actions.
        The switch is at lg rather than sm because between 640 and 1024 a single
        row squeezes the tab bar until labels clip, which is worse than wrapping.
        See DECISIONS.md.
      -->
      <div
        class="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 transition-all duration-300 lg:flex-nowrap lg:gap-6 lg:py-0"
        :class="stuck
          ? 'rounded-none bg-transparent px-0 lg:h-[72px]'
          : 'rounded-3xl bg-ink-soft px-4 lg:h-[76px] lg:rounded-full lg:px-6'"
      >
        <SiteLogo :tone="stuck ? 'dark' : 'light'" class="order-1 shrink-0" />

        <nav class="order-3 w-full min-w-0 lg:order-2 lg:w-auto lg:flex-1" aria-label="Primary">
          <TabBar
            v-model="active"
            :tabs="tabs"
            :tone="stuck ? 'dark' : 'light'"
            label="Primary navigation"
          />
        </nav>

        <div class="order-2 ml-auto flex shrink-0 items-center gap-2 lg:order-3 lg:ml-0 lg:gap-3">
          <button
            type="button"
            class="hidden items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition xl:flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            :class="stuck ? 'border-black/15 text-heading hover:bg-black/5' : 'border-white/30 text-white hover:bg-white/10'"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
            </svg>
            EN
          </button>

          <a
            href="#"
            class="hidden rounded-full px-3 py-2 text-sm font-semibold transition xl:block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            :class="stuck ? 'text-heading hover:text-brand-dark' : 'text-white hover:text-mint'"
          >Sign in</a>

          <a
            href="#"
            class="whitespace-nowrap rounded-full bg-mint px-4 py-2.5 text-sm font-bold text-heading transition sm:px-6 sm:py-3 hover:bg-mint-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >Start Free</a>
        </div>
      </div>
    </div>
  </header>
</template>
