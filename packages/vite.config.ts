import UnoCSS from 'unocss/vite'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

console.log('vite.config.ts loaded')

export default defineConfig({
  plugins: [
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@threejs': resolve(__dirname, '../'),
    },
  },
})
