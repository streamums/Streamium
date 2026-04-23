import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  define: {
    "import.meta.env.VITE_TMDB_API_KEY": JSON.stringify(
      process.env.VITE_TMDB_API_KEY || process.env.TMDB_API_KEY || ""
    ),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
  },
});
