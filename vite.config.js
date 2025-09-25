import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // 🔑 Rutas relativas para GitHub Pages
  plugins: [react()]
})
