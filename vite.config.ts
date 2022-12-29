import { defineConfig } from 'vite'

import { fileURLToPath } from 'url'

import { envDir, projectRootPath } from './build'
import { createVitePlugin } from './build/vite'

// gzip 压缩
// import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(configEnv => ({
  root: projectRootPath,
  base: '/',
  envDir,
  plugins: createVitePlugin(configEnv),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        additionalData: '@use "./src/styles/scss/index.scss" as *;'
      }
    }
  },
  build: {
    assetsInlineLimit: 4096,
    minify: 'esbuild'
    // rollupOptions: {
    //   output: {
    //     // chunkFileNames: 'static/js/[name]-[hash].js',
    //     // entryFileNames: 'static/js/[name]-[hash].js',
    //     // assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
    //   }
    // },
    // terserOptions: {
    //   // 移除 console, debugger
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true
    //   }
    // }
  },
  server: {
    host: '127.0.0.1',
    port: 5174
  }
}))
