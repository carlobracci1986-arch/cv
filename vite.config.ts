import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  base: '/',
  plugins: [react(), {
    name: 'copy-pdf-worker',
    generateBundle() {
      // Copy PDF.js worker to public directory on build
      const workerSrc = path.resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
      const workerDest = path.resolve(__dirname, 'public/pdf.worker.min.js');

      try {
        fs.copyFileSync(workerSrc, workerDest);
      } catch (err) {
        console.warn('Could not copy PDF.js worker:', err);
      }
    }
  }],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
        headers: {
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['jspdf', 'html2canvas'],
  },
})
