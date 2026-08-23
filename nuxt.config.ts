// Polyfill ECMAScript 2024 Set methods for environments running on older Node versions
if (typeof Set.prototype.difference !== 'function') {
  Set.prototype.difference = function (other) {
    const result = new Set(this)
    for (const item of other) {
      result.delete(item)
    }
    return result
  }
}
if (typeof Set.prototype.intersection !== 'function') {
  Set.prototype.intersection = function (other) {
    const result = new Set()
    for (const item of other) {
      if (this.has(item)) result.add(item)
    }
    return result
  }
}
if (typeof Set.prototype.union !== 'function') {
  Set.prototype.union = function (other) {
    const result = new Set(this)
    for (const item of other) {
      result.add(item)
    }
    return result
  }
}

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
