import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite-Konfiguration für das Kulturforum Kalender Projekt
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy für API-Aufrufe an den Backend-Server
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}) 