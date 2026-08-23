<script setup>
/**
 * TabBar — animated tab bar with TWO sliding indicators.
 *
 *   ACTIVE pill  light, dark text, always visible, slides on selection
 *   HOVER  pill  darker, slightly inset. It is never hidden: at rest it spans
 *                the whole run of tabs, and on hover it SHRINKS to the hovered
 *                tab, then grows back on leave. One element, two geometries —
 *                the original does this with a Framer Motion shared layout.
 *
 * Both pills are driven by the same measure(): offsetLeft/offsetWidth of a
 * tab button, applied as translateX + width. Nothing is hardcoded, so the
 * bar survives tabs being added, removed, or relabelled.
 *
 * NOTE: the container must not have a real border (rings only) — a border
 * would shift the absolute pills' origin relative to offsetLeft.
 */

const props = defineProps({
  tabs: { type: Array, required: true },        // [{ id: string, label: string }]
  modelValue: { type: String, required: true }, // active tab id
  // 'light' = sitting on the dark hero bar, 'dark' = on the white stuck bar
  tone: { type: String, default: 'light' },
  // accessible name for the tablist; passed as a prop rather than a fallthrough
  // attribute so it cannot silently collide with the one in the template
  label: { type: String, default: 'Sections' },
})
const emit = defineEmits(['update:modelValue'])

// --- element references -----------------------------------------------------
const listEl = ref(null)
const tabEls = []          // plain array, filled by the :ref function below

// --- geometry ---------------------------------------------------------------
const activeBox = ref({ left: 0, width: 0, ready: false })
const hoverBox = ref({ left: 0, width: 0, ready: false })

const reducedMotion = ref(false)
const hoverCapable = ref(false)
// stays false until the first measurement has painted, so the active pill
// appears in place on load instead of sliding in from x=0
const canAnimate = ref(false)

let hoveredIndex = null
let ro = null
let mqMotion = null
let mqHover = null
let disposed = false

const EASE = 'cubic-bezier(.4, 0, .2, 1)'
const HOVER_INSET = 3 // px each side — the hover pill sits slightly inside the active one

function measure(index) {
  const el = tabEls[index]
  if (!el) return null
  return { left: el.offsetLeft, width: el.offsetWidth }
}

function activeIndex() {
  return props.tabs.findIndex(t => t.id === props.modelValue)
}

// The hover pill's resting shape: first tab's left edge to last tab's right
// edge. Derived from measure(), so it grows with the tab list like everything
// else here and never needs a hardcoded width.
function trackGeom() {
  const first = measure(0)
  const last = measure(props.tabs.length - 1)
  if (!first || !last) return null
  return { left: first.left, width: last.left + last.width - first.left }
}

function syncActive() {
  const box = measure(activeIndex())
  if (!box) {
    activeBox.value = { ...activeBox.value, ready: false }
    return
  }
  activeBox.value = { ...box, ready: true }
}

function syncHover() {
  const box = hoveredIndex === null ? trackGeom() : measure(hoveredIndex)
  if (!box) return
  hoverBox.value = { ...box, ready: true }
}

function remeasure() {
  syncActive()
  syncHover()
}

// --- when to re-measure -----------------------------------------------------
watch(() => props.modelValue, async () => {
  await nextTick()
  syncActive()
  // if the list is overflowing (small screens), keep the selection in view
  const el = tabEls[activeIndex()]
  const list = listEl.value
  if (el && list && list.scrollWidth > list.clientWidth) {
    el.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: reducedMotion.value ? 'auto' : 'smooth',
    })
  }
})

watch(() => props.tabs, async () => {
  await nextTick() // new buttons must exist before measuring
  tabEls.length = props.tabs.length
  observeAll()
  remeasure()
}, { deep: true })

function observeAll() {
  if (!ro) return
  ro.disconnect()
  if (listEl.value) ro.observe(listEl.value)
  for (const el of tabEls) el && ro.observe(el)
}

onMounted(() => {
  mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mqMotion.matches
  mqMotion.addEventListener('change', onMotionChange)

  mqHover = window.matchMedia('(hover: hover)')
  hoverCapable.value = mqHover.matches
  mqHover.addEventListener('change', onHoverChange)

  ro = new ResizeObserver(remeasure)
  observeAll()

  syncActive()
  restHover() // seed the pill at full width before the first hover

  // a webfont swap shifts every width — measure again once fonts settle
  document.fonts?.ready?.then(() => { if (!disposed) remeasure() })

  // let the first measurement paint before transitions are allowed
  requestAnimationFrame(() => requestAnimationFrame(() => { canAnimate.value = true }))
})

onUnmounted(() => {
  disposed = true
  ro?.disconnect()
  mqMotion?.removeEventListener('change', onMotionChange)
  mqHover?.removeEventListener('change', onHoverChange)
})

