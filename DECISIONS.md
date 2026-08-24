# DECISIONS

## The sliding indicator

Both pills are driven by one `measure(i)` that reads a tab's `offsetLeft` and `offsetWidth`, applied as `translateX` and `width` on absolutely-positioned spans with CSS transitions. The active pill slides to track the selected tab, while the hover pill has two states: at rest it spans the full width of the tab run (a visual "track"), and on pointer-over it shrinks to just the hovered tab, then grows back on leave. This one-element, two-geometry approach creates the illusion of a single pill resizing, matching the Framer Motion shared layout on the original. Nothing is hardcoded: a `ResizeObserver`, a deep watcher on the `tabs` prop (needed because the watch uses a getter), and `document.fonts.ready` all re-measure, so adding a tab or lengthening a label only updates what `measure()` returns. The hover pill is gated behind `@media (hover: hover)` so it doesn't stick on touchscreens; on keyboard, `@focus` reuses the hover pill as the focus indicator.

I chose plain CSS transitions over a motion library — only two numbers animate on two elements, the browser compositor handles `transform` efficiently, and this kept dependencies at zero.

## Navigation on mobile

Below `lg` (1024px) the header wraps: the logo and **Start Free** stay on line one, and the tab bar drops to its own full-width line that scrolls horizontally, with the selected tab scrolled into view when it changes.

I switched at `lg` rather than `sm` because between 640px and 1024px a single row squeezes the bar until labels clip — worse than wrapping. I rejected a hamburger menu: it would hide the animated indicator entirely, which is the part being assessed. Verified no horizontal page overflow at 360, 640, 1024 and 1440px.

## What I could not match exactly

- **The typeface.** The template uses a commercial font I can't identify from a rendered page. Measuring `"Made"`, its width-to-cap-height ratio is 3.46 against Plus Jakarta Sans's 4.19 — about 17% narrower per unit of height. I matched the *metrics* instead of the letterforms: type sizes are set so measured line widths match the original (e.g. the Why-choose-us heading is 36px because the original's `"Manage team increase"` measures 437px). Line breaks in long body copy therefore differ slightly.
- **Photography.** The template's stock photos are licensed to its owner and are not sub-licensable, so I sourced free-licence equivalents instead. Each is cropped to the aspect ratio its slot actually renders at and re-encoded to WebP — all eight come to 309 KB combined, against 22 MB of originals. The Why-choose-us crops are centred on the subject because those panels flex between `flexGrow: 3` and `flexGrow: 1`, so each frame has to survive being squeezed to a narrow strip.
- **The hero video.** The original autoplays a muted loop; I used a still with a working play/pause control. An autoplaying video would cost real mobile Lighthouse points for no assessed benefit.
- **Partner logos.** Rendered as text wordmarks rather than the actual brand marks.
- **Omitted per the brief:** the blog posts, the 200/156K/23K stats block, and the BENEFITS "Most useful features" block.

## Lighthouse (mobile)

TODO: Run Lighthouse against the deployed Netlify URL (Chrome DevTools → Lighthouse → Mobile → Analyse page load) and save the screenshot here.

## Where I used AI

<!-- REWRITE THIS IN YOUR OWN WORDS BEFORE SUBMITTING.
     It must be an accurate account of how you actually worked, and you have to
     be able to defend every line of it in the live session. The notes below are
     a truthful starting point, not a script. -->

**Tool:** Claude (Anthropic), used throughout the build.

**What I asked it for:** project scaffolding and initial setup (Nuxt 4 + Tailwind 4); building page sections from the reference screenshots; implementing the TabBar component with the dual-pill indicator pattern; diagnosing and fixing Netlify build failures; and clarifying Vue 3 reactivity semantics.

**Where I rejected or rewrote its output:**

- Its first footer implementation pinned the disclaimer with `position: fixed`, which floated it mid-viewport with a dead gap above. I replaced that with `sticky bottom-0`, which keeps the element in flow so it settles at the actual bottom and needs no spacer.
- Its first CTA band drew the white stripes as parallel diagonal bars beside the arrows. On the original they form a single perspective road — each stripe is the arrow's stem projected from a shared vanishing point. Solving for that point from both outer lanes gave the same scale factor (~1.62), confirming one true perspective rather than five independent bars.
- It suggested UI that isn't in the original — pagination dots and a green progress bar under the Why-choose-us images. I had both removed; the original's only indicator is the white timer pill inside the active image.
- On `{ deep: true }` for `watch()`: it initially suggested it was redundant when watching a reactive object directly (which is true — Vue 3 watches reactive objects deeply by default). I verified this against the Vue 3 docs, but clarified that when watching via a getter (as in TabBar with `watch(() => props.tabs, ...)`), `{ deep: true }` is necessary to detect mutations in nested objects. The code is correct as written.

## Not done

- The third Why-choose-us slide still carries placeholder copy (marked `TODO` in `WhyChooseUs.vue`).
