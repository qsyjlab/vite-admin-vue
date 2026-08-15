// 自动导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// elementplus 处理器
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const migratedProComponents = new Set([
  'ProCheckboxGroup',
  'ProCard',
  'ProConfigProvider',
  'ProDescriptions',
  'ProDrawerForm',
  'ProDragSortTable',
  'ProEditableTable',
  'ProField',
  'ProForm',
  'ProList',
  'ProModalForm',
  'ProPreviewFile',
  'ProRadioGroup',
  'ProSelect',
  'ProStepsForm',
  'ProStatisticCard',
  'ProTable',
  'ProTableSearch',
  'ProTableWithSearch',
  'ProUpload',
  'ProUploadList'
])

const packagedProComponents = new Set([
  ...migratedProComponents,
  'ProEmpty',
  'ProResult',
  'ProCheckCard',
  'ProCheckCardGroup',
  'ProTree',
  'ProTreeSelect',
  'ProQueryFilter'
])
const packagedCodeEditors = new Set(['ProCodeEditor', 'ProJsonEditor'])

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
    if (!name.startsWith('Pro')) return
    if (packagedProComponents.has(name)) {
      return { name, from: '@framebase/element-plus-pro-components' }
    }
    if (packagedCodeEditors.has(name)) {
      return { name, from: '@framebase/vue-code-editor' }
    }
    return {
      name,
      from: '@/components'
    }
  }
}

// G 组件自动导入
export function globalComponentResolver() {
  return name => {
    if (name.startsWith('G')) return { name: name, from: '@/components' }
  }
}
