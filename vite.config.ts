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
        additionalData: '@use "./src/styles/index.scss" as *;'
      }
    }
  },
  build: {
    assetsInlineLimit: 4096,
    minify: 'esbuild',
    rollupOptions: {
      // external: ['tinymce'], // 指定 tinymce 为外部依赖
      output: {
        manualChunks: {
          tinymce: [
            'tinymce',
            'tinymce/icons/default',
            'tinymce/plugins/advlist',
            'tinymce/plugins/anchor',
            'tinymce/plugins/autolink',
            'tinymce/plugins/autosave',
            'tinymce/plugins/code',
            'tinymce/plugins/codesample',
            'tinymce/plugins/directionality',
            'tinymce/plugins/fullscreen',
            'tinymce/plugins/hr',
            'tinymce/plugins/insertdatetime',
            'tinymce/plugins/link',
            'tinymce/plugins/lists',
            'tinymce/plugins/media',
            'tinymce/plugins/nonbreaking',
            'tinymce/plugins/noneditable',
            'tinymce/plugins/pagebreak',
            'tinymce/plugins/paste',
            'tinymce/plugins/preview',
            'tinymce/plugins/print',
            'tinymce/plugins/save',
            'tinymce/plugins/searchreplace',
            'tinymce/plugins/spellchecker',
            'tinymce/plugins/tabfocus',
            'tinymce/plugins/table',
            'tinymce/plugins/template',
            'tinymce/plugins/textpattern',
            'tinymce/plugins/visualblocks',
            'tinymce/plugins/visualchars',
            'tinymce/plugins/wordcount',
            'tinymce/plugins/image',
            'tinymce/themes/silver',
            'tinymce/themes/mobile'
          ],
          echarts: ['echarts']
        }
      }
    }
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
