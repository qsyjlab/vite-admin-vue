/*
 * @Description: vite.config
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:34:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 23:19:14
 * @FilePath: \vite-admin-vue\vite.config.ts
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { fileURLToPath } from 'url'

// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

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
        resolvers: [ElementPlusResolver()]
      })
      // 'style-resources-loader': {
      //     preProcessor: 'scss',
      //     patterns: [
      //         fileURLToPath(new URL('./src/assets/styles/variable.scss', import.meta.url))
      //       // 这个是绝对路径,不能使用 alias 中配置的别名路径，如@表示的src
      //       resolve('./src/assets/styles/variable.scss'),
      //       resolve('./src/assets/styles/index.scss')
      //     ]
      //   }
    ],
    base: './',
    publicDir: 'dist',
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
    }
  }
})
