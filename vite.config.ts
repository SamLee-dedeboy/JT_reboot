import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Tailwind is temporary: it only serves the co-design dashboard while it is
  // migrated from Svelte (see src/features/co-design/styles/tailwind.css).
  plugins: [react(), tailwindcss()],
  base: '/JT_reboot/',
})
