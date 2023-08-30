import { readonly } from '@/utils'

interface GlobalConfig {
  baseApiUrl: string
  projectTitle: string
  projectDesc: string
}

export function defineConfig(config: GlobalConfig) {
  return readonly(config)
}
