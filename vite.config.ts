import { defineConfig, loadEnv } from 'vite'

import { fileURLToPath } from 'url'

import { envDir, projectRootPath, resolveProjectPath, buildOutdir } from './build'
import { createProxy, createVitePlugin, createDefine } from './build/vite'

// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const viteEnvs = loadEnv(configEnv.mode, envDir, '')
  const { mode } = configEnv

  return {
    root: projectRootPath,
    base: viteEnvs.BASE_URL || './',
    envDir,
    define: createDefine(),
    plugins: createVitePlugin(configEnv),
    resolve: {
      alias: [
        { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        {
          find: '@framebase/vue-code-editor',
          replacement: fileURLToPath(new URL('./packages/pro-code-editor/src', import.meta.url))
        },
        { find: '~', replacement: fileURLToPath(new URL('./', import.meta.url)) }
      ]
    },
    server: {
      port: 5300,
      proxy: createProxy(viteEnvs.SERVER_PROXY_LIST)
    },
    optimizeDeps: {
      include: ['element-plus', 'echarts']
    },
    build: {
      // rolldownOptions: {
      //   output: {
      //     manualChunks: createSplitManuaChunks()
      //   }
      // },
      outDir: resolveProjectPath(buildOutdir, `dist_${mode}`)
    }
  }
})
