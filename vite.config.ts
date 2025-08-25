import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// Configuración Vite sin dependencias de Node para resolver alias

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    host: '0.0.0.0',
    port: 5173,
  },
  resolve: {
    alias: {
      // Vite interpreta rutas que empiezan con '/' relativas a la raíz del proyecto
      "@": "/src",
    },
  },
})
