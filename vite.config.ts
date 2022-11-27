//import { defineConfig } from 'vite'
//import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
/* export default defineConfig({
  plugins: [react()]
}) */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: process.cwd(),
  plugins: [react()],
  build: {
    outDir: "./build"
  },
  server: {
    host: '0.0.0.0'
  }
})

