import type { Plugin, ConfigEnv } from 'vite'

import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteMockPlugin } from './plugins/mock'
import { viteAutoImportPlugin, viteComponentsPlugin } from './plugins/element-plus'

export function createVitePlugin(configEnv: ConfigEnv) {
  const { command } = configEnv
  const isBuild = command === 'build'
  const vitePlugins: Plugin[] = [vue(), vueJsx(), viteAutoImportPlugin(), viteComponentsPlugin()]

  const useMock = true

  useMock && vitePlugins.push(viteMockPlugin(isBuild))

  return vitePlugins
}
