import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/ticket/", // <-- importante para GitHub Pages
  plugins: [react()],
  build: {
    outDir: "docs",
  },
});
