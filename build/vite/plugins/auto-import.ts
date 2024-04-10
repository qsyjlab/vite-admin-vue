// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// elementplus 处理器
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export function viteAutoImportPlugin() {
  return AutoImport({
    resolvers: [ElementPlusResolver()]
  })
}

export function viteComponentsPlugin() {
  return Components({
    dts: true,
    include: [],
    dirs: [],
    resolvers: [ElementPlusResolver(), proComponentResolver(), globalComponentResolver()]
  })
}

// pro 组件自动导入
export function proComponentResolver() {
  return name => {
    if (name.startsWith('Pro')) return { name: name, from: '@/components' }
  }
}

// G 组件自动导入
export function globalComponentResolver() {
  return name => {
    if (name.startsWith('G')) return { name: name, from: '@/components' }
  }
}
