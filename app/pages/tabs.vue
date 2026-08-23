<script setup>
/**
 * Test harness for TabBar. Not part of the deliverable page —
 * it exists so you can prove the component meets the brief.
 */
const tabs = ref([
  { id: 'projects', label: 'Projects' },
  { id: 'gallery',  label: 'Gallery'  },
  { id: 'studio',   label: 'Studio'   },
  { id: 'profile',  label: 'Profile'  },
])
const active = ref('projects')
let n = 0

function addTab() {
  n++
  tabs.value.push({ id: `extra-${n}`, label: n % 2 ? `Extra ${n}` : `A Much Longer Label ${n}` })
}
function removeTab() {
  if (tabs.value.length > 1) {
    const gone = tabs.value.pop()
    if (gone.id === active.value) active.value = tabs.value[0].id
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6 sm:p-12">
    <h1 class="mb-8 text-xl font-semibold">TabBar test harness</h1>

    <TabBar v-model="active" :tabs="tabs" />

    <p class="mt-8 text-sm text-slate-600">Active: <code>{{ active }}</code></p>

    <div class="mt-8 flex flex-wrap gap-3">
      <button class="rounded border px-3 py-1.5 text-sm" @click="addTab">Add a tab</button>
      <button class="rounded border px-3 py-1.5 text-sm" @click="removeTab">Remove last tab</button>
    </div>

    <ul class="mt-10 space-y-1 text-sm text-slate-500">
      <li>1. Click between tabs — does the indicator slide?</li>
      <li>2. Add a tab with a long label — does it still land correctly?</li>
      <li>3. Resize the window slowly — does the indicator track?</li>
      <li>4. Tab in, arrow around, press Enter — mouse-free?</li>
      <li>5. DevTools → Rendering → Emulate prefers-reduced-motion → still lands right, no animation?</li>
      <li>6. Narrow to 360px — what happens?</li>
    </ul>
  </div>
</template>
