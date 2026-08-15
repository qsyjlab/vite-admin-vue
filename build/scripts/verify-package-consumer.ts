import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const fixture = join(root, 'tests/package-consumer')
const output = join(root, '.output/package-consumer')
const packageDir = join(root, '.output/packages')

const packages = {
  '@framebase/element-plus-pro-components': 'framebase-element-plus-pro-components-',
  '@framebase/element-plus-theme': 'framebase-element-plus-theme-',
  '@framebase/vue-code-editor': 'framebase-vue-code-editor-'
} as const

if (!existsSync(packageDir)) {
  throw new Error('Package tarballs are missing. Run `pnpm pack:packages` first.')
}

const tarballs = Object.fromEntries(
  Object.entries(packages).map(([name, prefix]) => {
    const file = readdirSync(packageDir).find(
      item => item.startsWith(prefix) && item.endsWith('.tgz')
    )
    if (!file) throw new Error(`Missing package tarball for ${name}`)
    return [name, `file:${join(packageDir, file)}`]
  })
)

rmSync(output, { recursive: true, force: true })
mkdirSync(output, { recursive: true })
cpSync(fixture, output, { recursive: true })

const packageJsonPath = join(output, 'package.template.json')
const packageJson = readFileSync(packageJsonPath, 'utf8')
  .replace('__PRO_COMPONENTS_TARBALL__', tarballs['@framebase/element-plus-pro-components'])
  .replace('__THEME_TARBALL__', tarballs['@framebase/element-plus-theme'])
  .replace('__CODE_EDITOR_TARBALL__', tarballs['@framebase/vue-code-editor'])
writeFileSync(join(output, 'package.json'), packageJson)
writeFileSync(join(output, 'pnpm-workspace.yaml'), 'packages: []\n')
rmSync(packageJsonPath)

const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const run = (args: string[]) =>
  execFileSync(pnpm, args, {
    cwd: output,
    env: { ...process.env, CI: '1' },
    stdio: 'inherit'
  })

run(['install', '--offline', '--no-frozen-lockfile', '--ignore-scripts'])
run(['run', 'typecheck'])
run(['run', 'build'])
console.log('Package consumer verification passed.')
