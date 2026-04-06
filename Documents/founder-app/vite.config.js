import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

if (!process.env.VITE_LAUNCH_DATE) {
  throw new Error('Missing VITE_LAUNCH_DATE — set it in .env.local or the Vercel dashboard')
}
if (!process.env.VITE_PRODUCT_URL) {
  throw new Error('Missing VITE_PRODUCT_URL — set it in .env.local or the Vercel dashboard')
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
