import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/ancient-stories-of-bengal/",
  server: {
    port: 3006,
  }
})
