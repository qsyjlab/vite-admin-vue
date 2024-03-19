import { readFileSync } from 'fs'
import { pkgPath } from '../utils'

export function createDefine() {
  const appInfo: Record<string, any> = {}
  try {
    const pkgString = readFileSync(pkgPath, 'utf-8')

    const { dependencies = {}, devDependencies = {}, repository = {} } = JSON.parse(pkgString)

    appInfo.pkg = {
      dependencies,
      devDependencies,
      repository
    }
  } catch (error) {}

  return {
    __APP_INFO__: JSON.stringify(appInfo)
  }
}
