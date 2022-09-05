import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { fileURLToPath } from 'url'

// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

import { envDir, projectRootPath } from './build'

// gzip 压缩
// import viteCompression from 'vite-plugin-compression'

// elementplus 处理器
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  root: projectRootPath,
  base: '/',
  envDir,
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      dts: true,
      // 自动导入路径
      include: [],
      dirs: [],
      // 排除路径
      resolvers: [ElementPlusResolver()]
    })
  ],
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
        // src\styles\scss\index.scss
        // 引入 var.scss 这样就可以在全局中使用 var.scss中预定义的变量了
        // 给导入的路径最后加上 ;
        additionalData: '@import "./src/styles/scss/index.scss";'
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
})
