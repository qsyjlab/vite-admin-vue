/*
 * @Description: vite.config
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:34:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-07-20 09:10:16
 * @FilePath: \vite-admin-vue\vite.config.ts
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { fileURLToPath } from 'url'

// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// gzip 压缩
// import viteCompression from 'vite-plugin-compression'

// elementplus 处理器
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
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
      // viteCompression({
      //   verbose: true,
      //   disable: false,
      //   deleteOriginFile: true,
      //   threshold: 10240,
      //   algorithm: 'gzip',
      //   ext: '.gz'
      // })
    ],
    base: '/',
    publicDir: '/',
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
    // 打包后文件分离 文件分离
    build: {
      rollupOptions: {
        output: {
          // chunkFileNames: 'static/js/[name]-[hash].js',
          // entryFileNames: 'static/js/[name]-[hash].js',
          // assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      },
      terserOptions: {
        // 移除 console, debugger
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    esbuild: {
      minify: true
    }
  }
})
