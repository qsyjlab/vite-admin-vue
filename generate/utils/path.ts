import { resolve } from 'path'

export const projectRootPath = process?.cwd() || resolve(__dirname, '..', '..')

export const outputPath = generaPathResolve('.output')

export function generaPathResolve(path: string) {
  return resolve(projectRootPath, path)
}
