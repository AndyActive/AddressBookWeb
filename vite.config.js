import { fileURLToPath } from 'url'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000, // Явное указание порта для фронтенда
    proxy: {
      '/contacts': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  // Настройки для production
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  preview: {
    port: 3000, // Порт для preview режима
  }
})