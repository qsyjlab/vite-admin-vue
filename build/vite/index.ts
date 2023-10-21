import type { Plugin, ConfigEnv } from 'vite'

import vue from '@vitejs/plugin-vue'

import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteMockPlugin } from './plugins/mock'
import { viteAutoImportPlugin, viteComponentsPlugin } from './plugins/element-plus'
import WindiCSS from 'vite-plugin-windicss'
import { visualizer } from 'rollup-plugin-visualizer'
import { configSvgIconsPlugin } from './plugins/svg-icons'
import legacyPlugin from '@vitejs/plugin-legacy'
// @ts-nocheck
import ElementPlus from 'unplugin-element-plus/vite'

interface Extra {
  legacy?: boolean
}

export function createVitePlugin(configEnv: ConfigEnv, extra?: Extra) {
  const { command } = configEnv

  const { legacy = true } = extra || {}
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
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: '.visualizer.html', //分析图生成的文件名
      open: true //如果存在本地服务端口，将在打包后自动展示
    })
  ]

  if (legacy) {
    vitePlugins.push(
      legacyPlugin({
        renderLegacyChunks: false,
        modernPolyfills: ['es.array.flat-map']
      }) as unknown as Plugin
    )
  }

  const useMock = true

  useMock && vitePlugins.push(viteMockPlugin(isBuild))

  return vitePlugins
}
