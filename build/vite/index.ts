import { type Plugin, type ConfigEnv, loadEnv } from 'vite'

import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'
import legacyPlugin from '@vitejs/plugin-legacy'
import UnoCSS from 'unocss/vite'
import {
  viteMockPlugin,
  viteAutoImportPlugin,
  viteComponentsPlugin,
  configSvgIconsPlugin,
  injectHtmlPlugin
} from './plugins'
// @ts-ignore
import ElementPlus from 'unplugin-element-plus/vite'
import visualizer from 'rollup-plugin-visualizer'
import legecyConfig from '../../legecy.config'
import { envDir } from '../utils'

export function createVitePlugin(configEnv: ConfigEnv) {
  const { command, mode } = configEnv
  const isBuild = command === 'build'

  // 拿到全部的 env
  const viteEnvs = loadEnv(mode, envDir, '')

  const vitePlugins: Plugin[] = [
    vue(),
    vueJsx(),
    viteAutoImportPlugin(),
    viteComponentsPlugin(),
    configSvgIconsPlugin({ isBuild }),
    ElementPlus({
      useSource: true
    }),
    viteMockPlugin(isBuild),
    injectHtmlPlugin({ env: viteEnvs }),
    UnoCSS(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: '.output/visualizer.html', //分析图生成的文件名
      open: false //如果存在本地服务端口，将在打包后自动展示
    })
  ]

  if (viteEnvs.ENABLE_LEGACY === 'true') {
    vitePlugins.push(legacyPlugin(legecyConfig) as unknown as Plugin)
  }

  return vitePlugins
}

export * from './define'
export * from './manua-chunks'
export { createProxy } from './proxy'
