import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',               // ensure root is the repo root where index.html lives
  plugins: [react()],
  build: {
    outDir: 'dist',        // Vercel expects this (already configured)
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
})

