import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ViteBiomePlugin',
      fileName: 'index',
      formats: ['es']
    },
    outDir: 'es',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: ['vite', 'child_process', 'fs', 'path', 'url', 'node:path'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        format: 'es',
        exports: 'named'
      }
    },
    target: 'node18',
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})