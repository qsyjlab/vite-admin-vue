import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const packages = [
  {
    directory: 'packages/pro-components',
    exports: ['ProForm', 'ProTable', 'ProResult'],
    subpaths: ['pro-form', 'pro-table', 'pro-result']
  },
  {
    directory: 'packages/pro-code-editor',
    exports: ['ProCodeEditor', 'ProJsonEditor'],
    subpaths: ['pro-code-editor', 'pro-json-editor']
  }
]

for (const packageConfig of packages) {
  const directory = resolve(root, packageConfig.directory)
  const manifest = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'))
  const rootImport = resolve(directory, manifest.exports['.'].import)
  const rootTypes = resolve(directory, manifest.exports['.'].types)
  const style = resolve(directory, manifest.exports['./style.css'])
  await Promise.all([access(rootImport), access(rootTypes), access(style)])

  const module = await import(pathToFileURL(rootImport).href)
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
