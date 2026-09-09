import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
  },
  server: {
    proxy: {
      // During development, /api/* requests are proxied to the Express server
      // so you don't need to set CORS headers or use the full URL in fetch calls
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})

