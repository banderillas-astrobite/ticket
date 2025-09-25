import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ticket/', // <- IMPORTANTE para que GitHub Pages encuentre los archivos correctamente
  server: {
    port: 5173, // puedes cambiar el puerto si quieres
    open: true, // abre el navegador automáticamente al correr npm run dev
  },
  build: {
    outDir: 'dist', // carpeta de salida para producción
    sourcemap: true, // opcional: ayuda a depurar en producción
  },
})
