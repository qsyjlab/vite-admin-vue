import { readonly } from '@/utils'

interface GlobalConfig {
  baseApiUrl: string
  projectTitle: string
  projectDesc: string
  storagePrefix: string
}

export function defineConfig(config: GlobalConfig) {
  return readonly(config)
}
