import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ]
})

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward any request starting with these prefixes to Django.
      // Add more entries here as you add more Django-backed routes.
      "/company": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
 