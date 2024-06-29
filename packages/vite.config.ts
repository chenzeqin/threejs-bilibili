import UnoCSS from 'unocss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

console.log('vite.config.ts loaded')

export default defineConfig({
  plugins: [
    UnoCSS(),
    Inspect(),
  ],
  resolve: {
    alias: {
      '@threejs': resolve(__dirname, '../'),
    },
  },
})
