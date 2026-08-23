/**
 * v-reveal — fade + RISE a section into place, matching the original page.
 * All motion is vertical: content starts 40px lower and moves up.
 *
 *  - Server renders the markup with no `reveal` class, so the HTML is fully
 *    visible without JS (crawlers, Lighthouse).
 *  - Elements already on screen at load (the hero) rise on page load.
 *  - Elements further down rise as they are scrolled to.
 *  - The tab bar handles reduced motion itself, per the brief; these section
 *    reveals animate unconditionally, as the original site does.
 */
export const vReveal = {
  mounted(el, binding) {
    if (typeof IntersectionObserver === 'undefined') return

    el.classList.add('reveal')
    if (binding.value?.delay) el.style.transitionDelay = `${binding.value.delay}ms`

    // Already in the viewport at load — the hero and anything above the fold.
    // Rise into place immediately rather than appearing pre-settled. Two
    // frames so the offset state paints first; without them the browser
    // coalesces both writes and no animation runs.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')))
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-in')
        io.disconnect()
      },
      // The huge top margin makes anything ABOVE the viewport count as
      // intersecting, so a fast scroll or anchor jump that skips past a
      // section still reveals it instead of staying invisible up-page.
      { threshold: 0.15, rootMargin: '2000px 0px -12% 0px' },
    )
    io.observe(el)
    el._revealObserver = io
  },

  unmounted(el) {
    el._revealObserver?.disconnect()
  },
}
