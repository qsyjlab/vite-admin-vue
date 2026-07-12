import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative, resolve } from 'node:path'

const root = process.cwd()
const packages = [
  {
    name: '@vite-admin/pro-components',
    directory: resolve(root, 'packages/pro-components/src'),
    allowed: new Set([
      'vue',
      'vue-router',
      'element-plus',
      '@element-plus/icons-vue',
      'dayjs',
      'lodash-es',
      'sortablejs'
    ])
  },
  {
    name: '@vite-admin/pro-code-editor',
    directory: resolve(root, 'packages/pro-code-editor/src'),
    allowed: new Set(['vue'])
  }
]

const sourceExtensions = new Set(['.ts', '.tsx', '.vue', '.js', '.mjs'])
const importPattern = /(?:from\s+|import\s*\()\s*['"]([^'"]+)['"]/g
const errors = []

for (const packageConfig of packages) {
  const files = await listFiles(packageConfig.directory)
  for (const file of files) {
    const source = await readFile(file, 'utf8')
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1]
      if (specifier.startsWith('.')) continue
      const dependency = getPackageName(specifier)
      if (specifier.startsWith('@/') || specifier.startsWith('~/')) {
        errors.push(`${relative(root, file)}: 禁止应用别名 ${specifier}`)
      } else if (!packageConfig.allowed.has(dependency)) {
        errors.push(`${relative(root, file)}: 未声明的外部依赖 ${specifier}`)
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log('Package boundary audit passed.')
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(entry => {
      const path = join(directory, entry.name)
      if (entry.isDirectory() && (entry.name === '__tests__' || entry.name === '__type-tests__')) {
        return []
      }
      return entry.isDirectory()
        ? listFiles(path)
        : sourceExtensions.has(extname(path))
          ? [path]
          : []
    })
  )
  return files.flat()
}

function getPackageName(specifier) {
  if (!specifier.startsWith('@')) return specifier.split('/')[0]
  return specifier.split('/').slice(0, 2).join('/')
}
