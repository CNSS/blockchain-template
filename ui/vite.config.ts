import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  build: {
    sourcemap: false
  },
  server: {
    proxy: {
      '/api': 'http://localhost:53000/'
    }
  }
})
