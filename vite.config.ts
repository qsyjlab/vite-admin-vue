import { defineConfig, loadEnv } from 'vite'

import { fileURLToPath } from 'url'

import { envDir, projectRootPath } from './build'
import { createProxy, createVitePlugin } from './build/vite'

// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const buildOutdir = `.output/dist.${configEnv.mode}`

  const viteEnvs = loadEnv(configEnv.mode, envDir, '')

  return {
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
    server: {
      proxy: {
        ...createProxy(viteEnvs.SERVER_PROXY_LIST)
      }
    },
    build: {
      outDir: buildOutdir,
      rollupOptions: {
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
    }
  }
})