function onMotionChange(e) {
  reducedMotion.value = e.matches
}
function onHoverChange(e) {
  hoverCapable.value = e.matches
  if (!e.matches) restHover()
}

// --- hover ------------------------------------------------------------------
function onTabEnter(i) {
  // touchscreens: mouseenter fires on tap and would leave the pill stuck on one
  // tab, so pointer devices only. Without a pointer the pill simply stays at
  // its resting full width and reads as a track, which is the right fallback.
  if (!hoverCapable.value) return
  const box = measure(i)
  if (!box) return
  hoveredIndex = i
  hoverBox.value = { ...box, ready: true }
}

// "rest" rather than "hide": the pill grows back to the full run of tabs.
function restHover() {
  hoveredIndex = null
  const box = trackGeom()
  if (box) hoverBox.value = { ...box, ready: true }
}

function onGroupLeave() {
  restHover()
}

function onFocusOut(e) {
  if (listEl.value && !listEl.value.contains(e.relatedTarget)) restHover()
}

// --- keyboard ---------------------------------------------------------------
// Roving tabindex, manual activation: arrows/Home/End move FOCUS only,
// Enter/Space activates the focused tab.
function onKeydown(e, index) {
  const n = props.tabs.length
  let target = null
  switch (e.key) {
    case 'ArrowRight': target = (index + 1) % n; break
    case 'ArrowLeft': target = (index - 1 + n) % n; break
    case 'Home': target = 0; break
    case 'End': target = n - 1; break
    case 'Enter':
    case ' ':
      e.preventDefault()
      select(props.tabs[index].id)
      return
    default:
      return
  }
  e.preventDefault()
  tabEls[target]?.focus()
}

function select(id) {
  emit('update:modelValue', id)
}

// --- styles -----------------------------------------------------------------
const activeStyle = computed(() => ({
  transform: `translateX(${activeBox.value.left}px)`,
  width: `${activeBox.value.width}px`,
  opacity: activeBox.value.ready ? 1 : 0,
  transition: canAnimate.value && !reducedMotion.value
    ? `transform 300ms ${EASE}, width 300ms ${EASE}`
    : 'none',
}))

const hoverStyle = computed(() => ({
  transform: `translateX(${hoverBox.value.left + HOVER_INSET}px)`,
  width: `${Math.max(hoverBox.value.width - HOVER_INSET * 2, 0)}px`,
  // only hidden before the very first measurement, never during interaction
  opacity: hoverBox.value.ready ? 1 : 0,
  transition: canAnimate.value && !reducedMotion.value
    ? `transform 250ms ${EASE}, width 250ms ${EASE}`
    : 'none',
}))

function tabClass(tab) {
  const isActive = tab.id === props.modelValue
  if (props.tone === 'dark') {
    return isActive ? 'text-white' : 'text-body hover:text-heading'
  }
  return isActive ? 'text-heading' : 'text-white/70 hover:text-white'
}
</script>

<template>
  <div
    ref="listEl"
    role="tablist"
    :aria-label="label"
    class="tabbar-scroll relative inline-flex max-w-full items-center overflow-x-auto overscroll-x-contain rounded-full p-1"
    :class="tone === 'dark' ? 'bg-black/[0.04] ring-1 ring-black/5' : 'bg-ink-soft ring-1 ring-white/10'"
    @mouseleave="onGroupLeave"
    @focusout="onFocusOut"
  >
    <!-- HOVER pill — behind the active pill, slightly smaller -->
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-1.5 left-0 rounded-full"
      :class="tone === 'dark' ? 'bg-black/5' : 'bg-white/10'"
      :style="hoverStyle"
    />

    <!-- ACTIVE pill -->
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-y-1 left-0 rounded-full"
      :class="tone === 'dark'
        ? 'bg-heading shadow-sm'
        : 'bg-gradient-to-b from-white to-[#e7ecea] shadow-[0_1px_3px_rgba(0,0,0,.35)]'"
      :style="activeStyle"
    />

    <button
      v-for="(tab, i) in tabs"
      :key="tab.id"
      :ref="el => { if (el) tabEls[i] = el }"
      role="tab"
      type="button"
      :aria-selected="tab.id === modelValue"
      :tabindex="tab.id === modelValue ? 0 : -1"
      class="relative z-10 shrink-0 select-none whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-brand sm:px-5"
      :class="tabClass(tab)"
      @click="select(tab.id)"
      @keydown="onKeydown($event, i)"
      @mouseenter="onTabEnter(i)"
      @focus="onTabEnter(i)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
/* below 640px the bar scrolls horizontally; hide the scrollbar chrome */
.tabbar-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.tabbar-scroll::-webkit-scrollbar {
  display: none;
}
</style>
