import { readFileSync } from 'fs'
import { pkgPath } from '../utils'

const defaultIgnoreDeps: string[] = [
  '@unocss/reset',
  '@arco-design/color',
  'vue',
  'vue-router',
  'pinia'
]

export function createSplitManuaChunks(
  manualChunks?: Record<string, string[]>,
  ignoreDeps = defaultIgnoreDeps
) {
  const pkgString = readFileSync(pkgPath, 'utf-8')

  const { dependencies = {} } = JSON.parse(pkgString)
  const defaultManualChunks: Record<string, string[]> = {
    vue: ['vue', 'vue-router', 'pinia']
  }

  Object.keys(dependencies).forEach(dep => {
    if (ignoreDeps.includes(dep)) return
    const depsNameArr = dep?.split('/')

    let rootName = ''

    if (depsNameArr.length === 2) {
      rootName = depsNameArr[0].split('@')?.[1]
    } else {
      rootName = dep
    }

    if (defaultManualChunks[rootName]) {
      defaultManualChunks[rootName].push(dep)
    } else {
      defaultManualChunks[rootName] = [dep]
    }
  })

  return manualChunks
}
