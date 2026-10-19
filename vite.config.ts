import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import siteMapPlugin from './vite/siteMapPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteMapPlugin()],
  base: '/JT_reboot/',
})
