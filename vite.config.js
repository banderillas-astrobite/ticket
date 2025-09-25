import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ticket/',  // Esto es muy importante para GitHub Pages
  plugins: [react()],
});
