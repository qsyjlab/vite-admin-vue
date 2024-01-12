import { resolve } from 'path'

/** 项目根目录 */
export const projectRootPath = process?.cwd() || resolve(__dirname, '..', '..')

/** 环境变量目录 */
export const envDir = resolve(projectRootPath, 'env')

/** 构建产物输出路径  */
export const buildOutdir = resolve(projectRootPath, '.output')

export function resolveProjectPath(...args: string[]) {
  return resolve(projectRootPath, ...args)
}
