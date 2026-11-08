/// <reference types="vitest/config" />
/**
 * Vite configuration of the portal.
 *
 * The development server proxies `/api` to the local customer consumption API, so the browser
 * talks to a single origin and CORS does not apply. Deployed environments point `VITE_API_URL` to
 * the API address and need CORS enabled there.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
