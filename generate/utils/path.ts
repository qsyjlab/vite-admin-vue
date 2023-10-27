import { resolve } from 'path'
import { fileURLToPath } from 'url'

export const projectRootPath = process?.cwd() || resolve(import.meta.url, '..', '..')

export const repoRootPath = resolve(fileURLToPath(import.meta.url), '..', '..', '..')

export const outputPath = generaPathResolve('.output')

export function generaPathResolve(path: string) {
  return resolve(projectRootPath, path)
}
