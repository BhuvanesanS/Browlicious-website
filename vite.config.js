import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'src/public',
  build: {
    outDir: 'react-dist',
    emptyOutDir: true,
    assetsDir: 'react-assets',
    rollupOptions: {
      output: {
        // Content hashes prevent browsers from reusing an older navigation bundle
        // after a new website deployment.
        entryFileNames: 'react-[name]-[hash].js',
        chunkFileNames: 'react-[name]-[hash].js',
        assetFileNames: 'react-[name]-[hash][extname]',
      },
    },
  },
})
