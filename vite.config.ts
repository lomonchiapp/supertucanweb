import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// Configuración Vite sin dependencias de Node para resolver alias

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // SPA fallback: all routes serve index.html (needed for /admin, /modelos/:slug, etc.)
  appType: 'spa',
})
