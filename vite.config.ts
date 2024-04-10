import { defineConfig, loadEnv } from 'vite'

import { fileURLToPath } from 'url'

import { envDir, projectRootPath, resolveProjectPath, buildOutdir } from './build'
import { createProxy, createVitePlugin, createDefine, createSplitManuaChunks } from './build/vite'

// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const viteEnvs = loadEnv(configEnv.mode, envDir, '')
  const { mode } = configEnv

  return {
    root: projectRootPath,
    base: viteEnvs.BASE_URL || '/',
    envDir,
    define: createDefine(),
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
      proxy: createProxy(viteEnvs.SERVER_PROXY_LIST)
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: createSplitManuaChunks()
        }
      },
      outDir: resolveProjectPath(buildOutdir, `dist_${mode}`)
    }
  }
})
