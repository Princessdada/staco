# DECISIONS

## The sliding indicator

Both pills are driven by one `measure(i)` that returns a tab's `offsetLeft` and `offsetWidth`; those become `translateX` and `width` on absolutely-positioned spans, and a CSS transition on both properties does the movement. The active pill tracks the selected tab, while the hover pill rests at the full width of the tab run and shrinks to whichever tab the pointer is over — one element with two geometries, so it reads as a single pill resizing rather than two things fading in and out. Nothing is hardcoded: a `ResizeObserver`, a deep watcher on the `tabs` prop and `document.fonts.ready` all re-measure, so adding a tab or lengthening a label only changes what `measure()` returns.

I used plain CSS transitions rather than a motion library. The only thing being animated is two numbers on two elements, the browser compositor handles `transform` well, and it kept the dependency count at zero.

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

<!-- Run against the DEPLOYED URL, not localhost:
     Chrome DevTools -> Lighthouse -> Mobile -> Analyse page load.
     Save the screenshot into the repo and reference it here. -->

![Lighthouse mobile](./lighthouse-mobile.png)

## Where I used AI

<!-- REWRITE THIS IN YOUR OWN WORDS BEFORE SUBMITTING.
     It must be an accurate account of how you actually worked, and you have to
     be able to defend every line of it in the live session. The notes below are
     a truthful starting point, not a script. -->

**Tool:** Claude (Anthropic), used throughout.

**What I asked it for:** scaffolding the Nuxt 4 + Tailwind 4 project; building the page sections from screenshots of the original; and reviewing my tab bar implementation.

**Where I rejected or rewrote its output:**

- It told me `{ deep: true }` was *required* for `watch()` on a `reactive` object. I checked the Vue 3 docs: watching a reactive object is already deep by default, so the option is redundant. `deep` only matters for a ref holding an object, or a getter.
- Its first footer implementation pinned the disclaimer with `position: fixed`, which left it floating mid-viewport with a dead gap above it. I rejected that and had it rebuilt with `sticky bottom-0`, which keeps the element in normal flow so it settles at the bottom of the document, and needs no spacer or height measurement.
- Its first version of the CTA band drew the white stripes as parallel diagonal bars beside the arrows. On the original they are a single perspective road: each stripe is the arrow's own stem projected from a shared vanishing point. Solving for that point from both outer lanes gave the same scale factor (~1.62), confirming one true perspective rather than five independent diagonals.
- It invented UI that isn't in the original — pagination dots and a green progress bar under the Why-choose-us images. I had both removed; the original's only indicator is the white timer pill inside the active image.

## Not done

- The third Why-choose-us slide still carries placeholder copy (marked `TODO` in `WhyChooseUs.vue`).
