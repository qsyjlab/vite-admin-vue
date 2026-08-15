import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

interface ModulePackageConfig {
  directory: string
  exports: string[]
  subpaths: string[]
}

interface StylePackageConfig {
  directory: string
  styles: string[]
}

interface ModuleExport {
  import: string
  types: string
}

interface PackageManifest {
  name: string
  exports: Record<string, string | ModuleExport>
}

const root = process.cwd()
const packages: Array<ModulePackageConfig | StylePackageConfig> = [
  {
    directory: 'packages/pro-components',
    exports: ['ProForm', 'ProTable', 'ProResult'],
    subpaths: ['pro-form', 'pro-table', 'pro-result']
  },
  {
    directory: 'packages/pro-code-editor',
    exports: ['ProCodeEditor', 'ProJsonEditor'],
    subpaths: ['pro-code-editor', 'pro-json-editor']
  },
  {
    directory: 'packages/element-plus-theme',
    styles: ['.', './style.css', './tokens.css', './dark.css', './components.css']
  }
]

for (const packageConfig of packages) {
  const directory = resolve(root, packageConfig.directory)
  const manifest = JSON.parse(
    await readFile(resolve(directory, 'package.json'), 'utf8')
  ) as PackageManifest

  if ('styles' in packageConfig) {
    await Promise.all(
      packageConfig.styles.map(subpath =>
        access(resolve(directory, getStyleExport(manifest, subpath)))
      )
    )
    continue
  }

  const rootExport = getModuleExport(manifest, '.')
  const rootImport = resolve(directory, rootExport.import)
  const rootTypes = resolve(directory, rootExport.types)
  const style = resolve(directory, getStyleExport(manifest, './style.css'))
  await Promise.all([access(rootImport), access(rootTypes), access(style)])

  const module = (await import(pathToFileURL(rootImport).href)) as Record<string, unknown>
  for (const exportName of packageConfig.exports) {
    if (!(exportName in module)) throw new Error(`${manifest.name} 缺少导出 ${exportName}`)
  }

  for (const subpath of packageConfig.subpaths) {
    await Promise.all([
      access(resolve(directory, `dist/es/${subpath}/index.js`)),
      access(resolve(directory, `dist/types/${subpath}/index.d.ts`))
    ])
  }
}

console.log('Package artifact verification passed.')

function getModuleExport(manifest: PackageManifest, subpath: string): ModuleExport {
  const value = manifest.exports[subpath]
  if (!value || typeof value === 'string') {
    throw new Error(`${manifest.name} 的 ${subpath} 缺少模块导出配置`)
  }
  return value
}

function getStyleExport(manifest: PackageManifest, subpath: string): string {
  const value = manifest.exports[subpath]
  if (typeof value !== 'string') {
    throw new Error(`${manifest.name} 的 ${subpath} 缺少样式导出配置`)
  }
  return value
}
