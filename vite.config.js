import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html
          .replace(/%VITE_GA_MEASUREMENT_ID%/g, process.env.VITE_GA_MEASUREMENT_ID || '')
          .replace(/%VITE_FEEDBACK_FORM_ID%/g, process.env.VITE_FEEDBACK_FORM_ID || '')
          .replace(/%VITE_FEEDBACK_ENTRY_ID%/g, process.env.VITE_FEEDBACK_ENTRY_ID || '')
      }
    }
  ],
  base: '/',
  build: {
    outDir: 'dist'
  }
})