<script setup>
const cards = [
  { key: 'tech', title: 'Used advanced technologies', body: 'I must explain to you how all this mistaken. Idea of main denouncing pleasure and praising pain was born', tint: 'bg-[#9db3a6]' },
  { key: 'design', title: 'Clean design & Typography', body: 'I must explain to you how all this mistaken. Idea of main denouncing pleasure and praising pain was born', tint: 'bg-[#a9e0b4]' },
  { key: 'support', title: 'Best customer support', body: 'I must explain to you how all this mistaken. Idea of main denouncing pleasure and praising pain was born', tint: 'bg-[#c4c2e8]' },
]
</script>

<template>
  <section class="bg-white py-16 sm:py-24" aria-label="What Staco offers">
    <!-- 1-up on phones, 2-up on tablets (third card spans the row), 3-up at lg.
         Without the sm step each card is a full-width flat band at 640-1024. -->
    <div class="mx-auto grid w-full max-w-[1213px] gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:gap-8">
      <article
        v-for="(card, i) in cards"
        :key="card.key"
        v-reveal="{ delay: i * 110 }"
        class="group flex flex-col rounded-[24px] bg-card p-8 transition-colors sm:p-9"
        :class="i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''"
      >
        <span class="grid h-14 w-14 place-items-center rounded-2xl" :class="card.tint" aria-hidden="true">
          <svg viewBox="0 0 24 24" class="h-7 w-7 text-black/65" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M6 8h9M6 12h12M6 16h7" />
          </svg>
        </span>

        <h3 class="mt-8 text-[18px] font-bold tracking-tight text-heading">{{ card.title }}</h3>
        <p class="mt-4 text-[17px] leading-[1.85] text-body">{{ card.body }}</p>

        <a
          href="#"
          class="mt-10 flex items-center justify-between rounded-full text-[17px] font-semibold text-heading transition-colors group-hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          Learn more
          <span
            class="grid h-12 w-12 place-items-center rounded-full bg-black/8 text-heading transition-all duration-300 group-hover:-translate-y-1 group-hover:-rotate-45 group-hover:bg-brand group-hover:text-white"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      </article>
    </div>
  </section>
</template>
