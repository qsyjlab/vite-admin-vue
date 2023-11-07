import { type Plugin, type ConfigEnv, loadEnv } from 'vite'

import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteMockPlugin } from './plugins/mock'
import { viteAutoImportPlugin, viteComponentsPlugin } from './plugins/element-plus'
import WindiCSS from 'vite-plugin-windicss'
// import { visualizer } from 'rollup-plugin-visualizer'
import { configSvgIconsPlugin } from './plugins/svg-icons'
import legacyPlugin from '@vitejs/plugin-legacy'
import ElementPlus from 'unplugin-element-plus/vite'
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
    WindiCSS(),
    configSvgIconsPlugin({ isBuild }),
    ElementPlus({
      useSource: true
    })
    // visualizer({
    //   gzipSize: true,
    //   brotliSize: true,
    //   emitFile: false,
    //   filename: '.visualizer.html', //分析图生成的文件名
    //   open: true //如果存在本地服务端口，将在打包后自动展示
    // })
  ]

  if (viteEnvs.ENABLE_LEGACY === 'true') {
    vitePlugins.push(legacyPlugin(legecyConfig) as unknown as Plugin)
  }

  const useMock = true

  useMock && vitePlugins.push(viteMockPlugin(isBuild))

  return vitePlugins
}
