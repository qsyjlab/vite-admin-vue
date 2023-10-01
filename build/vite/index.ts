import type { Plugin, ConfigEnv } from 'vite'

import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteMockPlugin } from './plugins/mock'
import { viteAutoImportPlugin, viteComponentsPlugin } from './plugins/element-plus'
import WindiCSS from 'vite-plugin-windicss'
import { visualizer } from 'rollup-plugin-visualizer'
import { configSvgIconsPlugin } from './plugins/svg-icons'
import legacy from '@vitejs/plugin-legacy'
import ElementPlus from 'unplugin-element-plus/vite'

export function createVitePlugin(configEnv: ConfigEnv) {
  const { command } = configEnv
  const isBuild = command === 'build'
  const vitePlugins: Plugin[] = [
    vue(),
    vueJsx(),
    viteAutoImportPlugin(),
    viteComponentsPlugin(),
    WindiCSS(),
    configSvgIconsPlugin({ isBuild }),
    ElementPlus({
      useSource: true
    }),
    legacy({
      renderLegacyChunks: false,
      modernPolyfills: ['es.array.flat-map']
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: '.visualizer.html', //分析图生成的文件名
      open: true //如果存在本地服务端口，将在打包后自动展示
    })
  ]

  const useMock = true

  useMock && vitePlugins.push(viteMockPlugin(isBuild))

  return vitePlugins
}
