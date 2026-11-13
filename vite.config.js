import { defineConfig } from 'vite'
import { readdirSync } from 'fs'
import { resolve } from 'path'

// Find every .html file in the project root
const pages = Object.fromEntries(
  readdirSync('.')
    .filter((file) => file.endsWith('.html'))
    .map((file) => [file.replace('.html', ''), resolve(file)])
)

export default defineConfig({
  build: {
    rollupOptions: {
      input: pages,
    },
  },
})