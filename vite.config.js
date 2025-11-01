import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  vue: {
    devtools: false, // disable Vue Devtools overlay
  },
  inspector: false, // disable Vite inspector
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['@vue', '@vueuse', 'vue-router']
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
