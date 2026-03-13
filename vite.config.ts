import UnoCSS from 'unocss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
// import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    UnoCSS(),
    // Inspect(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
})
