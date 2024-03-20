import { readFileSync } from 'fs'
import { pkgPath } from '../utils'

const defaultIgnoreDeps: string[] = [
  '@unocss/reset',
  '@arco-design/color',
  'vue',
  'vue-router',
  'pinia',
  'echarts'
]

const defaultManualChunks: Record<string, string[]> = {
  vue: ['vue', 'vue-router', 'pinia'],
  echarts: ['echarts/core', 'echarts/charts', 'echarts/components', 'echarts/renderers']
}

export function createSplitManuaChunks(
  manualChunks?: Record<string, string[]>,
  ignoreDeps = defaultIgnoreDeps
) {
  const pkgString = readFileSync(pkgPath, 'utf-8')

  const { dependencies = {} } = JSON.parse(pkgString)

  const manualChunksTemp = Object.assign({}, defaultManualChunks, manualChunks)

  Object.keys(dependencies).forEach(dep => {
    if (ignoreDeps.includes(dep) || Reflect.has(manualChunksTemp, dep)) return

    const rootName = dep

    if (manualChunksTemp[rootName]) {
      manualChunksTemp[rootName].push(dep)
    } else {
      manualChunksTemp[rootName] = [dep]
    }
  })
  return manualChunksTemp
}
