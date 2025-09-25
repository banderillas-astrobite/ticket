import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ticket/', // ¡El nombre de la subcarpeta donde se aloja tu sitio!
  plugins: [react()]
})
