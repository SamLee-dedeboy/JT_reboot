import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import criteriaCopyPlugin from './vite/criteriaCopyPlugin'
import siteMapPlugin from './vite/siteMapPlugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteMapPlugin(), criteriaCopyPlugin()],
  base: '/JT_reboot/',
})
