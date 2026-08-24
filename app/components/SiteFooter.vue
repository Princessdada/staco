<script setup>
const columns = [
  { title: 'Products', emoji: '🔥', links: ['HR Management', 'Invoice System', 'Email Marketing', 'Web Services', 'Digital Marketing'] },
  { title: 'Why choose', emoji: '🌟', links: ['Customers', 'Why Staco ?', 'Book a demo'] },
  { title: 'Resources', emoji: '✨', links: ['Latest Blog', 'Supports', 'Knowledgebase', 'FAQs'] },
  { title: 'Company', emoji: '💎', links: ['About', 'What we do', 'Contact us', 'Careers'] },
]

const socials = [
  { name: 'Facebook', path: 'M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6A22 22 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.1v2.3H7.6V13h2.7v8z' },
  { name: 'X', path: 'M17.5 3h3l-6.6 7.5L21.8 21h-6l-4.7-6-5.4 6H2.6l7-8L2.3 3h6.2l4.2 5.6zm-1 16h1.7L8.6 4.8H6.8z' },
  { name: 'LinkedIn', path: 'M6.9 8.7V20H3.6V8.7zM5.2 3.6a1.9 1.9 0 1 1 0 3.9 1.9 1.9 0 0 1 0-3.9M20.4 20h-3.3v-5.6c0-1.4-.5-2.3-1.7-2.3-.9 0-1.5.6-1.7 1.3-.1.2-.1.6-.1.9V20H10.3s.05-9.5 0-10.5h3.3v1.5a3.3 3.3 0 0 1 3-1.6c2.2 0 3.8 1.4 3.8 4.5z' },
  { name: 'Instagram', path: 'M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2m0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6M16.9 6a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2M12 4.4c2.5 0 2.8 0 3.8.06 2.5.11 3.7 1.33 3.8 3.8.05 1 .06 1.3.06 3.75s0 2.75-.06 3.75c-.11 2.46-1.3 3.69-3.8 3.8-1 .05-1.3.06-3.8.06s-2.8 0-3.8-.06c-2.5-.12-3.69-1.35-3.8-3.8C4.4 14.76 4.4 14.46 4.4 12s0-2.75.06-3.75c.11-2.47 1.3-3.69 3.8-3.8C9.2 4.4 9.5 4.4 12 4.4' },
  { name: 'YouTube', path: 'M21.6 8.1a2.5 2.5 0 0 0-1.75-1.77C18.3 6 12 6 12 6s-6.3 0-7.85.33A2.5 2.5 0 0 0 2.4 8.1 26 26 0 0 0 2.07 12a26 26 0 0 0 .33 3.9 2.5 2.5 0 0 0 1.75 1.77C5.7 18 12 18 12 18s6.3 0 7.85-.33a2.5 2.5 0 0 0 1.75-1.77A26 26 0 0 0 21.93 12a26 26 0 0 0-.33-3.9M10 14.9V9.1l5.2 2.9z' },
]

</script>

<template>
  <!--
    The card sits ON TOP of the disclaimer. The disclaimer is `sticky bottom-0`,
    so while you scroll through the footer it is held against the bottom of the
    viewport BEHIND the opaque card layer; as the card travels up it uncovers
    the text, and at the end of the page the disclaimer un-sticks and settles at
    its natural place — the bottom of the document.

    Sticky keeps it in normal flow, so no spacer and no height measuring, and
    with no JS it degrades to a plain block of text.
  -->
  <footer class="bg-mist">
    <div class="relative z-10 bg-mist pb-14">
    <div class="mx-auto w-full max-w-[1213px] px-4 sm:px-6">
      <div class="rounded-[32px] bg-ink px-6 pt-14 sm:px-10 sm:pt-20 lg:px-16">
        <!-- brand block full-width, then link columns 2-up from sm; single-file
             stacking made the footer needlessly long on tablets -->
        <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_repeat(4,0.95fr)] lg:gap-6">
          <div class="sm:col-span-2 lg:col-span-1">
            <SiteLogo tone="light" />
            <p class="mt-8 max-w-xs text-lg leading-relaxed text-white/65">
              Staco is the dedicated platform for performance management that helps
              to grow your startup quickly
            </p>

            <ul class="mt-10 flex gap-3">
              <li v-for="s in socials" :key="s.name">
                <a
                  href="#" :aria-label="s.name"
                  class="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 text-white transition hover:border-mint hover:text-mint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
                >
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" aria-hidden="true"><path :d="s.path" /></svg>
                </a>
              </li>
            </ul>
          </div>

          <nav v-for="col in columns" :key="col.title" :aria-label="col.title">
            <h2 class="whitespace-nowrap text-sm font-extrabold uppercase tracking-wide text-white">
              {{ col.title }} <span aria-hidden="true">{{ col.emoji }}</span>
            </h2>
            <ul class="mt-7 space-y-4">
              <li v-for="link in col.links" :key="link">
                <a href="#" class="rounded text-base text-white/65 lg:whitespace-nowrap transition hover:text-mint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint">{{ link }}</a>
              </li>
            </ul>
          </nav>
        </div>

        <div class="mt-16 flex flex-col gap-6 border-t border-white/10 py-8 text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-base">2023 Staco. All rights reserved.</p>
          <ul class="flex flex-wrap gap-x-10 gap-y-3 text-base">
            <li v-for="l in ['Terms and conditions', 'Cookies', 'Privacy policy']" :key="l">
              <a href="#" class="rounded transition hover:text-mint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint">{{ l }}</a>
            </li>
          </ul>
        </div>
      </div>

    </div>
    </div>

    <div class="sticky bottom-0 z-0 bg-mist">
      <div class="mx-auto w-full max-w-[1213px] px-4 py-14 text-body sm:px-6">
        <h2 class="text-[17px] font-bold text-heading">Disclaimer:</h2>
        <p class="mt-5 text-[16px] leading-[30px]">
          There are many variations of passages of Lorem Ipsum available, but the majority have
          suffered alteration in some form, by injected humour, or randomised words which don't look
          even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be
          sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum
          generators on the Internet tend to repeat predefined chunks as necessary.
        </p>
        <p class="mt-5 text-[16px] leading-[30px]">
          Making this the first true generator on the Internet. It uses a dictionary of over 200 Latin
          words, combined handful of model sentence structures, to generate which looks reasonable.
          The generated Lorem Ipsum is therefore always
        </p>
      </div>
    </div>
  </footer>
</template>
