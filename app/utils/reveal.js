/**
 * v-reveal — RISE an element into place, matching the original page.
 * All motion is vertical: content starts lower and travels up.
 *
 * Why this is not a CSS class toggle any more
 * ------------------------------------------
 * It used to add `.reveal` (offset) on mount, then `.is-in` (settled) two
 * frames later, and let a CSS transition do the work. On a slow hydration both
 * class writes land inside a single paint, so the browser never renders the
 * offset state, the transition has nothing to interpolate FROM, and the
 * element simply appears settled. Measured on the hero: the image's `top` was
 * identical on every frame from 97ms to 1612ms — the animation never ran once.
 *
 * Two changes fix it:
 *
 *  1. getSSRProps puts the offset into the SERVER-RENDERED markup, so the very
 *     first paint already has the element sitting low — no flash of settled
 *     content while Nuxt hydrates.
 *  2. The animation is a Web Animations API call rather than a CSS transition.
 *     WAAPI interpolates from the keyframes it is handed, so it does not care
 *     whether the start state was ever painted.
 */

const DISTANCE = 64                              // px travelled
const DURATION = 900                             // ms
const EASE = 'cubic-bezier(.22, .61, .36, 1)'

function play(el, delay = 0, fade = true) {
  // drop the server-rendered offset — the animation owns the element now
  el.style.transform = ''
  el.style.willChange = fade ? 'transform, opacity' : 'transform'

  const from = { transform: `translateY(${DISTANCE}px)` }
  const to = { transform: 'translateY(0)' }
  if (fade) {
    from.opacity = 0
    to.opacity = 1
  }

  const anim = el.animate([from, to], {
    duration: DURATION, delay, easing: EASE, fill: 'backwards',
  })
  // 'backwards' holds the low state through the delay, so a staggered element
  // waits down there rather than sitting settled until its turn
  anim.finished.then(() => { el.style.willChange = '' }).catch(() => {})
}

export const vReveal = {
  // Runs on the server: the offset ships in the HTML.
  //
  // Deliberately transform-only, with NO opacity. An element at opacity 0 has
  // not "painted" as far as the browser is concerned, so fading the hero in
  // would push Largest Contentful Paint out to whenever hydration finishes and
  // cost real Lighthouse points. Shipped low but visible, the hero counts as
  // painted from the first frame and still rises once JS arrives. Sections
  // below the fold DO fade — see mounted() — because LCP has happened by then.
  getSSRProps() {
    return {
      'data-reveal': '',
      style: { transform: `translateY(${DISTANCE}px)` },
    }
  },

  mounted(el, binding) {
    const delay = binding.value?.delay ?? 0

    if (typeof IntersectionObserver === 'undefined') {
      el.style.transform = ''
      return
    }

    // Already on screen at load — the hero. Rise immediately, no fade.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      play(el, delay, false)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        play(el, delay, true)
        io.disconnect()
      },
      // The large top margin makes anything ABOVE the viewport count as
      // intersecting, so a fast scroll or an anchor jump that skips a section
      // still reveals it instead of leaving it stranded up-page.
      { threshold: 0.15, rootMargin: '2000px 0px -12% 0px' },
    )
    io.observe(el)
    el._revealObserver = io
  },

  unmounted(el) {
    el._revealObserver?.disconnect()
  },
}
